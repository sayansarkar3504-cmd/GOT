import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createApp } from '../src/app.js'

let server
let baseUrl

before(async () => {
  server = createApp().listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
})

test('health endpoint reports an unavailable database without leaking configuration', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { status: 'database-unavailable' })
})

test('protected profile endpoint rejects unauthenticated requests', async () => {
  const response = await fetch(`${baseUrl}/api/profile`)
  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: 'Authentication required.' })
})

test('registration validates input before attempting database writes', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', displayName: 'A', password: 'short' }),
  })
  assert.equal(response.status, 400)
  const body = await response.json()
  assert.equal(body.error, 'Invalid request.')
  assert.ok(Array.isArray(body.details))
})
