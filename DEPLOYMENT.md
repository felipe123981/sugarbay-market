# Deployment with Cloudflared Tunnel

This guide explains how to deploy SugarBay Market using Cloudflared tunnel for public access.

## Problem: Avatars and Customer Updates Not Working

When running the application behind a cloudflared tunnel, you may encounter:
- **Avatar images not loading** - The backend generates URLs with `localhost:3333`
- **Customer update failures** - The frontend API calls go to localhost instead of the tunnel URL

## Solution: Configure Environment Variables

## Quick Start (Frontend on Port 80)

The frontend is configured to run on **port 80** by default. Running on port 80 requires admin/sudo privileges on most systems.

### Step 1: Start the Backend

1. Start the backend server:
   ```bash
   cd backend
   yarn dev
   ```
   The backend runs on `http://localhost:3333`

### Step 2: Start the Frontend (requires sudo)

1. Start the frontend dev server:
   ```bash
   cd frontend
   sudo yarn dev
   ```
   The frontend runs on `http://localhost:80`

### Step 3: Expose with Cloudflared

1. Start cloudflared tunnel pointing to the frontend:
   ```bash
   cloudflared tunnel --url http://localhost:80
   ```

2. Copy the tunnel URL (e.g., `https://abc123.trycloudflare.com`)

3. Update the backend `.env` file:
   ```env
   APP_SECRET=your-secret-key
   APP_API_URL=http://localhost:3333
   APP_WEB_URL=https://abc123.trycloudflare.com
   ```

   > **Note:** `APP_API_URL` stays as `localhost:3333` because the Vite proxy handles API routing. The frontend uses relative `/api` paths which are proxied to the backend.

### Alternative: Frontend with Tunnel URL (No Port 80 Required)

If you don't want to run on port 80 or use sudo:

1. Start frontend on default Vite port (5173):
   ```bash
   cd frontend
   # Edit vite.config.js, change port: 80 to port: 5173
   yarn dev
   ```

2. Start cloudflared tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

3. Set `VITE_API_BASE_URL` in frontend `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3333
   ```

## Environment Variables Reference

### Backend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_SECRET` | JWT secret key | (required) |
| `APP_API_URL` | Public URL of backend server | `http://localhost:3333` |
| `APP_WEB_URL` | Public URL of frontend | `http://localhost:3000` |

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `/api` (relative) |
| `VITE_API_PROXY_TARGET` | Vite dev server proxy target | `http://localhost:3333` |

## How It Works

### Avatar URLs

- **Before fix**: Backend always returned `http://localhost:3333/files/avatar.jpg`
- **After fix**: Backend uses `APP_API_URL` which you configure to your tunnel URL
- Result: `https://your-tunnel.trycloudflare.com/files/avatar.jpg`

### API Requests

- **Before fix**: Frontend hardcoded `/api` proxy to `localhost:3333`
- **After fix**: Frontend uses `VITE_API_BASE_URL` for tunnel deployments
- Result: API requests go through the tunnel correctly

## Verification Checklist

- [ ] Backend `APP_API_URL` is set to your tunnel URL
- [ ] Frontend can access avatar images via tunnel
- [ ] Customer settings page (`/dashboard?tab=settings`) can update information
- [ ] Product listing and photos still work
- [ ] Authentication (login/logout) works via tunnel

## Troubleshooting

### Avatars Still Not Loading

1. Check browser console for failed image requests
2. Verify `APP_API_URL` matches your tunnel URL exactly
3. Ensure the tunnel is running and accessible

### Customer Updates Failing

1. Check browser Network tab for failed API requests
2. Verify the request URL is correct (not localhost)
3. Check CORS configuration in backend if needed

### CORS Issues

The backend has CORS enabled with default settings. If you need to restrict origins:

```typescript
// backend/src/shared/http/server.ts
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
```

## Production Deployment

For production, consider:
- Using a custom domain instead of `trycloudflare.com`
- Setting up Cloudflare Tunnel with a named tunnel configuration
- Using environment-specific `.env.production` files
- Setting up proper SSL certificates
