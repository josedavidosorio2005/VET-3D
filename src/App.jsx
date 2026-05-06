import React, { Suspense, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DatabaseZap, Search, ShieldCheck } from 'lucide-react'
import InfoCard from './components/InfoCard'
import Sidebar from './components/Sidebar'
import DogCanvas from './components/DogCanvas'
import { fetchAnatomyPart } from './services/anatomyApi'
import { allParts, anatomyParts, systems } from './anatomyData'

function App() {
  const [activeSystem, setActiveSystem] = useState('skeletal')
  const [selectedPart, setSelectedPart]   = useState(anatomyParts.skeletal[0])
  const [remotePart,   setRemotePart]     = useState(anatomyParts.skeletal[0])
  const [apiState,     setApiState]       = useState('idle')
  const [query,        setQuery]          = useState('')

  const activeSystemData = systems.find((s) => s.id === activeSystem)
  const activeParts      = anatomyParts[activeSystem] || []
  const displayedPart    = remotePart?.id === selectedPart?.id ? remotePart : selectedPart

  // Search filter
  const filteredParts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activeParts
    return activeParts.filter((p) => {
      const hay = [p.name, p.latinName, p.summary, p.location, p.function, p.clinical, p.pathology, ...p.tags]
        .filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [activeParts, query])

  // Fetch from API when selection changes
  React.useEffect(() => {
    if (!selectedPart?.id) return
    const ctrl = new AbortController()
    setApiState('loading')
    fetchAnatomyPart(selectedPart.id, ctrl.signal)
      .then((p) => { setRemotePart(p); setApiState('connected') })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setRemotePart(selectedPart)
        setApiState('local')
      })
    return () => ctrl.abort()
  }, [selectedPart])

  const handleSystemChange = (id) => {
    setActiveSystem(id)
    setSelectedPart(anatomyParts[id]?.[0] || null)
    setQuery('')
  }

  const apiLabel = {
    idle:      'Preparando datos',
    loading:   'Consultando API',
    connected: 'API clínica activa',
    local:     'Datos locales',
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
        {/* ── Central viewer ── */}
        <section className="viewer-panel">
          <header className="stage-topbar">
            <div>
              <span className="eyebrow">
                <ShieldCheck size={13} />
                VET-3D · Atlas Clínico Canino
              </span>
              <h1>{activeSystemData?.name}</h1>
              <p>{activeSystemData?.description}</p>
            </div>

            <div className="system-status" style={{ '--status-color': activeSystemData?.accent }}>
              <DatabaseZap size={19} />
              <div>
                <strong>{apiLabel}</strong>
                <span>{allParts.length} estructuras catalogadas</span>
              </div>
            </div>
          </header>

          <div className="viewer-body">
            <div className="dog-canvas">
              <DogCanvas
                activeSystem={activeSystem}
                selectedPart={selectedPart}
                parts={activeParts}
                system={activeSystemData}
                onPartClick={setSelectedPart}
              />
            </div>
          </div>
        </section>

        {/* ── Right info rail ── */}
        <aside className="detail-rail">
          {/* Search */}
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar estructura, síntoma o región…"
            />
          </div>

          {/* Info card for selected part */}
          <AnimatePresence mode="wait">
            {displayedPart && (
              <motion.div
                key={`${displayedPart.id}-${apiState}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                <InfoCard part={displayedPart} system={activeSystemData} apiState={apiState} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Part explorer list */}
          <div className="part-explorer">
            <div className="section-heading">
              <span>Estructuras</span>
              <strong>{filteredParts.length}</strong>
            </div>

            <div className="explorer-list">
              {filteredParts.map((part) => (
                <button
                  key={part.id}
                  className={`explorer-item${selectedPart?.id === part.id ? ' active' : ''}`}
                  onClick={() => setSelectedPart(part)}
                >
                  <span>{part.name}</span>
                  <small>{part.summary?.substring(0, 68)}…</small>
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
