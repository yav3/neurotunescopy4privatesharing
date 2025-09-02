# API Setup Guide

## Environment Configuration

Your app needs the `VITE_API_BASE_URL` environment variable to connect to the Supabase edge function.

### 1. Update your `.env` file

Add this line to your `.env` file (replace with your actual project ID):

```env
VITE_API_BASE_URL=https://your-project-id.supabase.co/functions/v1/api
```

For your project specifically:
```env
VITE_API_BASE_URL=https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api
```

### 2. Restart your dev server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

### 3. Test the API

Open browser console and run:

```javascript
testAPIIntegration()
```

You should see successful API calls instead of "Load failed" errors.

## Troubleshooting

If you're still getting errors:

1. Check browser Network tab for the actual request URLs
2. Verify the edge function is deployed
3. Check Supabase function logs for errors
4. Ensure all environment variables are set correctly

## API Endpoints

Your edge function provides these endpoints:

- `POST /playlist` - Get tracks for a therapeutic goal
- `GET /health` - Health check
- `GET /debug/storage` - Storage diagnostics
- `POST /session/build` - Build therapeutic sessions
- And more (see `/__routes` for full list)