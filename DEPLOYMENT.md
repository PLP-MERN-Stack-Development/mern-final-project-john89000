# Deployment Guide

This guide covers deploying the Task Manager application to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [Docker Deployment](#docker-deployment)

## Prerequisites

- GitHub account with your repository
- MongoDB Atlas account (for database)
- Deployment platform accounts:
  - Backend: Render, Railway, or Heroku
  - Frontend: Vercel, Netlify, or similar

## Environment Variables

### Backend Environment Variables

Create these in your deployment platform:

\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

### Frontend Environment Variables

\`\`\`env
VITE_API_URL=https://your-backend-url.com/api
\`\`\`

## Database Setup

### MongoDB Atlas

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select your preferred cloud provider and region
   - Create cluster

3. **Configure Database Access**
   - Go to "Database Access"
   - Add a new database user
   - Choose password authentication
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace \`<password>\` with your database password
   - Replace \`<dbname>\` with "taskmanager"

## Backend Deployment

### Option 1: Render

1. **Create Account**
   - Go to [Render](https://render.com/)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** taskmanager-backend
     - **Environment:** Node
     - **Build Command:** \`cd backend && npm install\`
     - **Start Command:** \`cd backend && npm start\`
     - **Branch:** main

3. **Add Environment Variables**
   - Add all backend environment variables
   - Use your MongoDB Atlas connection string

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL

### Option 2: Railway

1. **Create Account**
   - Go to [Railway](https://railway.app/)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect Node.js
   - Set root directory to \`backend\`
   - Add environment variables

4. **Deploy**
   - Railway will automatically deploy
   - Get your service URL from settings

### Option 3: Heroku

1. **Install Heroku CLI**
   \`\`\`bash
   npm install -g heroku
   \`\`\`

2. **Login**
   \`\`\`bash
   heroku login
   \`\`\`

3. **Create App**
   \`\`\`bash
   heroku create taskmanager-backend
   \`\`\`

4. **Add MongoDB Add-on or Use Atlas**
   \`\`\`bash
   heroku config:set MONGODB_URI="your_mongodb_atlas_url"
   \`\`\`

5. **Set Environment Variables**
   \`\`\`bash
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set CLIENT_URL="your_frontend_url"
   \`\`\`

6. **Deploy**
   \`\`\`bash
   git subtree push --prefix backend heroku main
   \`\`\`

## Frontend Deployment

### Option 1: Vercel

1. **Create Account**
   - Go to [Vercel](https://vercel.com/)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite

3. **Configure**
   - **Root Directory:** frontend
   - **Framework Preset:** Vite
   - **Build Command:** \`npm run build\`
   - **Output Directory:** \`build\`

4. **Environment Variables**
   - Add \`VITE_API_URL\` with your backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Get your deployment URL

### Option 2: Netlify

1. **Create Account**
   - Go to [Netlify](https://www.netlify.com/)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build Settings**
   - **Base directory:** frontend
   - **Build command:** \`npm run build\`
   - **Publish directory:** \`frontend/build\`

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add \`VITE_API_URL\`

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment

### Option 3: GitHub Pages (Static Only)

\`\`\`bash
cd frontend
npm run build
npx gh-pages -d build
\`\`\`

## Docker Deployment

### Using Docker Compose

1. **Install Docker and Docker Compose**

2. **Set Environment Variables**
   Create a \`.env\` file in the root directory with all required variables

3. **Build and Run**
   \`\`\`bash
   docker-compose up --build -d
   \`\`\`

4. **View Logs**
   \`\`\`bash
   docker-compose logs -f
   \`\`\`

5. **Stop Services**
   \`\`\`bash
   docker-compose down
   \`\`\`

### Deploy to AWS ECS/Fargate

1. **Build and Push Images**
   \`\`\`bash
   # Build images
   docker build -t taskmanager-backend ./backend
   docker build -t taskmanager-frontend ./frontend

   # Tag images
   docker tag taskmanager-backend:latest your-ecr-repo/backend:latest
   docker tag taskmanager-frontend:latest your-ecr-repo/frontend:latest

   # Push to ECR
   docker push your-ecr-repo/backend:latest
   docker push your-ecr-repo/frontend:latest
   \`\`\`

2. **Create ECS Cluster and Services** via AWS Console

## Post-Deployment Checklist

- [ ] Backend is accessible and returns health check
- [ ] Frontend loads correctly
- [ ] Database connection is established
- [ ] Environment variables are set correctly
- [ ] Authentication works (register/login)
- [ ] API calls from frontend to backend work
- [ ] Real-time updates (Socket.io) work
- [ ] CORS is configured properly
- [ ] HTTPS is enabled (recommended)
- [ ] Update README with live URLs
- [ ] Test all major features

## Troubleshooting

### Backend Issues

**Problem:** Cannot connect to database
- **Solution:** Check MongoDB Atlas network access and connection string

**Problem:** CORS errors
- **Solution:** Verify CLIENT_URL environment variable matches frontend URL

**Problem:** 500 errors
- **Solution:** Check logs for specific errors, verify environment variables

### Frontend Issues

**Problem:** API calls fail
- **Solution:** Verify VITE_API_URL points to correct backend URL

**Problem:** Build fails
- **Solution:** Check for TypeScript errors or missing dependencies

**Problem:** 404 on refresh
- **Solution:** Configure redirect rules for SPA:
  - Vercel: Create \`vercel.json\` with rewrites
  - Netlify: Create \`_redirects\` file

## Monitoring and Maintenance

### Set Up Monitoring

- Use platform-provided logs (Render, Railway, Vercel)
- Consider external monitoring (e.g., New Relic, DataDog)
- Set up error tracking (e.g., Sentry)

### Database Backups

- Enable automated backups in MongoDB Atlas
- Export data regularly for critical deployments

### Updates and Maintenance

- Keep dependencies updated
- Monitor security vulnerabilities
- Review and rotate secrets periodically
- Monitor API usage and rate limits

## Cost Optimization

- Use free tiers when possible
- Optimize database indexes
- Enable caching where appropriate
- Consider serverless options for low traffic
- Monitor resource usage

## Support

If you encounter issues during deployment:
1. Check platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test locally with production settings
5. Reach out to platform support or course instructor
