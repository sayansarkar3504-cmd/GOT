const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 204) return null
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`)
  return data
}

export const api = {
  register: (details) => request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  login: (details) => request('/auth/login', { method: 'POST', body: JSON.stringify(details) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  profile: () => request('/profile'),
  favorites: () => request('/favorites'),
  setFavorite: (collection, id, selected) => request(`/favorites/${collection}/${encodeURIComponent(id)}`, { method: selected ? 'PUT' : 'DELETE' }),
  submitScore: (score) => request('/scores', { method: 'POST', body: JSON.stringify(score) }),
  scores: () => request('/scores'),
  submitQuizResult: (result) => request('/quiz-results', { method: 'POST', body: JSON.stringify(result) }),
  quizResults: () => request('/quiz-results'),
  achievements: () => request('/achievements'),
  leaderboard: (gameId) => request(`/leaderboards/${encodeURIComponent(gameId)}`),
}
