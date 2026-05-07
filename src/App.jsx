import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DatabaseZap, FlaskConical, Menu, Search, ShieldCheck, X } from 'lucide-react'
import InfoCard from './components/InfoCard'
import Sidebar from './components/Sidebar'
import DogCanvas from './components/DogCanvas'
import BottomSheet from './components/BottomSheet'
import MobileNav from './components/MobileNav'
import SplashScreen from './components/SplashScreen'
import { fetchAnatomyPart } from './services/anatomyApi'
import { allParts, anatomyParts, systems } from './anatomyData'
import { playAlert, playScan, playSelect, playSonar } from './utils/audio'

function App() {
  const [splash,        setSplash]        = useState(() => !new URLSearchParams(window.location.search).has('visualCheck'))
  const [activeSystem,  setActiveSystem]  = useState('skeletal')
  const [selectedPart,  setSelectedPart]  = useState(anatomyParts.skeletal[0])
  const [remotePart,    setRemotePart]    = useState(anatomyParts.skeletal[0])
  const [apiState,      setApiState]      = useState('idle')
  const [query,         setQuery]         = useState('')
  const [pathologyMode, setPathologyMode] = useState(false)
  const [sonarPartId,   setSonarPartId]   = useState(null)
  const [sheetOpen,     setSheetOpen]     = useState(false)
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const sonarTimer = useRef(null)
  const lastSonarMatch = useRef(null)

  const activeSystemData = systems.find((s) => s.id === activeSystem)
  const activeParts      = anatomyParts[activeSystem] || []
  const displayedPart    = remotePart?.id === selectedPart?.id ? remotePart : selectedPart

  const filteredParts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activeParts
    return activeParts.filter((p) => {
      const hay = [p.name, p.latinName, p.summary, p.location, p.function, p.clinical, p.pathology, ...p.tags]
        .filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [activeParts, query])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q || filteredParts.length !== 1) {
      lastSonarMatch.current = null
      return
    }
    const matchKey = `${q}:${filteredParts[0].id}`
    if (lastSonarMatch.current === matchKey) return

    lastSonarMatch.current = matchKey
    playSonar()
    setSonarPartId(filteredParts[0].id)
    clearTimeout(sonarTimer.current)
    sonarTimer.current = setTimeout(() => setSonarPartId(null), 3000)
  }, [filteredParts, query])

  useEffect(() => () => clearTimeout(sonarTimer.current), [])

  React.useEffect(() => {
    if (!selectedPart?.id) return
    const ctrl = new AbortController()
    setApiState('loading')
    fetchAnatomyPart(selectedPart.id, ctrl.signal)
      .then((p) => { setRemotePart(p); setApiState('connected') })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setRemotePart(selectedPart); setApiState('local')
      })
    return () => ctrl.abort()
  }, [selectedPart])

  const handleSystemChange = (id) => {
    playScan()
    setActiveSystem(id)
    setSelectedPart(anatomyParts[id]?.[0] || null)
    setQuery('')
    setSonarPartId(null)
    setSidebarOpen(false)
    setSheetOpen(false)
  }

  const selectPart = (part, { openSheet = false } = {}) => {
    playSelect()
    setSelectedPart(part)
    setSonarPartId(part.id)
    clearTimeout(sonarTimer.current)
    sonarTimer.current = setTimeout(() => setSonarPartId(null), 2200)
    if (openSheet) setSheetOpen(true)
  }

  const handlePartClick = (part) => selectPart(part, { openSheet: true })
  const handleRailPartSelect = (part) => selectPart(part)

  const handlePathologyToggle = () => {
    playAlert()
    setPathologyMode(v => !v)
  }

  const apiLabel = {
    idle: 'Preparando', loading: 'Consultando API',
    connected: 'API activa', local: 'Datos locales',
  }[apiState]

  return (
    <>
      {/* ── Splash ── */}
      <AnimatePresence>
        {splash && <SplashScreen key="splash" onDone={() => setSplash(false)} />}
      </AnimatePresence>

      <div className="app-shell">

        {/* ── Mobile overlay sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div className="mob-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />
              <motion.div className="mob-sidebar" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
                <button type="button" className="mob-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu"><X size={20} /></button>
                <Sidebar systems={systems} activeSystem={activeSystem} activeParts={activeParts} selectedPart={selectedPart} onSystemChange={handleSystemChange} onPartSelect={(p) => { selectPart(p, { openSheet: true }); setSidebarOpen(false) }} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Desktop sidebar ── */}
        <Sidebar
          systems={systems} activeSystem={activeSystem} activeParts={activeParts}
          selectedPart={selectedPart} onSystemChange={handleSystemChange} onPartSelect={handleRailPartSelect}
        />

        <main className="main-stage">
          {/* ── Central viewer ── */}
          <section className={`viewer-panel${pathologyMode ? ' pathology-panel' : ''}`}>

            {/* Mobile top bar */}
            <div className="mobile-topbar">
              <button type="button" className="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir sistemas"><Menu size={22} /></button>
              <span className="mobile-topbar-title">VET-3D</span>
              <button type="button" className={`pathology-btn compact${pathologyMode ? ' active' : ''}`} onClick={handlePathologyToggle} aria-pressed={pathologyMode} aria-label="Modo patologia">
                <FlaskConical size={16} />
              </button>
            </div>

            <header className="stage-topbar">
              <div>
                <span className="eyebrow"><ShieldCheck size={13} />VET-3D · Atlas Clínico Canino</span>
                <h1>{activeSystemData?.name}</h1>
                <p>{activeSystemData?.description}</p>
              </div>
              <div className="topbar-actions">
                <button type="button" className={`pathology-btn${pathologyMode ? ' active' : ''}`} onClick={handlePathologyToggle} title="Modo patología" aria-pressed={pathologyMode}>
                  <FlaskConical size={16} />{pathologyMode ? 'PATOLOGÍA ✓' : 'Ver Patologías'}
                </button>
                <div className="system-status" style={{ '--status-color': activeSystemData?.accent }}>
                  <DatabaseZap size={19} />
                  <div>
                    <strong>{apiLabel}</strong>
                    <span>{allParts.length} estructuras</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="viewer-body">
              <div className="dog-canvas">
                <DogCanvas
                  activeSystem={activeSystem} selectedPart={selectedPart}
                  parts={activeParts} system={activeSystemData}
                  onPartClick={handlePartClick} pathologyMode={pathologyMode}
                  sonarPartId={sonarPartId}
                />
              </div>
            </div>
          </section>

          {/* ── Right info rail (desktop/tablet) ── */}
          <aside className="detail-rail">
            <div className="search-box">
              <Search size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar estructura, síntoma…" />
              {query && <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Limpiar busqueda">✕</button>}
            </div>

            {pathologyMode && (
              <motion.div className="pathology-banner" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                ⚠ MODO PATOLOGÍA — hotspots muestran enfermedades
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {displayedPart && (
                <motion.div key={`${displayedPart.id}-${apiState}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                  <InfoCard part={displayedPart} system={activeSystemData} apiState={apiState} pathologyMode={pathologyMode} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="part-explorer">
              <div className="section-heading">
                <span>Estructuras</span><strong>{filteredParts.length}</strong>
              </div>
              <div className="explorer-list">
                {filteredParts.map((part) => (
                  <button
                    key={part.id}
                    className={`explorer-item${selectedPart?.id === part.id ? ' active' : ''}${sonarPartId === part.id ? ' sonar-item' : ''}`}
                    onClick={() => handleRailPartSelect(part)}
                  >
                    <span>{part.name}</span>
                    <small>{part.summary?.substring(0, 60)}…</small>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </main>

        {/* ── Mobile bottom navigation ── */}
        <MobileNav systems={systems} activeSystem={activeSystem} onSystemChange={handleSystemChange} />

        {/* ── Mobile bottom sheet ── */}
        <BottomSheet open={sheetOpen} part={displayedPart} system={activeSystemData} apiState={apiState} onClose={() => setSheetOpen(false)} />
      </div>
    </>
  )
}

export default App
