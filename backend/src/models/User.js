import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
}, { _id: false })

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 32 },
  passwordHash: { type: String, required: true, select: false },
  favoriteCharacters: { type: [String], default: [] },
  favoriteHouses: { type: [String], default: [] },
  achievements: { type: [achievementSchema], default: [] },
  gameProgress: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('passwordHash')) this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
})

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.models.User || mongoose.model('User', userSchema)
