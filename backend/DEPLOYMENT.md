# Railway Deployment Guide

## Prerequisites

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

## Environment Variables

You'll need to set these environment variables in Railway:

- `DATABASE_URL`: PostgreSQL connection string (Railway will provide this)
- `JWT_SECRET`: Your JWT secret key
- `JWT_REFRESH_SECRET`: Your JWT refresh secret key
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend-domain.com`)
- `NODE_ENV`: Set to `production`

## Deployment Steps

1. **Initialize Railway project** (if not already done):

   ```bash
   railway init
   ```

2. **Add PostgreSQL database**:

   ```bash
   railway add
   ```

   Select "PostgreSQL" from the options.

3. **Set environment variables**:

   ```bash
   railway variables set JWT_SECRET=your-super-secret-jwt-key-here
   railway variables set JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   railway variables set FRONTEND_URL=https://your-frontend-domain.com
   railway variables set NODE_ENV=production
   ```

4. **Deploy to Railway**:

   ```bash
   railway up
   ```

5. **Run database migrations**:

   ```bash
   railway run npm run db:migrate
   ```

6. **Generate Prisma client**:
   ```bash
   railway run npm run db:generate
   ```

## Post-Deployment

1. **Get your deployment URL**:

   ```bash
   railway domain
   ```

2. **Update your frontend** to use the new backend URL.

3. **Test the health endpoint**: `https://your-railway-url.railway.app/health`

## Troubleshooting

- Check logs: `railway logs`
- View deployment status: `railway status`
- Open Railway dashboard: `railway open`

## Important Notes

- Railway automatically sets the `PORT` environment variable
- The `DATABASE_URL` is automatically provided by Railway when you add a PostgreSQL database
- Make sure your frontend CORS settings match your Railway domain
- The health check endpoint is configured at `/health`
