import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import InfoCard from './InfoCard'

export default function BottomSheet({ open, part, system, apiState, onClose }) {
  if (!part) return null
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="bs-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="bs-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha clinica de ${part.name}`}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.25 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90) onClose() }}
          >
            <div className="bs-handle-wrap"><div className="bs-handle" /></div>
            <div className="bs-top">
              <span className="bs-sys-label" style={{ color: system?.accent }}>{system?.name}</span>
              <button type="button" className="bs-close" onClick={onClose} aria-label="Cerrar ficha"><X size={20} /></button>
            </div>
            <div className="bs-scroll">
              <InfoCard part={part} system={system} apiState={apiState} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
