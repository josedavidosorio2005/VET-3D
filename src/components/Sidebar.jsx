import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, MousePointer2, Rotate3D } from 'lucide-react'

const Sidebar = ({
  systems,
  activeSystem,
  activeParts,
  selectedPart,
  onSystemChange,
  onPartSelect,
}) => {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">V3D</div>
        <div>
          <h2>VET-3D</h2>
          <p>Atlas clinico canino</p>
        </div>
      </div>

      <section className="nav-section">
        <div className="section-heading">
          <span>Sistemas</span>
          <strong>{systems.length}</strong>
        </div>

        <div className="system-list">
          {systems.map((system, index) => {
            const Icon = system.icon
            const isActive = activeSystem === system.id

            return (
              <motion.button
                key={system.id}
                className={`system-card ${isActive ? 'active' : ''}`}
                onClick={() => onSystemChange(system.id)}
                style={{ '--system-color': system.color, '--system-accent': system.accent }}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <span className="system-icon">
                  <Icon size={20} />
                </span>
                <span className="system-card-content">
                  <strong>{system.name}</strong>
                  <small>{system.description}</small>
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="nav-section compact">
        <div className="section-heading">
          <span>Partes visibles</span>
          <strong>{activeParts.length}</strong>
        </div>

        <div className="mini-part-list">
          {activeParts.slice(0, 7).map((part) => (
            <button
              key={part.id}
              className={selectedPart?.id === part.id ? 'active' : ''}
              onClick={() => onPartSelect(part)}
            >
              {part.name}
            </button>
          ))}
        </div>
      </section>

      <section className="control-card" aria-label="Controles principales">
        <div>
          <Rotate3D size={18} />
          <span>Rotacion orbital</span>
        </div>
        <div>
          <MousePointer2 size={18} />
          <span>Seleccion anatomica</span>
        </div>
        <div>
          <BookOpen size={18} />
          <span>Ficha clinica REST</span>
        </div>
      </section>
    </aside>
  )
}

export default Sidebar
