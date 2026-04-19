# Task Manager (Helfy)

Full-stack task manager: **Express** API with in-memory storage, **React** (Vite) UI, **Zod** validation, and **Sonner** toasts.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

## Project structure

```
real helfy/
├── backend/          # Express API (port 4000 by default)
│   ├── server.js
│   ├── routes/tasks.js
│   └── middleware/
├── frontend/         # React + Vite (port 3000)
│   └── src/
└── readme.md
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm start
```

- API base: `http://localhost:4000/api`
- Auto-reload on file changes: `npm run dev` (uses `node --watch`)

### 2. Frontend

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

- App URL: `http://localhost:3000`
- The frontend calls the API at `http://localhost:4000/api` (see `frontend/src/services/api.js`). Change `API_URL` there if your backend runs elsewhere.

## Features

- **Tasks**: list, create, update, toggle complete, delete
- **List API**: filter, search, and sort handled on the **server** via query parameters; response includes task counts for the filter UI
- **URL state**: `filter`, `search`, and `sort` are reflected in the browser address bar (shareable links); **search** is debounced before hitting the API
- **Themes**: light/dark (stored in localStorage)
- **Views**: carousel and list

## API reference

Base path: `/api/tasks`

### `GET /api/tasks`

Returns filtered/sorted tasks and global counts.

**Query parameters** (all optional; validated with Zod):

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `filter` | `all`, `pending`, `completed` | `all` | Status filter |
| `search` | string (max 200 chars, trimmed) | *(empty)* | Case-insensitive match on title and description |
| `sort` | `date`, `priority`, `title` | `date` | `date` = due date soonest (no due date last); `priority` = high → low; `title` = A → Z |

**Response** (`200`):

```json
{
  "tasks": [ /* array of task objects */ ],
  "counts": {
    "all": 5,
    "pending": 4,
    "completed": 1
  }
}
```

**Example**

```http
GET /api/tasks?filter=pending&search=report&sort=priority
```

Invalid query values return `400` with `{ "error": "Validation failed", "issues": [...] }`.

### `GET /api/tasks/:id`

Single task by numeric `id`. `404` if not found.

### `POST /api/tasks`

Create a task. JSON body validated by Zod.

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | Required, trimmed, max 200 |
| `description` | string | Optional, default `""` |
| `priority` | `"low"` \| `"medium"` \| `"high"` | Optional, default `"medium"` |
| `dueDate` | ISO datetime string, `""`, or `null` | Optional |

**Response**: `201` + created task (includes `id`, `createdAt`, `completed`).

### `PUT /api/tasks/:id`

Partial-style update: send only fields to change. At least one field required. `404` if task missing.

### `PATCH /api/tasks/:id/toggle`

Flips `completed` for the task. `404` if missing.

### `DELETE /api/tasks/:id`

Deletes the task. `404` if missing.

## Troubleshooting

### `400` on `GET /api/tasks?sort=date` (or similar)

The running Node process may be an **old** build still listening on port `4000`. Stop all backend instances, then start again:

```bash
# Windows: find PID on 4000, then end task, or from backend folder:
cd backend
npm start
```

On Windows you can check which process holds the port:

```powershell
netstat -ano | findstr :4000
```

### CORS / connection errors

Ensure the backend is running **before** the frontend loads tasks, and that `API_URL` in `frontend/src/services/api.js` matches your backend host and port.

## Scripts summary

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm start` | Run API once |
| `backend/` | `npm run dev` | Run API with `node --watch` |
| `frontend/` | `npm run dev` | Vite dev server (port 3000) |
| `frontend/` | `npm run build` | Production build |

## License

See repository / author preference for license.
