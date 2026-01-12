# Job Tracker — React + TypeScript + Vite

Small React + TypeScript app (Vite). Uses a local json-server (`db.json`) as a lightweight dev API for users and jobs.

## Quick start

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the backend (json-server):

   ```powershell
   npm run server
   ```

3. In a second terminal start the frontend (Vite):

   ```powershell
   npm run dev
   ```

   Or run both together:

   ```powershell
   npm run dev:full
   ```

Open the URL shown by Vite (usually `http://localhost:5173`).

## What the scripts do

- `npm run server` — starts json-server and serves `db.json` (default port: 3001)
- `npm run dev` — starts Vite (frontend)
- `npm run dev:full` — runs both concurrently
- `npm run build` — build frontend for production

## Verify the API

After `npm run server`, verify the users endpoint:

```powershell
Invoke-RestMethod http://localhost:3001/users
# or
curl http://localhost:3001/users
```

You should see the `users` array from `db.json`.

## Common problem & quick fix

If registration/login fails and console shows `Failed to fetch` or `ERR_CONNECTION_REFUSED` to `http://localhost:3000`:

- Reason: the frontend was trying to call port **3000** while json-server runs on **3001** (or the server isn't running).
- Fix: start the server (`npm run server`) and ensure the frontend's API base URL matches the server port.

API config lives at: `src/Services/ApiServices.ts` (default: `http://localhost:3001`).

## Make API URL configurable (optional)

You can add a `.env` / `.env.local` with:

```
VITE_API_BASE_URL=http://localhost:3001
```

and update `ApiServices.ts` to use `import.meta.env.VITE_API_BASE_URL` for flexibility.

## Notes

- `db.json` contains sample users and jobs for development.
- `json-server` is for local development only — replace it with a real API in production.

If you want, I can make the API URL use Vite env variables and add a `.env.example` file.
