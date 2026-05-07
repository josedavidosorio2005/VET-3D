/**
 * VET-3D Clinical Audio Engine
 * Uses Web Audio API — no external files, zero dependencies.
 */

let ctx = null
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

const tone = (freq, endFreq, type, vol, dur) => {
  try {
    const c = getCtx()
    const osc  = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(endFreq, c.currentTime + dur)
    gain.gain.setValueAtTime(vol, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + dur)
  } catch (_) {}
}

/** Ping clínico — al seleccionar un punto anatómico */
export const playSelect = () => tone(1400, 700, 'sine', 0.07, 0.18)

/** Sweep de escaneo — al cambiar de sistema */
export const playScan = () => tone(120, 600, 'sawtooth', 0.04, 0.45)

/** Pulso de radar — cuando se localiza por búsqueda */
export const playSonar = () => {
  tone(800, 1600, 'sine', 0.06, 0.12)
  setTimeout(() => tone(800, 1600, 'sine', 0.04, 0.10), 160)
}

/** Modo patología activado */
export const playAlert = () => {
  tone(220, 440, 'square', 0.03, 0.08)
  setTimeout(() => tone(220, 440, 'square', 0.03, 0.08), 110)
}
