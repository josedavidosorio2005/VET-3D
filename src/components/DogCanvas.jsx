import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  OrbitControls,
  Stars,
  useGLTF,
} from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'

const hotspotLimit = 24

const layerOpacity = {
  skeletal: 0.15,
  muscular: 0.28,
  nervous: 0.16,
  cardio: 0.16,
  digestive: 0.18,
  clinical: 0.48,
}

const dogModelUrl = import.meta.env.VITE_DOG_MODEL_URL

const normalizeMeshName = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const createPartLookup = (parts) => {
  const lookup = new Map()

  parts.forEach((part) => {
    ;[part.id, part.name, part.latinName].filter(Boolean).forEach((key) => {
      lookup.set(key.toLowerCase(), part)
      lookup.set(normalizeMeshName(key), part)
    })
  })

  return lookup
}

const cloneMaterial = (material) => {
  if (!material) return material
  return Array.isArray(material) ? material.map((entry) => entry.clone()) : material.clone()
}

const disposeMaterial = (material) => {
  if (!material) return
  const entries = Array.isArray(material) ? material : [material]

  entries.forEach((entry) => {
    Object.values(entry).forEach((value) => {
      if (value?.isTexture) value.dispose()
    })
    entry.dispose?.()
  })
}

const disposeObject = (object) => {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose()
    if (child.material) disposeMaterial(child.material)
  })
}

const findPartForObject = (object, lookup) => {
  let current = object

  while (current) {
    if (current.userData?.partId && lookup.has(current.userData.partId)) {
      return lookup.get(current.userData.partId)
    }

    const rawName = current.name?.toLowerCase()
    const normalizedName = normalizeMeshName(current.name)
    if (rawName && lookup.has(rawName)) return lookup.get(rawName)
    if (normalizedName && lookup.has(normalizedName)) return lookup.get(normalizedName)

    current = current.parent
  }

  return null
}

const MuscleMaterial = ({ color }) => (
  <meshPhysicalMaterial
    color={color}
    roughness={0.2}
    metalness={0.08}
    clearcoat={0.45}
    clearcoatRoughness={0.22}
    emissive={color}
    emissiveIntensity={0.06}
    transparent
    opacity={0.95}
  />
)

const Tube = ({ points, color, radius = 0.016, opacity = 1 }) => {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
    [points],
  )

  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 56, radius, 10, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.08}
        opacity={opacity}
        roughness={0.24}
        transparent={opacity < 1}
      />
    </mesh>
  )
}

const Bone = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], radius = 0.032, color = '#f4f1e8' }) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
    <capsuleGeometry args={[radius, 0.72, 12, 20]} />
    <meshStandardMaterial color={color} envMapIntensity={0.8} metalness={0.05} roughness={0.92} />
  </mesh>
)

const Muscle = ({ position, scale, color, rotation = [0, 0, 0] }) => (
  <mesh position={position} scale={scale} rotation={rotation} castShadow>
    <sphereGeometry args={[0.5, 48, 28]} />
    <MuscleMaterial color={color} />
  </mesh>
)

const SoftOrgan = ({ position, scale, color, opacity = 1, rotation = [0, 0, 0], emissive = '#000000' }) => (
  <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
    <sphereGeometry args={[0.5, 48, 28]} />
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.1}
      metalness={0.08}
      opacity={opacity}
      roughness={0.48}
      transparent={opacity < 1}
    />
  </mesh>
)

const DogBody = ({ activeSystem, opacity: customOpacity }) => {
  const showCoat = activeSystem === 'clinical'
  const opacity = customOpacity ?? layerOpacity[activeSystem] ?? 0.2
  const skinColor = showCoat ? '#8b7964' : '#b9a18c'

  return (
    <group>
      <SoftOrgan position={[-0.25, 0.78, 0]} scale={[1.86, 0.76, 0.61]} color={skinColor} opacity={opacity} />
      <SoftOrgan position={[1.42, 1.02, 0]} scale={[0.6, 0.43, 0.42]} color={skinColor} opacity={opacity + 0.08} />
      <mesh position={[1.9, 0.9, 0]} scale={[0.55, 0.25, 0.3]} rotation={[0, 0, -0.08]} castShadow>
        <coneGeometry args={[0.36, 0.72, 36]} />
        <meshStandardMaterial color={skinColor} opacity={opacity + 0.04} roughness={0.62} transparent />
      </mesh>
    </group>
  )
}

