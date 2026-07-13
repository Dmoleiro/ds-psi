# Local development guide

How to run the full stack on your Mac: MySQL database, API, and frontend.

## What runs where

| Service | URL | Command |
|---------|-----|---------|
| Frontend (Vite) | http://localhost:5173 | `npm run dev` (project root) |
| API (Fastify) | http://localhost:3001 | `npm run dev` (in `api/`) |
| MySQL | `localhost:3306` | `docker compose up -d` |

Health check: http://localhost:3001/api/health → `{"ok":true}`

---

## Prerequisites

- **Node.js** 18 or 20 (`node -v`)
- **Docker Desktop** (recommended — easiest way to run MySQL)
  - Or a local MySQL 8 install if you prefer not to use Docker

---

## First-time setup

Run these once after cloning the repo.

### 1. Install dependencies

```bash
cd /path/to/ds-psi

npm install
npm install --prefix api
```

### 2. Start the database

```bash
docker compose up -d
```

This starts MySQL 8 with:

| Setting | Value |
|---------|-------|
| Database | `ds_psi` |
| User | `ds_psi` |
| Password | `ds_psi` |
| Root password | `root` |
| Port | `3306` |

Wait a few seconds for MySQL to be ready. Check it’s running:

```bash
docker compose ps
```

### 3. Configure the API

```bash
cp api/.env.example api/.env
```

The example already matches Docker defaults. Your `api/.env` should include:

```env
DATABASE_URL="mysql://ds_psi:ds_psi@localhost:3306/ds_psi"
JWT_SECRET="dev-only-change-in-production"
FRONTEND_URL="http://localhost:5173"
PORT=3001

ADMIN_EMAIL="admin@danielasantos.work"
ADMIN_PASSWORD="ChangeMeAdmin123!"
```

### 4. Create tables and seed data

```bash
cd api
npx prisma migrate deploy
npm run db:seed
cd ..
```

Seed creates:

- Form definitions (intake, consent, history)
- Admin user: `admin@danielasantos.work` / `ChangeMeAdmin123!`

### 5. Configure the frontend

```bash
cp .env.example .env
```

Your root `.env` should be:

```env
VITE_API_URL=http://localhost:3001
```

---

## Daily workflow

Open **three terminals** (or use split panes).

### Terminal 1 — Database (if not already running)

```bash
cd /path/to/ds-psi
docker compose up -d
```

You only need this once per reboot (or if you stopped Docker).

### Terminal 2 — API

```bash
cd /path/to/ds-psi/api
npm run dev
```

You should see: `API listening on port 3001`

### Terminal 3 — Frontend

```bash
cd /path/to/ds-psi
npm run dev
```

You should see: `Local: http://localhost:5173/`

---

## What to open in the browser

| Page | URL |
|------|-----|
| Marketing site | http://localhost:5173/ |
| Backoffice login | http://localhost:5173/backoffice/login |
| Formulários PICCA info | http://localhost:5173/formularios-picca |

**Login (after seed):**

- Email: `admin@danielasantos.work`
- Password: `ChangeMeAdmin123!`

---

## Useful commands

### Tests

```bash
# Frontend
npm test

# API
npm run test:api
```

### API build (same as production compile step)

```bash
npm run build:api
```

### Prisma Studio (browse database in browser)

```bash
cd api
npx prisma studio
```

Opens http://localhost:5555

### View database logs

```bash
docker compose logs -f mysql
```

---

## Stopping services

```bash
# Stop API / frontend: Ctrl+C in each terminal

# Stop MySQL (keeps data)
docker compose stop

# Stop and remove containers (data volume is kept)
docker compose down

# Stop and DELETE all database data (fresh start)
docker compose down -v
```

After `docker compose down -v`, run migrations and seed again:

```bash
docker compose up -d
cd api && npx prisma migrate deploy && npm run db:seed
```

---

## Without Docker (local MySQL)

If you use Homebrew MySQL or another install:

1. Create database and user:

```sql
CREATE DATABASE ds_psi;
CREATE USER 'ds_psi'@'localhost' IDENTIFIED BY 'ds_psi';
GRANT ALL PRIVILEGES ON ds_psi.* TO 'ds_psi'@'localhost';
FLUSH PRIVILEGES;
```

2. Set `DATABASE_URL` in `api/.env` to match your credentials.

3. Run migrations and seed as above.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Can't connect to MySQL` | `docker compose up -d` and wait ~10s |
| Port 3306 already in use | Stop other MySQL, or change port in `docker-compose.yml` and `DATABASE_URL` |
| API 500 on login | Check `api/.env` exists and `DATABASE_URL` is correct |
| Frontend calls wrong API | Root `.env` must have `VITE_API_URL=http://localhost:3001`; restart `npm run dev` |
| `prisma generate` error | `cd api && npm install && npx prisma generate` |
| Seed `EACCES` on tsx | Use `npm run db:seed` (runs `prisma/seed.mjs` via node) |
| CORS error | `FRONTEND_URL` in `api/.env` must be `http://localhost:5173` |

### Reset database completely

```bash
docker compose down -v
docker compose up -d
sleep 10
cd api
npx prisma migrate deploy
npm run db:seed
```

---

## Environment files (local only)

| File | Purpose |
|------|---------|
| `.env` | Frontend — `VITE_API_URL` for local API |
| `api/.env` | API — database, JWT, CORS, seed credentials |

Both are gitignored. Never commit them. See `.env.example` and `api/.env.example` for templates.

For production deployment, see [deployment.md](./deployment.md).
