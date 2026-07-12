# TransitOps — MERN Edition

A rebuild of the TransitOps fleet-management app using only:
**HTML, CSS, JavaScript, React (.jsx), MongoDB + Express + Node (MERN), React Router, Git & GitHub.**

No Supabase, no TanStack, no Tailwind, no UI/component libraries, no charting libraries —
everything (auth, styling, routing, the bar chart) is hand-built with plain CSS/JS/React.

## Features
- Email/password auth with JWT (roles: Fleet Manager, Driver, Safety Officer, Financial Analyst)
- Role-based navigation & route access (mirrors the original app's permission model)
- Vehicle registry (CRUD + retire)
- Driver management (CRUD, license expiry warnings, safety score)
- Trip dispatcher (Draft → Dispatched → Completed/Cancelled, with capacity & availability rules)
- Maintenance log (opening/closing a record auto-updates vehicle status)
- Fuel logs & expenses, with per-vehicle operational cost roll-up
- Reports & analytics (fleet utilization, ROI, fuel efficiency, CSV export, CSS bar chart)

## Project structure
```
transitops-mern/
  server/   → Express + Mongoose API
  client/   → React + React Router frontend (Vite)
```

## 1. Backend setup
```bash
cd server
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run dev                # starts on http://localhost:5000
```
Requires a MongoDB instance — either local (`mongodb://127.0.0.1:27017/transitops`) or a free
MongoDB Atlas cluster (paste its connection string into `MONGO_URI`).

Optional demo data:
```bash
npm run seed   # creates manager@transitops.com / password123 plus 2 vehicles & 2 drivers
```

## 2. Frontend setup
```bash
cd client
npm install
npm run dev                # starts on http://localhost:5173
```

Open http://localhost:5173, sign up (pick a role), and start using the app.

## 3. Push your own changes with Git & GitHub
```bash
git init
git add .
git commit -m "Initial commit: TransitOps MERN rebuild"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

To work on a feature in its own branch and merge it later:
```bash
git checkout -b feature/my-change
# ...edit files...
git add .
git commit -m "Describe the change"
git push -u origin feature/my-change
# open a Pull Request on GitHub, review, then merge into main
```

## Notes on how business rules were ported
The original app used Postgres triggers (via Supabase) to enforce rules like "cargo can't
exceed vehicle capacity" or "dispatching a trip sets the vehicle/driver to On Trip." Those
same rules are re-implemented as plain JavaScript checks inside the Express route handlers
in `server/routes/tripRoutes.js` and `server/routes/maintenanceRoutes.js`, so the behavior is
identical even though there's no database-level trigger.
