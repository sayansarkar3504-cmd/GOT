import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { z } from 'zod'
import QuizResult from './models/QuizResult.js'
import Score from './models/Score.js'
import User from './models/User.js'
import { requireUser } from './middleware/auth.js'

const GAME_IDS = ['iron-throne', 'dragon-rider', 'who-am-i', 'house-quiz', 'battle-of-westeros', 'maesters-challenge', 'sigil-match']
const QUIZ_IDS = ['who-am-i', 'house-quiz', 'maesters-challenge']
const HOUSE_IDS = ['stark', 'lannister', 'targaryen', 'baratheon', 'greyjoy', 'tyrell', 'martell']
const CHARACTER_IDS = ['jon-snow', 'daenerys-targaryen', 'tyrion-lannister', 'arya-stark', 'cersei-lannister', 'jaime-lannister', 'sansa-stark', 'ned-stark']
const authSchema = z.object({
  email: z.string().email().max(254),
  displayName: z.string().trim().min(2).max(32).optional(),
  password: z.string().min(12).max(128),
}).strict()
const scoreSchema = z.object({
  gameId: z.enum(GAME_IDS),
  score: z.number().int().min(0).max(1000000),
}).strict()
const quizSchema = z.object({
  quizId: z.enum(QUIZ_IDS),
  score: z.number().int().min(0).max(100),
  total: z.number().int().min(1).max(100),
}).strict().refine((value) => value.score <= value.total, { message: 'Score cannot exceed total.' })
const progressSchema = z.object({ progress: z.record(z.string(), z.unknown()) }).strict()

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    favoriteCharacters: user.favoriteCharacters,
    favoriteHouses: user.favoriteHouses,
    achievements: user.achievements,
  }
}

function setSessionCookie(res, userId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured.')
  const token = jwt.sign({}, secret, { subject: String(userId), expiresIn: '1h' })
  res.cookie('westeros_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
    path: '/',
  })
}

function validate(schema, body, res) {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request.', details: parsed.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })) })
    return null
  }
  return parsed.data
}