const SkeletalLayer = () => (
  <group>
    <SoftOrgan position={[1.78, 1.12, 0]} scale={[0.5, 0.32, 0.32]} color="#f8efd8" opacity={0.95} />
    <Bone position={[2.02, 0.92, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.55, 1]} radius={0.035} />
    {[-0.95, -0.65, -0.35, -0.05, 0.25, 0.55, 0.85].map((x) => (
      <Bone key={x} position={[x, 1.04, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.42, 1]} radius={0.026} />
    ))}
    {[-0.55, -0.3, -0.05, 0.2, 0.45].map((x) => (
      <mesh key={x} position={[x, 0.78, 0]} scale={[0.86, 0.56, 0.72]} rotation={[0.05, 0, 0]} castShadow>
        <torusGeometry args={[0.34, 0.02, 8, 50]} />
        <meshStandardMaterial color="#f8f1da" opacity={0.78} roughness={0.48} transparent />
      </mesh>
    ))}
    <Bone position={[0.74, 0.86, 0.45]} rotation={[0.2, 0, -0.42]} scale={[1, 0.7, 1]} radius={0.04} />
    <Bone position={[-1.24, 0.62, 0.24]} rotation={[0.2, 0, 0.9]} scale={[1, 0.78, 1]} radius={0.05} />
  </group>
)

const MuscularLayer = () => (
  <group>
    <Muscle position={[1.58, 1.0, 0.36]} scale={[0.25, 0.18, 0.13]} color="#d33a33" />
    <Muscle position={[0.85, 1.03, 0.42]} scale={[0.56, 0.16, 0.09]} color="#db4f42" />
    <Muscle position={[0.62, 0.67, 0.56]} scale={[0.34, 0.38, 0.14]} color="#ec6a55" />
    <Muscle position={[-0.08, 0.84, 0.55]} scale={[1.2, 0.2, 0.08]} color="#ff806a" />
    <Muscle position={[-1.34, 0.65, 0.45]} scale={[0.46, 0.34, 0.14]} color="#df5141" />
    <Muscle position={[-1.1, 0.35, 0.68]} scale={[0.34, 0.5, 0.12]} color="#f0785d" />
  </group>
)

const NervousLayer = () => (
  <group>
    <SoftOrgan position={[1.82, 1.26, 0.1]} scale={[0.28, 0.2, 0.18]} color="#8792ff" emissive="#3e49ff" opacity={0.95} />
    <Tube points={[[1.35, 1.14, 0.13], [0.75, 1.11, 0.13], [0.05, 1.11, 0.14], [-0.8, 1.03, 0.12], [-1.25, 0.82, 0.1]]} color="#9ba4ff" radius={0.018} />
    <Tube points={[[0.62, 0.72, 0.24], [0.58, 0.48, 0.52], [0.68, 0.22, 0.68]]} color="#cfd3ff" radius={0.012} />
    <Tube points={[[-1.1, 0.7, 0.24], [-1.22, 0.43, 0.48], [-1.18, 0.04, 0.66]]} color="#cfd3ff" radius={0.012} />
  </group>
)

