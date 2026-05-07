/**
 * VET-3D  –  Anatomy Viewer (2-D Atlas)
 *
 * Features:
 *  ① X-Ray Lens      — circular skeleton reveal on mouse hover
 *  ② Holographic HUD — scan line + corner brackets
 *  ③ Pathology Mode  — hotspots turn red, show pathology info
 *  ④ Sonar Search    — expanding rings when a part is found
 *  ⑤ Audio Engine    — synthesized clinical sounds
 */

import React, { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { POSITIONS_2D } from '../hotspotPositions'

// Images served from /public/
const ATLAS = {
  skeletal:  '/atlas_skeleton.png',
  muscular:  '/atlas_muscles.png',
  cardio:    '/atlas_cardio.png',
  digestive: '/atlas_organs.png',
  nervous:   '/atlas_shepherd.png',
  clinical:  '/atlas_shepherd.png',
}

// ── Position lookup ──────────────────────────────────────────────────────────
const mathFallback = (pos) => {
  if (!pos || !Array.isArray(pos) || pos.length < 2) return { x: 50, y: 50 }
  const [x, y] = pos
  const imgX = 84 - ((x + 2.2) / 4.4) * 68
  const imgY = 10 + ((1.6 - y)  / 2.0) * 78
  return {
    x: Math.max(3, Math.min(97, +imgX.toFixed(1))),
    y: Math.max(3, Math.min(97, +imgY.toFixed(1))),
  }
}
const getPos2D = (sys, part) => POSITIONS_2D[sys]?.[part.id] ?? mathFallback(part.position)

const trunc = (s, n = 72) => s && s.length > n ? s.slice(0, n - 1) + '…' : s

// ── Hotspot ──────────────────────────────────────────────────────────────────
const Hotspot = ({ part, selected, color, onClick, activeSystem, pathologyMode, isSonar }) => {
  const [open, setOpen] = useState(false)
  const { x, y } = getPos2D(activeSystem, part)
  const visible = open || selected
  const side    = x > 55 ? 'left' : 'right'

  // Pathology mode overrides colour to red
  const dotColor = pathologyMode ? '#f06666' : color
  const activate = (event) => {
    event.stopPropagation()
    onClick(part)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={part.name}
      aria-pressed={selected}
      className={[
        'atlas-hotspot',
        selected      ? 'selected'  : '',
        visible       ? 'open'      : '',
        isSonar       ? 'sonar'     : '',
        pathologyMode ? 'pathology' : '',
      ].filter(Boolean).join(' ')}
      style={{ left: `${x}%`, top: `${y}%`, '--hc': dotColor }}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activate(event)
        }
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="atlas-dot" />

      <AnimatePresence>
        {visible && (
          <motion.div
            className={`atlas-card atlas-card--${side}`}
            initial={{ opacity: 0, scale: 0.9, x: side === 'right' ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="atlas-card-header" style={{ borderColor: dotColor }}>
              <strong className="atlas-card-name">{part.name}</strong>
              {part.latinName && <em className="atlas-card-latin">{part.latinName}</em>}
            </div>

            <ul className="atlas-card-rows">
              {part.location && (
                <li><span className="atlas-card-icon">📍</span><span>{trunc(part.location, 68)}</span></li>
              )}
              {part.function && (
                <li><span className="atlas-card-icon">⚙</span><span>{trunc(part.function, 78)}</span></li>
              )}
              {pathologyMode && part.pathology ? (
                <li className="atlas-card-pathology">
                  <span className="atlas-card-icon">⚠️</span><span>{trunc(part.pathology, 90)}</span>
                </li>
              ) : part.clinical && (
                <li className="atlas-card-clinical">
                  <span className="atlas-card-icon">🩺</span><span>{trunc(part.clinical, 88)}</span>
                </li>
              )}
            </ul>

            {part.tags?.length > 0 && (
              <div className="atlas-card-tags">
                {part.tags.slice(0, 3).map((t) => (
                  <span key={t} className="atlas-card-tag" style={{ borderColor: dotColor, color: dotColor }}>{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Viewer ──────────────────────────────────────────────────────────────
const DogCanvas = ({
  activeSystem, selectedPart, parts, system, onPartClick,
  pathologyMode, sonarPartId,
}) => {
  const [xrayMode,  setXrayMode]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [mouse,     setMouse]     = useState({ x: -999, y: -999 })
  const wrapperRef = useRef(null)
  const imageRef = useRef(null)

  const imageUrl = ATLAS[activeSystem] ?? ATLAS.skeletal
  const color    = system?.accent ?? '#43d1a8'

  useEffect(() => {
    setImgLoaded(false)
    setImgError(false)
    setMouse({ x: -999, y: -999 })
  }, [imageUrl])

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    if (image.naturalWidth > 0) {
      setImgLoaded(true)
      setImgError(false)
    } else {
      setImgError(true)
    }
  }, [imageUrl])

  const moveLensTo = (clientX, clientY) => {
    const r = wrapperRef.current?.getBoundingClientRect()
    if (!r) return
    setMouse({ x: clientX - r.left, y: clientY - r.top })
  }

  const handleMouseMove = (e) => {
    if (!xrayMode) return
    moveLensTo(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (!xrayMode) return
    const touch = e.touches[0]
    if (!touch) return
    moveLensTo(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    if (!xrayMode) return
    const touch = e.touches[0]
    if (!touch) return
    moveLensTo(touch.clientX, touch.clientY)
  }

  return (
    <div className="atlas-viewer">
      {/* ── Toolbar ── */}
      <div className="atlas-toolbar">
        <span className="atlas-toolbar-label">⬡ SCANNER CLÍNICO</span>
        <div className="atlas-toolbar-actions">
          <button
            type="button"
            className={`atlas-tool-btn${xrayMode ? ' active' : ''}`}
            onClick={() => setXrayMode(v => !v)}
            aria-pressed={xrayMode}
            title="Activar lente de Rayos-X"
          >☢ RAYOS-X</button>
          <div className={`atlas-scan-indicator${imgLoaded ? ' scanning' : ''}`}>
            <span /><span /><span />
          </div>
        </div>
      </div>

      {/* ── Image Stage ── */}
      <div
        ref={wrapperRef}
        className={`atlas-image-wrap${xrayMode ? ' xray-active' : ''}`}
        style={{ '--mx': `${mouse.x}px`, '--my': `${mouse.y}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: -999, y: -999 })}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setMouse({ x: -999, y: -999 })}
      >
        {/* Holographic corners */}
        <div className="holo-corners" aria-hidden>
          <span /><span /><span /><span />
        </div>

        {/* Scan line */}
        {imgLoaded && <div className="scan-line" aria-hidden />}

        {/* Loading shimmer */}
        {!imgLoaded && !imgError && (
          <div className="atlas-shimmer">
            <div className="atlas-shimmer-inner" />
            <p>Inicializando escáner…</p>
          </div>
        )}

        {/* Error */}
        {imgError && (
          <div className="atlas-error">
            <span>⚠</span>
            <p>Imagen no disponible — reinicia el servidor</p>
          </div>
        )}

        {/* Main system image */}
        <motion.img
          ref={imageRef}
          key={imageUrl}
          src={imageUrl}
          className="atlas-image"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => { setImgLoaded(true); setImgError(false) }}
          onError={() => setImgError(true)}
          alt="Atlas anatómico canino"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* X-Ray skeleton overlay — revealed by circular clip at mouse */}
        {xrayMode && (
          <div className="xray-overlay">
            <img
              src="/atlas_skeleton.png"
              className="xray-img"
              alt="Rayos-X"
              draggable={false}
            />
            {/* Lens ring */}
            <div className="xray-ring" />
          </div>
        )}

        {/* Hotspots */}
        {imgLoaded && parts.slice(0, 20).map((part) => (
          <Hotspot
            key={part.id}
            part={part}
            selected={selectedPart?.id === part.id}
            color={color}
            onClick={onPartClick}
            activeSystem={activeSystem}
            pathologyMode={pathologyMode}
            isSonar={sonarPartId === part.id}
          />
        ))}
      </div>
    </div>
  )
}

export default DogCanvas
