import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Virtual module plugin — exposes atlas images as base64 data-URIs.
 *
 * Import in any component:
 *   import ATLAS from 'virtual:atlas-images'
 *   // ATLAS.skeletal, ATLAS.muscular, ATLAS.cardio, ATLAS.organs, ATLAS.shepherd
 *
 * Images are read once at server start / build time, so no hot-file-copy is
 * ever needed. The dist/ bundle is fully self-contained.
 */
function atlasImagesPlugin() {
  const VIRTUAL_ID  = 'virtual:atlas-images'
  const RESOLVED_ID = '\0virtual:atlas-images'

  const BRAIN = resolve(
    'C:/Users/Usuario/.gemini/antigravity/brain/c2066516-76d5-4f99-9f31-4d345ce009df',
  )

  const FILES = {
    skeletal: 'vet3d_skeleton_1778106854260.png',
    muscular: 'vet3d_muscles_1778106868295.png',
    cardio:   'vet3d_cardiovascular_1778106885187.png',
    organs:   'vet3d_organs_1778106897703.png',
    shepherd: 'vet3d_shepherd_1778106910524.png',
  }

  function buildModule() {
    const out = {}
    for (const [key, file] of Object.entries(FILES)) {
      const p = resolve(BRAIN, file)
      if (existsSync(p)) {
        const b64 = readFileSync(p).toString('base64')
        out[key] = `data:image/png;base64,${b64}`
        console.log(`[VET-3D] ✅ atlas.${key} embedded (${Math.round(b64.length / 1024)} KB)`)
      } else {
        out[key] = ''
        console.warn(`[VET-3D] ⚠️  atlas.${key} not found: ${p}`)
      }
    }
    return `export default ${JSON.stringify(out)}`
  }

  let mod = null   // cached after first build

  return {
    name: 'vet3d-atlas-images',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      if (!mod) mod = buildModule()
      return mod
    },
    // Re-read on HMR if a brain PNG changes (dev only)
    handleHotUpdate({ file }) {
      if (file.includes('vet3d_')) mod = null
    },
  }
}

export default defineConfig({
  plugins: [react(), atlasImagesPlugin()],
  build: {
    chunkSizeWarningLimit: 6000,   // images are large, suppress warning
    outDir: 'dist',
  },
  server: {
    proxy: { '/api': 'http://localhost:8787' },
  },
})
