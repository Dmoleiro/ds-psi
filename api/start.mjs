import 'dotenv/config'
import { buildApp } from './dist/server.js'

function isPassenger() {
  return (
    typeof globalThis.PhusionPassenger !== 'undefined' ||
    typeof process.env.PASSENGER_APP_ENV === 'string'
  )
}

const app = await buildApp()

try {
  if (isPassenger()) {
    await app.listen({ path: 'passenger', host: '127.0.0.1' })
    console.log('API listening (Passenger)')
  } else {
    const port = Number(process.env.PORT ?? 3001)
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`API listening on port ${port}`)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
