import React from 'react'

export default function MobileNav({ systems, activeSystem, onSystemChange }) {
  return (
    <nav className="mobile-nav" role="navigation" aria-label="Sistemas anatómicos">
      {systems.map((sys) => {
        const Icon = sys.icon
        const active = activeSystem === sys.id
        const label = sys.name.split(' ')[0].replace(',', '')
        return (
          <button
            type="button"
            key={sys.id}
            className={`mnav-btn${active ? ' active' : ''}`}
            style={{ '--sc': sys.accent }}
            onClick={() => onSystemChange(sys.id)}
            aria-label={sys.name}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={21} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