async function awardAchievement(userId, id) {
  await User.updateOne(
    { _id: userId, 'achievements.id': { $ne: id } },
    { $push: { achievements: { id } } },
  )
}

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }))
  app.use(express.json({ limit: '16kb' }))
  app.use(cookieParser())
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }))

  app.get('/api/health', (_req, res) => {
    const connected = mongoose.connection.readyState === 1
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'database-unavailable' })
  })

  app.post('/api/auth/register', async (req, res) => {
    const input = validate(authSchema, req.body, res)
    if (!input) return
    if (!input.displayName) return res.status(400).json({ error: 'Display name is required for registration.' })
    try {
      const user = await User.create({ email: input.email, displayName: input.displayName, passwordHash: input.password })
      setSessionCookie(res, user.id)
      return res.status(201).json({ user: publicUser(user) })
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ error: 'An account with that email already exists.' })
      throw error
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    const input = validate(authSchema.omit({ displayName: true }), req.body, res)
    if (!input) return
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash')
    if (!user || !(await user.verifyPassword(input.password))) return res.status(401).json({ error: 'Email or password is incorrect.' })
    setSessionCookie(res, user.id)
    return res.json({ user: publicUser(user) })
  })

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie('westeros_session', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' })
    return res.status(204).end()
  })

  app.use('/api/profile', requireUser)
  app.get('/api/profile', (req, res) => res.json({ user: publicUser(req.user) }))
  app.patch('/api/profile', async (req, res) => {
    const parsed = z.object({ displayName: z.string().trim().min(2).max(32) }).strict().safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid profile update.' })
    req.user.displayName = parsed.data.displayName
    await req.user.save()
    return res.json({ user: publicUser(req.user) })
  })

  app.use('/api/favorites', requireUser)
  app.get('/api/favorites', (req, res) => res.json({ characters: req.user.favoriteCharacters, houses: req.user.favoriteHouses }))
  app.put('/api/favorites/:collection/:itemId', async (req, res) => {
    const { collection, itemId } = req.params
    const valid = collection === 'characters'
      ? CHARACTER_IDS.includes(itemId)
      : collection === 'houses' && HOUSE_IDS.includes(itemId)
    if (!valid) return res.status(400).json({ error: 'Unknown favorite.' })
    const field = collection === 'characters' ? 'favoriteCharacters' : 'favoriteHouses'
    await User.updateOne({ _id: req.user.id }, { $addToSet: { [field]: itemId } })
    return res.status(204).end()
  })
  app.delete('/api/favorites/:collection/:itemId', async (req, res) => {
    const { collection, itemId } = req.params
    const valid = collection === 'characters'
      ? CHARACTER_IDS.includes(itemId)
      : collection === 'houses' && HOUSE_IDS.includes(itemId)
    if (!valid) return res.status(400).json({ error: 'Unknown favorite.' })
    const field = collection === 'characters' ? 'favoriteCharacters' : 'favoriteHouses'
    await User.updateOne({ _id: req.user.id }, { $pull: { [field]: itemId } })
    return res.status(204).end()
  })

  const writeRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false })
  app.post('/api/scores', writeRateLimit, requireUser, async (req, res) => {
    const input = validate(scoreSchema, req.body, res)
    if (!input) return
    const score = await Score.create({ ...input, user: req.user.id, displayName: req.user.displayName })
    await awardAchievement(req.user.id, 'first-score')
    return res.status(201).json({ score: { gameId: score.gameId, score: score.score, createdAt: score.createdAt } })
  })
  app.get('/api/scores', requireUser, async (req, res) => {
    const scores = await Score.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50).select('gameId score createdAt -_id').lean()
    return res.json({ scores })
  })
  app.get('/api/leaderboards/:gameId', async (req, res) => {
    if (!GAME_IDS.includes(req.params.gameId)) return res.status(404).json({ error: 'Leaderboard not found.' })
    const scores = await Score.find({ gameId: req.params.gameId })
      .sort({ score: -1, createdAt: 1 })
      .limit(20)
      .select('displayName score createdAt -_id')
      .lean()
    return res.json({ gameId: req.params.gameId, scores })
  })

  app.use('/api/quiz-results', requireUser)
  app.post('/api/quiz-results', writeRateLimit, async (req, res) => {
    const input = validate(quizSchema, req.body, res)
    if (!input) return
    const quizResult = await QuizResult.create({ ...input, user: req.user.id })
    await awardAchievement(req.user.id, 'first-quiz')
    if (input.quizId === 'maesters-challenge' && input.score === input.total) {
      await awardAchievement(req.user.id, 'perfect-maester')
    }
    return res.status(201).json({ result: { id: quizResult.id, quizId: quizResult.quizId, score: quizResult.score, total: quizResult.total } })
  })
  app.get('/api/quiz-results', async (req, res) => {
    const results = await QuizResult.find({ user: req.user.id }).sort({ completedAt: -1 }).limit(50).select('quizId score total completedAt -_id').lean()
    return res.json({ results })
  })

  app.use('/api/achievements', requireUser)
  app.get('/api/achievements', (req, res) => res.json({ achievements: req.user.achievements }))

  app.use('/api/game-progress', requireUser)
  app.get('/api/game-progress/:gameId', (req, res) => {
    if (!GAME_IDS.includes(req.params.gameId)) return res.status(404).json({ error: 'Game not found.' })
    return res.json({ gameId: req.params.gameId, progress: req.user.gameProgress.get(req.params.gameId) || null })
  })
  app.put('/api/game-progress/:gameId', async (req, res) => {
    if (!GAME_IDS.includes(req.params.gameId)) return res.status(404).json({ error: 'Game not found.' })
    const input = validate(progressSchema, req.body, res)
    if (!input) return
    if (JSON.stringify(input.progress).length > 8000) return res.status(413).json({ error: 'Progress payload is too large.' })
    req.user.gameProgress.set(req.params.gameId, input.progress)
    await req.user.save()
    return res.status(204).end()
  })

  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error)
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large.' })
    if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Malformed JSON request.' })
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Request could not be saved.' })
    if (error.name === 'MongoServerError' && error.code === 11000) return res.status(409).json({ error: 'A record with that value already exists.' })
    console.error('Unhandled API error:', error.message)
    return res.status(500).json({ error: 'An unexpected server error occurred.' })
  })

  return app
}
