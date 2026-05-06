import cors from 'cors'
import express from 'express'
import { pathToFileURL } from 'node:url'
import { allParts, anatomyParts, systems } from '../src/anatomyData.js'

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]

const parseOrigins = (value) =>
  value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) || []

const sanitizeSystem = ({ icon, ...system }) => system

const findSystemForPart = (partId) => {
  const systemEntry = Object.entries(anatomyParts).find(([, parts]) => parts.some((part) => part.id === partId))
  if (!systemEntry) return null

  return sanitizeSystem(systems.find((system) => system.id === systemEntry[0]))
}

export function createApp(options = {}) {
  const envOrigins = parseOrigins(process.env.FRONTEND_ORIGIN)
  const allowedOrigins = new Set(options.allowedOrigins || (envOrigins.length ? envOrigins : defaultOrigins))
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '64kb' }))
  app.use(
    cors({
      allowedHeaders: ['Accept', 'Content-Type'],
      methods: ['GET', 'OPTIONS'],
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true)
          return
        }

        callback(new Error(`CORS origin denied: ${origin}`))
      },
    }),
  )

  app.get('/api/health', (request, response) => {
    response.json({
      ok: true,
      service: 'vet-3d-anatomy-api',
      parts: allParts.length,
      systems: systems.length,
    })
  })

  app.get('/api/anatomy', (request, response) => {
    response.json({
      systems: systems.map(sanitizeSystem),
      parts: allParts,
      count: allParts.length,
    })
  })

  app.get('/api/anatomy/:partId', (request, response) => {
    const part = allParts.find((entry) => entry.id === request.params.partId)

    if (!part) {
      response.status(404).json({
        error: 'Anatomy part not found',
        partId: request.params.partId,
      })
      return
    }

    response.json({
      ...part,
      system: findSystemForPart(part.id),
    })
  })

  app.use('/api', (request, response) => {
    response.status(404).json({ error: 'API route not found' })
  })

  app.use((error, request, response, next) => {
    if (error.message?.startsWith('CORS origin denied')) {
      response.status(403).json({ error: 'Origin not allowed' })
      return
    }

    if (process.env.NODE_ENV !== 'test') {
      console.error(error)
    }

    response.status(500).json({ error: 'Internal server error' })
  })

  return app
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const port = Number(process.env.PORT || 8787)
  const app = createApp()

  app.listen(port, () => {
    console.log(`VET-3D API listening on http://localhost:${port}`)
  })
}
