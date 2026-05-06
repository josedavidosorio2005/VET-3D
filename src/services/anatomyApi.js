/**
 * Anatomy API service.
 *
 * In development: proxies to http://localhost:8787 (Cloudflare Worker).
 * In production (no backend): always throws so App.jsx falls back to
 * the local anatomyData.js records — fully offline capable.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function fetchAnatomyPart(partId, signal) {
  // If no API base URL is configured, skip the request entirely.
  // The caller (App.jsx) catches the error and uses local data.
  if (!API_BASE) {
    throw new Error('No API configured — using local data')
  }

  const response = await fetch(
    `${API_BASE}/api/anatomy/${encodeURIComponent(partId)}`,
    { headers: { Accept: 'application/json' }, signal },
  )

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}
