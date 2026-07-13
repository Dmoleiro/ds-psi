import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { config } from './lib/schemas.js'
import { authRoutes } from './routes/auth.js'
import { adminRoutes } from './routes/admin.js'
import { therapistRoutes } from './routes/therapist.js'
import { patientRoutes } from './routes/patient.js'

export async function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    trustProxy: true,
  })

  await app.register(cors, {
    origin: config.frontendUrl,
    credentials: true,
  })

  await app.register(jwt, {
    secret: config.jwtSecret,
  })

  app.get('/api/health', async () => ({ ok: true }))

  await app.register(authRoutes)
  await app.register(adminRoutes)
  await app.register(therapistRoutes)

  await app.register(
    async (patientApp) => {
      await patientApp.register(rateLimit, {
        max: 60,
        timeWindow: '1 minute',
        keyGenerator: (request) => {
          const token =
            (request.params as { token?: string }).token ??
            String(request.headers['x-patient-token'] ?? request.ip)
          return `patient:${token}`
        },
      })
      await patientApp.register(patientRoutes)
    },
  )

  return app
}

async function start() {
  const app = await buildApp()
  const isPassenger =
    typeof (globalThis as { PhusionPassenger?: unknown }).PhusionPassenger !== 'undefined' ||
    typeof process.env.PASSENGER_APP_ENV === 'string'
  try {
    if (isPassenger) {
      await app.listen({ path: 'passenger', host: '127.0.0.1' })
      console.log('API listening (Passenger)')
    } else {
      await app.listen({ port: config.port, host: '0.0.0.0' })
      console.log(`API listening on port ${config.port}`)
    }
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

const entry = process.argv[1] ?? ''
const isMain = entry.includes('server') || entry.endsWith('app.js')
if (isMain && process.env.NODE_ENV !== 'test') {
  start()
}
