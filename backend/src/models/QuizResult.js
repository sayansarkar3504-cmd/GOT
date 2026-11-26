import mongoose from 'mongoose'

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: String, required: true, enum: ['who-am-i', 'house-quiz', 'maesters-challenge'] },
  score: { type: Number, required: true, min: 0, max: 100 },
  total: { type: Number, required: true, min: 1, max: 100 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false })

export default mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema)
