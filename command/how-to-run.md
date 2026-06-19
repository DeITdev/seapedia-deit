# How to Run SEAPEDIA

Step-by-step guide to start the database and the app. After you shut down your computer, both stop — you need to start them again before using the app.

---

## Quick start (this machine — Homebrew Postgres)

If you already completed **First-time setup** below, this is all you need after every reboot:

```bash
# 1. Start PostgreSQL (background service)
brew services start postgresql@14

# 2. From the project root, start the app
cd /Users/Danar/Project/seapedia-deit
npm run dev
```

Open **http://localhost:3000** in your browser.

To stop:

```bash
# Stop the app: Ctrl+C in the terminal where `npm run dev` is running

# Optional — stop PostgreSQL when you are done for the day
brew services stop postgresql@14
```

---

## First-time setup (one time per machine)

### 1. Install dependencies

```bash
cd /Users/Danar/Project/seapedia-deit
npm install
```

### 2. Environment file

Copy the example and keep the local values (or adjust for Docker / Supabase):

```bash
cp .env.example .env
```

For **local Homebrew Postgres**, `.env` should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seapedia?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/seapedia?schema=public"
AUTH_SECRET="dev-only-insecure-secret-change-me-please-1234567890"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Create database (Homebrew Postgres only, first time)

```bash
# Start Postgres
brew services start postgresql@14

# Create role + database (safe to re-run — skips if they already exist)
/opt/homebrew/opt/postgresql@14/bin/psql -h localhost -d postgres -c "CREATE ROLE postgres LOGIN PASSWORD 'postgres' SUPERUSER;" 2>/dev/null || true
/opt/homebrew/opt/postgresql@14/bin/psql -h localhost -d postgres -c "CREATE DATABASE seapedia OWNER postgres;" 2>/dev/null || true
```

### 4. Apply schema and seed demo data

```bash
npm run db:deploy   # apply migrations
npm run db:seed     # demo accounts + reviews
```

### 5. Run the app

```bash
npm run dev
```

---

## Demo accounts (after seeding)

| Username  | Password     | Roles                   |
| --------- | ------------ | ----------------------- |
| `admin`   | `Admin123!`  | Admin                   |
| `buyer1`  | `Buyer123!`  | Buyer                   |
| `seller1` | `Seller123!` | Seller                  |
| `driver1` | `Driver123!` | Driver                  |
| `multi`   | `Multi123!`  | Buyer + Seller + Driver |

`multi` must pick an **active role** after login; switch roles from the account menu.

---

## Option A — Homebrew PostgreSQL (recommended on this Mac)

PostgreSQL runs as a **background service** via Homebrew. It survives terminal closes but **not** a full shutdown until you start it again.

| Action              | Command                                      |
| ------------------- | -------------------------------------------- |
| Start DB (background)| `brew services start postgresql@14`          |
| Stop DB              | `brew services stop postgresql@14`           |
| Check DB is up       | `brew services list \| grep postgresql`      |
| Or quick ping        | `pg_isready -h localhost -p 5432`            |

Then start the app in a terminal (foreground):

```bash
npm run dev
```

**Run app in background (optional):**

```bash
npm run dev > .next/dev.log 2>&1 &
# Stop later: kill the process or `pkill -f "next dev"`
```

---

## Option B — Docker PostgreSQL

Use this if you prefer Docker over Homebrew. Requires **Docker Desktop running**.

### First time

```bash
# Start a Postgres container (runs in background, restarts on reboot if you add --restart unless-stopped)
docker run --name seapedia-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=seapedia \
  -p 5432:5432 \
  -d postgres:16

# Update .env (same URLs as local Homebrew)
# DATABASE_URL and DIRECT_URL → postgresql://postgres:postgres@localhost:5432/seapedia?schema=public

npm run db:deploy
npm run db:seed
```

### After every reboot

```bash
# 1. Open Docker Desktop (or start the Docker daemon)

# 2. Start the database container
docker start seapedia-db

# 3. Start the app
cd /Users/Danar/Project/seapedia-deit
npm run dev
```

| Action        | Command                    |
| ------------- | -------------------------- |
| Start DB      | `docker start seapedia-db` |
| Stop DB       | `docker stop seapedia-db`  |
| DB logs       | `docker logs seapedia-db`  |
| Remove DB     | `docker rm -f seapedia-db` (deletes data) |

---

## Option C — Supabase (cloud database)

Matches the locked project architecture for production-like setups. The app still runs locally with `npm run dev`; only the database is remote.

### First time

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → Database → Connection string**, copy:
   - **Transaction pooler** (port `6543`, `?pgbouncer=true`) → `DATABASE_URL`
   - **Session / direct** (port `5432`) → `DIRECT_URL`
3. Put them in `.env` along with `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL`.
4. Run:

```bash
npm run db:deploy
npm run db:seed
```

### After every reboot

No database to start locally — Supabase is always on. Only start the app:

```bash
cd /Users/Danar/Project/seapedia-deit
npm run dev
```

---

## Useful npm scripts

| Script              | When to use                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server (Turbopack)       |
| `npm run build`     | Production build check               |
| `npm run start`     | Run production build (`build` first) |
| `npm run db:deploy` | Apply migrations to the database     |
| `npm run db:seed`   | Re-seed demo accounts + reviews      |
| `npm run db:studio` | Open Prisma Studio (browse DB)       |
| `npm run db:reset`  | Drop DB, re-migrate, re-seed         |

---

## Troubleshooting

### Port 3000 already in use

Next.js 16 allows only one dev server per project. Either use the existing server or stop it:

```bash
lsof -iTCP:3000 -sTCP:LISTEN
kill <PID>
npm run dev
```

### `Can't reach database` / Prisma connection errors

1. Confirm Postgres is running (`pg_isready -h localhost -p 5432` or `docker ps`).
2. Confirm `.env` `DATABASE_URL` and `DIRECT_URL` match your setup.
3. Re-apply migrations: `npm run db:deploy`.

### `db.store is undefined` / seller page or `/api/products` returns 500 after a schema change

The dev server caches the Prisma client. After adding migrations or running `prisma generate`, restart the dev server:

```bash
# stop the running next dev process, then:
npx prisma generate
npm run db:deploy
npm run db:seed   # optional, refreshes demo store/products
npm run dev
```

### Reviews empty or login fails

Database may not be seeded:

```bash
npm run db:deploy
npm run db:seed
```

### Fresh database (wipe everything)

```bash
npm run db:reset
```

---

## Typical daily workflow (summary)

```bash
brew services start postgresql@14   # skip if using Supabase
cd /Users/Danar/Project/seapedia-deit
npm run dev
# → http://localhost:3000
```