const CardioLayer = () => (
  <group>
    <SoftOrgan position={[0.13, 0.77, 0.42]} scale={[0.22, 0.28, 0.18]} color="#d84158" emissive="#a3152c" opacity={0.95} />
    <SoftOrgan position={[-0.1, 0.91, 0.28]} scale={[0.4, 0.28, 0.12]} color="#7fb5c8" opacity={0.52} />
    <SoftOrgan position={[0.22, 0.91, 0.27]} scale={[0.34, 0.25, 0.12]} color="#7fb5c8" opacity={0.52} />
    <Tube points={[[0.18, 0.86, 0.38], [0.0, 0.99, 0.25], [-0.72, 0.76, 0.2]]} color="#e64b5f" radius={0.018} />
    <Tube points={[[0.15, 0.73, 0.34], [0.55, 0.83, 0.24], [1.12, 0.9, 0.38]]} color="#58cde7" radius={0.015} />
  </group>
)

const DigestiveLayer = () => (
  <group>
    <SoftOrgan position={[-0.34, 0.61, 0.5]} scale={[0.34, 0.2, 0.22]} color="#d99a44" opacity={0.9} />
    <SoftOrgan position={[-0.06, 0.64, 0.27]} scale={[0.42, 0.22, 0.18]} color="#8aaa55" opacity={0.88} />
    <SoftOrgan position={[-0.72, 0.78, 0.14]} scale={[0.2, 0.12, 0.12]} color="#b56d62" opacity={0.86} />
    <Tube points={[[-0.48, 0.48, 0.45], [-0.74, 0.44, 0.46], [-0.98, 0.46, 0.25], [-1.45, 0.42, 0.12]]} color="#d8b36c" radius={0.026} />
  </group>
)

const ClinicalLayer = () => (
  <group>
    <SoftOrgan position={[0.18, 0.78, 0.68]} scale={[0.08, 0.08, 0.08]} color="#f7d66b" emissive="#f7d66b" opacity={0.95} />
    <SoftOrgan position={[0.82, 0.84, 0.5]} scale={[0.07, 0.07, 0.07]} color="#43d1a8" emissive="#43d1a8" opacity={0.9} />
    <SoftOrgan position={[-0.95, 0.34, 0.46]} scale={[0.07, 0.07, 0.07]} color="#43d1a8" emissive="#43d1a8" opacity={0.9} />
    <Tube points={[[1.9, 1.18, 0.32], [1.54, 0.82, 0.42], [0.82, 0.84, 0.5], [0.18, 0.78, 0.68], [-0.95, 0.34, 0.46]]} color="#43d1a8" radius={0.009} opacity={0.72} />
  </group>
)

const Hotspot = ({ part, selected, color, onClick }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <group>
      <mesh
        position={part.position}
        onClick={(event) => {
          event.stopPropagation()
          onClick(part)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[selected ? 0.1 : 0.08, 16, 16]} />
        <meshBasicMaterial color={color} opacity={0} transparent depthWrite={false} />
      </mesh>

      <Html position={part.position} distanceFactor={7.2} zIndexRange={[70, 10]}>
        <button
          className={`hotspot ${selected ? 'selected' : ''}`}
          style={{ '--hotspot-color': color }}
          onClick={() => onClick(part)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label={`Seleccionar ${part.name}`}
        >
          <span />
        </button>
        <AnimatePresence>
          {(hovered || selected) && (
            <motion.div
              className="hotspot-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {part.name}
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  )
}

const ProceduralDogModel = ({ activeSystem, parts, selectedPart, system, onPartClick }) => {
  const group = useRef()
  const isDual = activeSystem === 'skeletal' || activeSystem === 'muscular'

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    }
  })

  return (
    <group ref={group}>
      {isDual ? (
        <group>
          <group position={[-1.2, 0, 0]}>
            <DogBody activeSystem="skeletal" opacity={0.12} />
            <SkeletalLayer />
            {activeSystem === 'skeletal' &&
              parts.slice(0, hotspotLimit).map((part) => (
                <Hotspot key={part.id} part={part} selected={selectedPart?.id === part.id} color="#d8bc77" onClick={onPartClick} />
              ))}
          </group>

          <group position={[1.2, 0, 0]}>
            <DogBody activeSystem="muscular" opacity={0.12} />
            <MuscularLayer />
            {activeSystem === 'muscular' &&
              parts.slice(0, hotspotLimit).map((part) => (
                <Hotspot key={part.id} part={part} selected={selectedPart?.id === part.id} color="#ff927a" onClick={onPartClick} />
              ))}
          </group>
        </group>
      ) : (
        <group rotation={[0, -0.45, 0]}>
          <DogBody activeSystem={activeSystem} />
          <SkeletalLayer />
          {activeSystem === 'nervous' && <NervousLayer />}
          {activeSystem === 'cardio' && <CardioLayer />}
          {activeSystem === 'digestive' && <DigestiveLayer />}
          {activeSystem === 'clinical' && <ClinicalLayer />}
          {parts.slice(0, hotspotLimit).map((part) => (
            <Hotspot key={part.id} part={part} selected={selectedPart?.id === part.id} color={system.accent} onClick={onPartClick} />
          ))}
        </group>
      )}
    </group>
  )
}

