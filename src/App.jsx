import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, DatabaseZap, Search, ShieldCheck } from 'lucide-react'
import InfoCard from './components/InfoCard'
import Sidebar from './components/Sidebar'
import { fetchAnatomyPart } from './services/anatomyApi'
import { allParts, anatomyParts, systems } from './anatomyData'

const DogCanvas = React.lazy(() => import('./components/DogCanvas'))

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="viewer-fallback">
          <AlertTriangle size={36} />
          <h2>No se pudo cargar el visor 3D</h2>
          <p>Recarga la pagina o revisa la ruta del modelo GLB.</p>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [activeSystem, setActiveSystem] = useState('skeletal')
  const [selectedPart, setSelectedPart] = useState(anatomyParts.skeletal[0])
  const [remotePart, setRemotePart] = useState(anatomyParts.skeletal[0])
  const [apiState, setApiState] = useState('idle')
  const [query, setQuery] = useState('')

  const activeSystemData = systems.find((system) => system.id === activeSystem)
  const activeParts = anatomyParts[activeSystem] || []
  const displayedPart = remotePart?.id === selectedPart?.id ? remotePart : selectedPart

  const filteredParts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return activeParts

    return activeParts.filter((part) => {
      const haystack = [
        part.name,
        part.latinName,
        part.summary,
        part.location,
        part.function,
        part.clinical,
        part.pathology,
        ...part.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [activeParts, query])

  useEffect(() => {
    if (!selectedPart?.id) return

    const controller = new AbortController()
    setApiState('loading')

    fetchAnatomyPart(selectedPart.id, controller.signal)
      .then((part) => {
        setRemotePart(part)
        setApiState('connected')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setRemotePart(selectedPart)
        setApiState('local')
      })

    return () => controller.abort()
  }, [selectedPart])

  const handleSystemChange = (systemId) => {
    setActiveSystem(systemId)
    setSelectedPart(anatomyParts[systemId]?.[0] || null)
    setQuery('')
  }

  const apiLabel = {
    idle: 'Preparando datos',
    loading: 'Consultando API clinica',
    connected: 'API clinica activa',
    local: 'Datos locales de respaldo',
  }[apiState]

  return (
    <div className="app-shell">
      <Sidebar
        systems={systems}
        activeSystem={activeSystem}
        activeParts={activeParts}
        selectedPart={selectedPart}
        onSystemChange={handleSystemChange}
        onPartSelect={setSelectedPart}
      />

      <main className="main-stage">
        <section className="viewer-panel">
          <header className="stage-topbar">
            <div>
              <span className="eyebrow">
                <ShieldCheck size={14} />
                VET-3D Clinical Atlas
              </span>
              <h1>{activeSystemData?.name}</h1>
              <p>{activeSystemData?.description}</p>
            </div>

            <div className="system-status" style={{ '--status-color': activeSystemData?.accent }}>
              <DatabaseZap size={20} />
              <div>
                <strong>{apiLabel}</strong>
                <span>{allParts.length} estructuras catalogadas</span>
              </div>
            </div>
          </header>

          <div className="viewer-body">
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="viewer-loading">
                    <div className="canvas-loader">
                      <span className="loader-ring" />
                      <strong>VET-3D</strong>
                      <small>Preparando motor 3D</small>
                    </div>
                  </div>
                }
              >
                <DogCanvas
                  activeSystem={activeSystem}
                  selectedPart={selectedPart}
                  parts={activeParts}
                  allParts={allParts}
                  system={activeSystemData}
                  onPartClick={setSelectedPart}
                />
              </Suspense>
            </ErrorBoundary>

            <div className="clinical-note">
              <ShieldCheck size={14} />
              <span>Click en una estructura para traer su ficha desde /api/anatomy/:partId.</span>
            </div>
          </div>
        </section>

        <aside className="detail-rail">
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar estructura, sintoma o region"
            />
          </div>

          <AnimatePresence mode="wait">
            {displayedPart && (
              <motion.div
                key={`${displayedPart.id}-${apiState}`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.24 }}
              >
                <InfoCard part={displayedPart} system={activeSystemData} apiState={apiState} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="part-explorer">
            <div className="section-heading">
              <span>Resultados</span>
              <strong>{filteredParts.length}</strong>
            </div>

            <div className="explorer-list">
              {filteredParts.map((part) => (
                <button
                  key={part.id}
                  className={`explorer-item ${selectedPart?.id === part.id ? 'active' : ''}`}
                  onClick={() => setSelectedPart(part)}
                >
                  <span>{part.name}</span>
                  <small>{part.summary.substring(0, 70)}...</small>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
