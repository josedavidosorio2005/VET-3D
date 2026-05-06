import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Clean, deployment-ready config.
// Images are served from /public/ — no local-path plugin needed.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        // In production there is no backend; the API service falls back
        // gracefully to local data when fetch fails.
      },
    },
  },
})