const ClinicalAssetModel = ({ assetUrl, allParts, onPartClick }) => {
  const gltf = useGLTF(assetUrl, true, true)
  const lookup = useMemo(() => createPartLookup(allParts), [allParts])
  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true)

    clone.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      child.geometry = child.geometry?.clone()
      child.material = cloneMaterial(child.material)

      const part = findPartForObject(child, lookup)
      if (part) child.userData.partId = part.id
    })

    return clone
  }, [gltf.scene, lookup])

  useEffect(() => () => disposeObject(scene), [scene])

  const handleClick = (event) => {
    const part = findPartForObject(event.object, lookup)
    if (!part) return

    event.stopPropagation()
    onPartClick(part)
  }

  return (
    <primitive
      object={scene}
      position={[0, 0.15, 0]}
      scale={1}
      onClick={handleClick}
      onPointerOver={(event) => {
        if (findPartForObject(event.object, lookup)) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    />
  )
}

const CanvasLoader = () => (
  <Html center>
    <div className="canvas-loader">
      <span className="loader-ring" />
      <strong>VET-3D</strong>
      <small>Cargando atlas clinico</small>
    </div>
  </Html>
)

const DogCanvas = ({ activeSystem, selectedPart, parts, allParts, system, onPartClick }) => {
  return (
    <div className="dog-canvas">
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 35 }} dpr={[1, 2]}>
        <color attach="background" args={['#020404']} />
        <fog attach="fog" args={['#020404', 5, 12]} />

        <ambientLight intensity={0.18} />
        <hemisphereLight args={['#ffffff', '#000000', 0.28]} />
        <spotLight position={[5, 10, 5]} angle={0.34} penumbra={1} intensity={2.7} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[0, 3, -6]} intensity={5.2} color="#6ac7ff" distance={15} />
        <pointLight position={[-3, 1, -4]} intensity={2.6} color="#d8bc77" distance={10} />
        <rectAreaLight position={[-5, 2, 5]} width={10} height={10} intensity={0.45} color="#43d1a8" />

        <Environment preset="night" background={false} />
        <Stars radius={15} depth={50} count={450} factor={4} saturation={0} fade speed={0.7} />

        <Suspense fallback={<CanvasLoader />}>
          <Float speed={1.5} rotationIntensity={0.16} floatIntensity={0.48}>
            {dogModelUrl ? (
              <ClinicalAssetModel assetUrl={dogModelUrl} allParts={allParts} onPartClick={onPartClick} />
            ) : (
              <ProceduralDogModel
                activeSystem={activeSystem}
                selectedPart={selectedPart}
                parts={parts}
                system={system}
                onPartClick={onPartClick}
              />
            )}
          </Float>
        </Suspense>

        <ContactShadows position={[0, -0.05, 0]} scale={10} blur={3} opacity={0.38} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={8} target={[0, 0.8, 0]} makeDefault />
      </Canvas>
    </div>
  )
}

export default DogCanvas
