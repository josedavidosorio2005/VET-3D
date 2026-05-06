/**
 * VET-3D  –  Anatomy Viewer (2-D Atlas)
 *
 * Each system shows its own full-width photorealistic image from /public/.
 * Hotspot positions are calibrated against the actual atlas images.
 * Tooltips show: name, latin name, location, function, and clinical info.
 */

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { POSITIONS_2D } from '../hotspotPositions'

// Images served from /public/ — works in dev AND production deploy
const ATLAS = {
  skeletal:  '/atlas_skeleton.png',
  muscular:  '/atlas_muscles.png',
  cardio:    '/atlas_cardio.png',
  digestive: '/atlas_organs.png',
  nervous:   '/atlas_shepherd.png',
  clinical:  '/atlas_shepherd.png',
}


// ── Position lookup: calibrated map first, math fallback ─────────────────────
// Math fallback: dog head LEFT, tail RIGHT (from screenshot analysis)
// 3-D x: -2.2 (tail) to +2.2 (head)  → img x: 84% (tail) to 16% (head)
// 3-D y: -0.4 (paw)  to +1.6 (top)   → img y: 88% (paw)  to 10% (top)
const mathFallback = (pos) => {
  if (!pos || !Array.isArray(pos) || pos.length < 2) return { x: 50, y: 50 }
  const [x, y] = pos
  const imgX = 84 - ((x + 2.2) / 4.4) * 68   // head LEFT: high x3D → low imgX
  const imgY = 10 + ((1.6 - y)  / 2.0) * 78
  return {
    x: Math.max(3, Math.min(97, Math.round(imgX * 10) / 10)),
    y: Math.max(3, Math.min(97, Math.round(imgY * 10) / 10)),
  }
}

const getPos2D = (activeSystem, part) => {
  const cal = POSITIONS_2D[activeSystem]?.[part.id]
  return cal ?? mathFallback(part.position)
}


// Truncate text to N chars
const trunc = (str, n = 72) =>
  str && str.length > n ? str.slice(0, n - 1) + '…' : str

// ── Rich hotspot with inline clinical card ────────────────────────────────────
const Hotspot = ({ part, selected, color, onClick, activeSystem }) => {
  const [open, setOpen] = useState(false)
  const { x, y } = getPos2D(activeSystem, part)
  const visible = open || selected

  // Open tooltip to the right if dot is in left half, left if in right half
  const side = x > 55 ? 'left' : 'right'

  return (
    <div
      role="button"
      aria-label={part.name}
      className={`atlas-hotspot${selected ? ' selected' : ''}${visible ? ' open' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, '--hc': color }}
      onClick={(e) => { e.stopPropagation(); onClick(part) }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Pulsing dot */}
      <span className="atlas-dot" />

      {/* Rich tooltip card */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`atlas-card atlas-card--${side}`}
            initial={{ opacity: 0, scale: 0.9, x: side === 'right' ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <div className="atlas-card-header" style={{ borderColor: color }}>
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
              {part.clinical && (
                <li className="atlas-card-clinical">
                  <span className="atlas-card-icon">🩺</span><span>{trunc(part.clinical, 88)}</span>
                </li>
              )}
            </ul>

            {part.tags?.length > 0 && (
              <div className="atlas-card-tags">
                {part.tags.slice(0, 3).map((t) => (
                  <span key={t} className="atlas-card-tag" style={{ borderColor: color, color }}>{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Image panel for a single system ──────────────────────────────────────────
const SystemPanel = ({ imageUrl, parts, selectedPart, color, onPartClick, hotspotLimit = 20, activeSystem }) => {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  useEffect(() => { setLoaded(false); setError(false) }, [imageUrl])

  return (
    <div className="atlas-image-wrap">
      {!loaded && !error && (
        <div className="atlas-shimmer">
          <div className="atlas-shimmer-inner" />
          <p>Cargando imagen anatómica…</p>
        </div>
      )}
      {error && (
        <div className="atlas-error">
          <span>⚠</span>
          <p>Imagen no disponible — reinicia el servidor</p>
        </div>
      )}

      <motion.img
        key={imageUrl}
        src={imageUrl}
        className="atlas-image"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => { setLoaded(true); setError(false) }}
        onError={() => setError(true)}
        alt="Atlas anatómico canino"
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {loaded && parts.slice(0, hotspotLimit).map((part) => (
        <Hotspot
          key={part.id}
          part={part}
          selected={selectedPart?.id === part.id}
          color={color}
          onClick={onPartClick}
          activeSystem={activeSystem}
        />
      ))}
    </div>
  )
}

// ── Main viewer ───────────────────────────────────────────────────────────────
const DogCanvas = ({ activeSystem, selectedPart, parts, system, onPartClick }) => {
  return (
    <div className="atlas-viewer">
      <SystemPanel
        imageUrl={ATLAS[activeSystem] ?? ATLAS.skeletal}
        parts={parts}
        selectedPart={selectedPart}
        color={system?.accent ?? '#43d1a8'}
        onPartClick={onPartClick}
        activeSystem={activeSystem}
      />
    </div>
  )
}

export default DogCanvas

