import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireUser(req, res, next) {
  const token = req.cookies?.westeros_session
  if (!token) return res.status(401).json({ error: 'Authentication required.' })

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured.')
    const payload = jwt.verify(token, secret)
    if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
      return res.status(401).json({ error: 'Session is invalid or expired.' })
    }
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ error: 'Session is invalid or expired.' })
    req.user = user
    return next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session is invalid or expired.' })
    }
    return next(error)
  }
}
