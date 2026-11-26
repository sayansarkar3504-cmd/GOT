import { useState } from 'react'
import { api } from '../services/api'
import { HOUSES } from '../data/houses'

const CHARACTERS = [
  ['jon-snow', 'Jon Snow'],
  ['daenerys-targaryen', 'Daenerys Targaryen'],
  ['tyrion-lannister', 'Tyrion Lannister'],
  ['arya-stark', 'Arya Stark'],
  ['cersei-lannister', 'Cersei Lannister'],
  ['jaime-lannister', 'Jaime Lannister'],
  ['sansa-stark', 'Sansa Stark'],
  ['ned-stark', 'Ned Stark'],
]

const GAMES = [
  ['iron-throne', 'The Iron Throne'],
  ['dragon-rider', 'Dragon Rider'],
  ['who-am-i', 'Who Am I?'],
  ['house-quiz', 'House Quiz'],
  ['battle-of-westeros', 'Battle of Westeros'],
  ['maesters-challenge', 'The Maester’s Challenge'],
  ['sigil-match', 'Sigil Match'],
]

function AccountPanel({ onUserChange }) {
  const [expanded, setExpanded] = useState(false)
  const [mode, setMode] = useState('login')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState({ houses: [], characters: [] })
  const [quizResults, setQuizResults] = useState([])
  const [scores, setScores] = useState([])
  const [achievements, setAchievements] = useState([])
  const [leaderboardGame, setLeaderboardGame] = useState(GAMES[0][0])
  const [leaderboard, setLeaderboard] = useState([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const loadPrivateData = async () => {
    const [savedFavorites, savedQuizzes, savedScores, savedAchievements] = await Promise.all([
      api.favorites(),
      api.quizResults(),
      api.scores(),
      api.achievements(),
    ])
    setFavorites(savedFavorites)
    setQuizResults(savedQuizzes.results)
    setScores(savedScores.scores)
    setAchievements(savedAchievements.achievements)
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      const details = mode === 'register' ? { email, displayName, password } : { email, password }
      const result = mode === 'register' ? await api.register(details) : await api.login(details)
      setUser(result.user)
      onUserChange(result.user)
      setPassword('')
      await loadPrivateData()
      setStatus(`Welcome, ${result.user.displayName}.`)
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  const resumeSession = async () => {
    setBusy(true)
    setStatus('')
    try {
      const result = await api.profile()
      setUser(result.user)
      onUserChange(result.user)
      await loadPrivateData()
      setStatus(`Welcome back, ${result.user.displayName}.`)
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    setStatus('')
    try {
      await api.logout()
      setUser(null)
      onUserChange(null)
      setFavorites({ houses: [], characters: [] })
      setQuizResults([])
      setScores([])
      setAchievements([])
      setStatus('You have signed out.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  const toggleFavorite = async (collection, id) => {
    const selected = favorites[collection].includes(id)
    setBusy(true)
    setStatus('')
    try {
      await api.setFavorite(collection, id, !selected)
      setFavorites((current) => ({
        ...current,
        [collection]: selected ? current[collection].filter((item) => item !== id) : [...current[collection], id],
      }))
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  const loadLeaderboard = async () => {
    setBusy(true)
    setStatus('')
    try {
      const result = await api.leaderboard(leaderboardGame)
      setLeaderboard(result.scores)
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="account-panel">
      <button className="account-panel__toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
        <span><span className="eyebrow">Keep your own chronicles</span><strong>{user ? `Welcome, ${user.displayName}` : 'Account, favorites & scores'}</strong></span>
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="account-panel__body">
          {!user ? (
            <div className="account-auth">
              <div className="account-auth__tabs" role="group" aria-label="Account action">
                <button type="button" aria-pressed={mode === 'login'} onClick={() => setMode('login')}>Sign in</button>
                <button type="button" aria-pressed={mode === 'register'} onClick={() => setMode('register')}>Create account</button>
              </div>
              <form className="account-form" onSubmit={submitAuth}>
                {mode === 'register' && <label>Display name<input autoComplete="nickname" maxLength="32" minLength="2" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>}
                <label>Email<input autoComplete="email" type="email" maxLength="254" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                <label>Password<input autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type="password" minLength="12" maxLength="128" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
                <button className="button button--gold" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}</button>
              </form>
              {mode === 'login' && <button className="game-back" type="button" onClick={resumeSession} disabled={busy}>Resume saved session</button>}
              <p className="account-panel__hint">Passwords must be at least 12 characters. Accounts require the configured API and MongoDB service.</p>
            </div>
          ) : (
            <div className="account-private">
              <div className="account-private__heading"><p className="eyebrow">{user.email}</p><button className="game-back" type="button" onClick={logout} disabled={busy}>Sign out</button></div>
              <div className="account-favorites">
                <div><h3>Favorite houses</h3><div className="account-chips">{HOUSES.map((house) => <button key={house.id} type="button" aria-pressed={favorites.houses.includes(house.id)} disabled={busy} onClick={() => toggleFavorite('houses', house.id)}>{house.name}</button>)}</div></div>
                <div><h3>Favorite characters</h3><div className="account-chips">{CHARACTERS.map(([id, name]) => <button key={id} type="button" aria-pressed={favorites.characters.includes(id)} disabled={busy} onClick={() => toggleFavorite('characters', id)}>{name}</button>)}</div></div>
              </div>
              <div className="account-leaderboard">
                <label>Leaderboard<select value={leaderboardGame} onChange={(event) => setLeaderboardGame(event.target.value)}>{GAMES.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>
                <button className="button button--outline" type="button" disabled={busy} onClick={loadLeaderboard}>Load scores</button>
                {leaderboard.length > 0 && <ol>{leaderboard.map((entry, index) => <li key={`${entry.displayName}-${entry.createdAt}-${index}`}><span>{entry.displayName}</span><strong>{entry.score}</strong></li>)}</ol>}
                {leaderboard.length === 0 && <p className="account-panel__hint">No submitted scores yet. Scores are user-submitted and are not anti-cheat verified.</p>}
              </div>
              <div className="account-quiz-results"><h3>Recent quiz results</h3>{quizResults.length ? quizResults.map((item) => <p key={`${item.quizId}-${item.completedAt}`}>{item.quizId}: {item.score}/{item.total}</p>) : <p>No saved quiz results yet.</p>}</div>
              <div className="account-quiz-results"><h3>Game history</h3>{scores.length ? scores.map((item) => <p key={`${item.gameId}-${item.createdAt}`}>{item.gameId}: {item.score}</p>) : <p>No scores have been submitted yet.</p>}</div>
              <div className="account-quiz-results"><h3>Achievements</h3>{achievements.length ? achievements.map((item) => <p key={item.id}>{item.id.replaceAll('-', ' ')}</p>) : <p>Complete a quiz or submit a score to earn your first badge.</p>}</div>
            </div>
          )}
          {status && <p className="account-status" role="status">{status}</p>}
        </div>
      )}
    </aside>
  )
}

export default AccountPanel
