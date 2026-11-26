import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gameId: { type: String, required: true, enum: ['iron-throne', 'dragon-rider', 'who-am-i', 'house-quiz', 'battle-of-westeros', 'maesters-challenge', 'sigil-match'] },
  displayName: { type: String, required: true, maxlength: 32 },
  score: { type: Number, required: true, min: 0, max: 1000000 },
}, { timestamps: true, versionKey: false })

scoreSchema.index({ gameId: 1, score: -1, createdAt: 1 })

export default mongoose.models.Score || mongoose.model('Score', scoreSchema)
