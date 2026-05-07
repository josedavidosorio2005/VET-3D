import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div className="splash" exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5 }}>
      <div className="splash-grid" aria-hidden />
      <div className="splash-scanline" aria-hidden />

      <div className="splash-center">
        <motion.div
          className="splash-mark"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
        >V3D</motion.div>

        <motion.h1
          className="splash-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >VET<span>-3D</span></motion.h1>

        <motion.p
          className="splash-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >Atlas Clínico Canino Interactivo</motion.p>

        <div className="splash-track">
          <motion.div
            className="splash-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.p
          className="splash-caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ delay: 1.1, duration: 1.4 }}
        >⬡ Inicializando módulo anatómico…</motion.p>
      </div>
    </motion.div>
  )
}
