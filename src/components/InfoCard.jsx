import React from 'react'
import { Crosshair, HeartPulse, Info, MapPin, Tags } from 'lucide-react'

const sourceLabel = {
  idle: 'Preparando',
  loading: 'Cargando API',
  connected: 'API REST',
  local: 'Respaldo local',
}

const InfoCard = ({ part, system, apiState }) => {
  const SystemIcon = system.icon

  return (
    <article className="info-card clinical-atlas" style={{ '--system-color': system.accent }}>
      {part.imageUrl && (
        <div className="info-image">
          <img src={part.imageUrl} alt={part.name} />
          <div className="image-overlay" />
        </div>
      )}

      <header>
        <div className="system-badge">
          <SystemIcon size={14} />
          <span>{system.name}</span>
          <em>{sourceLabel[apiState]}</em>
        </div>
        <h2>{part.name}</h2>
        {part.latinName && (
          <p className="latin-name">
            <i>{part.latinName}</i>
          </p>
        )}
        <p className="summary-text">{part.summary}</p>
      </header>

      <div className="info-grid">
        <section className="info-item">
          <MapPin size={16} className="icon-gold" />
          <div>
            <strong>UBICACION</strong>
            <p>{part.location}</p>
          </div>
        </section>

        <section className="info-item">
          <Crosshair size={16} className="icon-gold" />
          <div>
            <strong>FUNCION</strong>
            <p>{part.function}</p>
          </div>
        </section>

        <section className="info-item clinical-highlight">
          <Info size={16} className="icon-teal" />
          <div>
            <strong>IMPORTANCIA CLINICA</strong>
            <p>{part.clinical}</p>
          </div>
        </section>

        {part.pathology && (
          <section className="info-item pathology-alert">
            <HeartPulse size={16} className="icon-red" />
            <div>
              <strong>PATOLOGIAS COMUNES</strong>
              <p>{part.pathology}</p>
            </div>
          </section>
        )}
      </div>

      <footer>
        <Tags size={14} />
        <div className="tag-cloud">
          {part.tags.map((tag) => (
            <span key={tag} className="clinical-tag">
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  )
}

export default InfoCard
