# Deployment guide — danielasantos.work

Step-by-step guide for deploying changes to production on Namecheap cPanel.

## Hosting layout

| What | URL / path |
|------|------------|
| Frontend (React SPA) | `https://danielasantos.work` → `~/public_html/danielasantos/` |
| API (Node.js) | `https://api.danielasantos.work` → `~/api.danielasantos.work/` |
| MySQL database | `dmolnlpq_dspsi` (user: `dmolnlpq_dspsi`) |
| Deploy method | FTP (File Manager or FTP client) |

The API folder is **outside** `public_html`. The frontend and API are separate domains.

---

## Environment files

### Two `.env` files — different purposes

| File | Used when | Committed to git? |
|------|-----------|-------------------|
| `.env` (project root) | **Frontend build only** (`npm run build`) | **No** |
| `api/.env` | **API runtime** on server (and local API dev) | **No** |
| `.env.example` / `api/.env.example` | Templates for developers | Yes |

`.env` files are in `.gitignore`. Only `.env.example` files belong in git.

> **If `.env` was ever committed:** run `git rm --cached .env` once (keeps the local file, stops tracking it).

---

### Frontend `.env` (Mac only — for build)

Location: project root `.env`

```env
# Production build
VITE_API_URL=https://api.danielasantos.work
```

- Used **only at build time** — baked into the JS bundle.
- **Do not upload** this file to the server.
- After changing it, you must run `npm run build` and re-upload `dist/`.

Local development:

```env
VITE_API_URL=http://localhost:3001
```

---

### API `.env` (server + local dev)

Location on server: `~/api.danielasantos.work/.env`

```env
DATABASE_URL=mysql://dmolnlpq_dspsi:YOUR_DB_PASSWORD@localhost:3306/dmolnlpq_dspsi
JWT_SECRET=your-long-random-secret-here
FRONTEND_URL=https://danielasantos.work
NODE_ENV=production

# Only needed when running seed (optional)
ADMIN_EMAIL=admin@danielasantos.work
ADMIN_PASSWORD=your-secure-admin-password
```

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | cPanel MySQL credentials — **not** the local `ds_psi` dev database |
| `JWT_SECRET` | Yes | Long random string; same value must be in cPanel Node.js env vars |
| `FRONTEND_URL` | Yes | Used for CORS — must match the live site URL |
| `NODE_ENV` | Yes | `production` on server |
| `PORT` | No on server | Passenger sets this automatically; use `3001` only for local dev |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed only | Used by `npm run db:seed`; not needed for normal API runtime |

**Also mirror** `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and `NODE_ENV` in **cPanel → Setup Node.js App → Environment variables**. Passenger may prefer those over the `.env` file.

**Never overwrite** the server `.env` with your local Mac copy when deploying code.

---

## cPanel Node.js app settings

These should already be configured; verify after major changes:

| Setting | Value |
|---------|-------|
| Application root | `api.danielasantos.work` |
| Application URL | `api.danielasantos.work` |
| Application startup file | **`loader.cjs`** |
| Node version | 18 or 20 |

Do **not** use `dist/server.js` or cPanel’s default `app.js` as the startup file.

---

## Deploying frontend changes

When you change anything under `src/` (pages, components, styles, routes, etc.):

### On your Mac

```bash
cd /Users/danielferreira/dev/ds-psi

# Ensure production API URL is set
cat .env
# VITE_API_URL=https://api.danielasantos.work

