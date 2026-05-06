import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { createApp } from '../server/index.mjs'

async function startServer(allowedOrigins = ['http://localhost:5173']) {
  const server = createApp({ allowedOrigins }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  }
}

test('health endpoint exposes atlas totals', async (t) => {
  const api = await startServer()
  t.after(api.close)

  const response = await fetch(`${api.baseUrl}/api/health`)
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.ok, true)
  assert.equal(body.service, 'vet-3d-anatomy-api')
  assert.ok(body.parts >= 80)
  assert.equal(body.systems, 6)
})

test('part endpoint returns clinical data and system metadata', async (t) => {
  const api = await startServer()
  t.after(api.close)

  const response = await fetch(`${api.baseUrl}/api/anatomy/scapula`, {
    headers: { Origin: 'http://localhost:5173' },
  })
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173')
  assert.equal(body.id, 'scapula')
  assert.equal(body.latinName, 'Os Scapulae')
  assert.equal(body.system.id, 'skeletal')
  assert.match(body.clinical, /hombro/i)
})

test('unknown anatomy ids return 404', async (t) => {
  const api = await startServer()
  t.after(api.close)

  const response = await fetch(`${api.baseUrl}/api/anatomy/no-existe`)
  const body = await response.json()

  assert.equal(response.status, 404)
  assert.equal(body.error, 'Anatomy part not found')
})

test('cors rejects unexpected origins', async (t) => {
  const api = await startServer(['https://vet-3d.example'])
  t.after(api.close)

  const response = await fetch(`${api.baseUrl}/api/anatomy/scapula`, {
    headers: { Origin: 'https://malicious.example' },
  })
  const body = await response.json()

  assert.equal(response.status, 403)
  assert.equal(body.error, 'Origin not allowed')
})
