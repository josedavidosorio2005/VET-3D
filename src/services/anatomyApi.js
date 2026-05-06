const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function fetchAnatomyPart(partId, signal) {
  const response = await fetch(`${apiBaseUrl}/api/anatomy/${encodeURIComponent(partId)}`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`API anatomy request failed with ${response.status}`)
  }

  return response.json()
}