npm run build
```

This creates/updates the `dist/` folder.

### Upload via FTP

Upload **contents** of `dist/` to `~/public_html/danielasantos/`:

| Upload | Overwrite? |
|--------|------------|
| `index.html` | Yes |
| `404.html` | Yes |
| `assets/*` | Yes (new hashed filenames each build) |
| `.htaccess` | Only if you changed `public/.htaccess` in the repo |

### Do not upload to the frontend

- `node_modules/`
- `src/`
- `.env`
- `api/`

### Verify

1. Hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R).
2. Open DevTools → Network → trigger a login or API call.
3. Requests should go to `https://api.danielasantos.work/...`, not `localhost`.

---

## Deploying API changes

Build on your Mac (cPanel production `npm install` skips devDependencies, so TypeScript build usually fails on the server).

### On your Mac

```bash
cd /Users/danielferreira/dev/ds-psi/api
npm run build
npm test   # optional but recommended
```

### What to upload to `~/api.danielasantos.work/`

#### Always upload (code changes)

| Path | When |
|------|------|
| `dist/` | **Every API deploy** — compiled JavaScript |
| `package.json` | When dependencies or scripts change |
| `package-lock.json` | When dependencies change |
| `loader.cjs` | If changed (rare) |
| `start.mjs` | If changed (rare) |
| `app.js` | If changed (legacy; Passenger uses `loader.cjs`) |
| `prisma/schema.prisma` | When database schema changes |
| `prisma/migrations/` | When there are new migrations |
| `prisma/seed.mjs` | When seed data logic changes |

#### Upload only when source changed (optional if you don’t debug on server)

| Path | Notes |
|------|-------|
| `src/` | Not required for runtime; `dist/` is enough |

#### Never overwrite on the server

| Path | Why |
|------|-----|
| `.env` | Contains production secrets and DB password |
| `node_modules/` | Rebuilt by cPanel **Run NPM Install** |
| `.htaccess` | Managed by Setup Node.js App (Passenger config) |
| `tmp/` | Passenger restart marker |

### After uploading

1. **cPanel → Setup Node.js App**
2. Click **Run NPM Install** (when `package.json` / lockfile changed)
3. Click **Restart**

### If database schema changed

In cPanel Terminal:

```bash
source ~/nodevenv/api.danielasantos.work/20/bin/activate
cd ~/api.danielasantos.work
npx prisma migrate deploy
```

Only run `npm run db:seed` on a **fresh** database or when you intentionally want to upsert seed data (admin user + form definitions).

### Verify API

```bash
curl https://api.danielasantos.work/api/health
# {"ok":true}
```

---

## Quick reference: what to replace per change type

### Frontend-only change

```
Mac:  npm run build
FTP:  dist/* → public_html/danielasantos/
```

### API logic change (no DB change)

```
Mac:  cd api && npm run build
FTP:  dist/ → api.danielasantos.work/dist/
      (package.json if deps changed)
cPanel: Run NPM Install (if package.json changed) → Restart
```

### API + database migration

```
Mac:  cd api && npm run build
FTP:  dist/ + prisma/schema.prisma + prisma/migrations/ → server
cPanel Terminal: npx prisma migrate deploy
cPanel: Restart Node.js app
```

### New npm dependency (API)

```
Mac:  npm install <pkg> --prefix api && npm run build:api
FTP:  package.json, package-lock.json, dist/
cPanel: Run NPM Install → Restart
```

---

## Local development (reminder)

```bash
# Terminal 1 — API
cp api/.env.example api/.env   # edit DATABASE_URL for local MySQL
cd api && npm install && npx prisma migrate deploy && npm run db:seed
npm run dev

# Terminal 2 — Frontend
cp .env.example .env           # VITE_API_URL=http://localhost:3001
npm install && npm run dev
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Login hits `localhost:3001` | Frontend built without production `VITE_API_URL` | Rebuild with correct `.env`, re-upload `dist/` |
| API 503 | Node app not running / wrong startup file | Startup = `loader.cjs`, Restart app |
| `require is not defined` in app.js | cPanel default `app.js` restored | Replace with repo `app.js` or use `loader.cjs` as startup |
| DB connection error | Wrong `DATABASE_URL` on server | Fix server `.env` + Node.js env vars |
| CORS error on login | `FRONTEND_URL` mismatch | Set to `https://danielasantos.work` |
| Prisma client error | `prisma generate` not run | Run NPM Install (postinstall runs generate) |

### Useful Terminal commands (cPanel)

```bash
source ~/nodevenv/api.danielasantos.work/20/bin/activate
cd ~/api.danielasantos.work

# Test app boots (Ctrl+C to stop)
node loader.cjs

# Migrations
npx prisma migrate deploy

# Seed (careful on production)
npm run db:seed
```

---

## Security checklist (production)

- [ ] `https://` on both `danielasantos.work` and `api.danielasantos.work`
- [ ] `.env` files not in git and not uploaded via FTP
- [ ] Strong `JWT_SECRET` and DB password
- [ ] Change default admin password after first seed
- [ ] `FRONTEND_URL` matches the real site origin

---

See also: [local-development.md](./local-development.md) — run database, API, and frontend on your Mac.
