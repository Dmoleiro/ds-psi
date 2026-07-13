# Formulários PICCA — Architecture

## Overview

- **Marketing site**: React SPA in `src/` (GitHub Pages or Namecheap `public_html`)
- **API**: Node.js + Fastify + Prisma in `api/` (Namecheap cPanel Node.js app)
- **Database**: MySQL on cPanel

## Roles

| Role | Access |
|------|--------|
| Admin | `/backoffice/admin/therapists` — create/manage therapists |
| Therapist | `/backoffice` — patients, generate magic links, view submissions |
| Patient | `/formularios/p/:token` — assigned forms, autosave, no account |

## Patient link lifecycle

1. Therapist creates patient → selects forms → API returns one-time URL
2. Patient opens link → accepts GDPR consent → fills forms
3. Drafts autosave every ~3s via `PUT /api/patient/session/:token/forms/:formId/draft`
4. When **all** assigned forms are submitted, session status = `completed` and link returns 410

## Local development

```bash
# Requires MySQL running locally (Docker optional — see docker-compose.yml)
cp api/.env.example api/.env
# DATABASE_URL=mysql://user:password@localhost:3306/ds_psi

cd api && npm install && npx prisma migrate deploy && npm run db:seed
```

Default admin after seed: `admin@danielasantos.work` / `ChangeMeAdmin123!`

## Production (Namecheap cPanel)

1. Create MySQL database and user
2. **Setup Node.js App** → application root `api.danielasantos.work/`, startup **`loader.cjs`**
3. Environment: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (PORT is set by Passenger)
4. Upload `dist/` + `app.js` from Mac (`npm run build`), then cPanel: **Run NPM Install** → `npx prisma migrate deploy` → `npm run db:seed`
5. Build frontend with `VITE_API_URL=https://api.danielasantos.work` → upload `dist/` to `public_html`
6. `.htaccess` SPA fallback for `/backoffice/*` and `/formularios/p/*`

## API routes

See plan document for full list. Health check: `GET /api/health`
