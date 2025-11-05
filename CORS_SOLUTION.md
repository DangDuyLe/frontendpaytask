# CORS Configuration & Solution

## Problem
Frontend (`https://frontendpaytask.onrender.com`) was unable to make requests to the backend (`https://paytask.onrender.com`) due to CORS policy blocking.

## Solution Implemented

### 1. Next.js Proxy (Frontend Workaround)
Added a rewrite rule in `next.config.ts` to proxy API requests through the Next.js server, bypassing CORS restrictions:

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://paytask.onrender.com/api/:path*',
    },
  ];
}
```

### 2. Dynamic API URL Configuration
Updated `src/api/config.ts` to automatically use the proxy in production:

- **Production**: Uses relative URL `/api` (proxied through Next.js)
- **Development**: Uses `http://localhost:3000/api` (direct connection)

### 3. Environment Variables
Created `.env.local` for local development configuration.

## How It Works

1. **In Production**: 
   - Frontend makes request to `/api/auth/login`
   - Next.js server intercepts and forwards to `https://paytask.onrender.com/api/auth/login`
   - Response returns through Next.js (same origin, no CORS issue)

2. **In Development**:
   - Frontend makes request directly to `http://localhost:3000/api/auth/login`
   - Direct connection to local backend

## Backend Configuration (Recommended Long-term Solution)

While the frontend proxy works, the **proper solution** is to configure CORS on the backend. Add these settings to your backend at `https://paytask.onrender.com`:

```javascript
// Example for Express.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://frontendpaytask.onrender.com',
    'http://localhost:3001', // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Deployment Steps

### For Render.com:
1. **No environment variables needed** - the code automatically detects production
2. Commit and push changes
3. Render will automatically redeploy
4. The proxy will handle all API requests

### Setting Environment Variable (Optional):
If you prefer to set the backend URL explicitly:
```
NEXT_PUBLIC_API_URL=https://paytask.onrender.com/api
```
But this requires proper CORS configuration on the backend.

## Testing

After deployment, test the login functionality:
1. Go to `https://frontendpaytask.onrender.com/login`
2. Enter credentials
3. Check browser DevTools Network tab
4. You should see requests going to `/api/auth/login` (relative URL)
5. No CORS errors should appear

## Troubleshooting

### If you still see CORS errors:
1. Clear browser cache
2. Check that `next.config.ts` changes are deployed
3. Verify the backend URL in the rewrite rule is correct
4. Check Render logs for any errors

### If API calls fail:
1. Verify backend is running at `https://paytask.onrender.com`
2. Test backend directly with curl or Postman
3. Check Render deployment logs

## Files Modified
- `next.config.ts` - Added API proxy rewrite rule
- `src/api/config.ts` - Dynamic API URL based on environment
- `.env.local` - Local development configuration
- `.env.example` - Environment variable template
