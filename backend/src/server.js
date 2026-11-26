import 'dotenv/config'
import mongoose from 'mongoose'
import { createApp } from './app.js'

const { MONGODB_URI, JWT_SECRET } = process.env
if (!MONGODB_URI) throw new Error('MONGODB_URI must be set before starting the API.')
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to at least 32 characters.')

const port = Number(process.env.PORT || 4000)
await mongoose.connect(MONGODB_URI)
const server = createApp().listen(port, () => {
  console.log(`Westeros API listening on port ${port}`)
})

async function shutdown() {
  server.close()
  await mongoose.disconnect()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
