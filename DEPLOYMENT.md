# Deployment Guide for Vercel

## Prerequisites

1. GitHub repository created
2. Vercel account
3. Railway PostgreSQL database (already configured)

## Step-by-Step Deployment Process

### 1. GitHub Repository Setup

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MalishaEdu platform ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Vercel Project Setup

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**
   - Framework Preset: `Other`
   - Root Directory: `./` (root)
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

### 3. Environment Variables Setup

Add these environment variables in Vercel Dashboard:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration (Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:DWBouskNuITxtXAVLeduhBrRWykgUSSs@tramway.proxy.rlwy.net:59607/railway

# JWT Configuration
JWT_SECRET=Asif@10018
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=MalishaEdu <your-email@gmail.com>

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=d64e7978ed801f4ac433d221e0cb0649
R2_ACCESS_KEY_ID=15a24647194a77aad11f185c00970dd0
R2_SECRET_ACCESS_KEY=c1e696264668b40b87b1f6e2ea68b6639909f115d468c5a337088569ad5de211
R2_BUCKET_NAME=malisha-edu-storage
R2_PUBLIC_URL=https://pub-9c8141e374374e25a5892600464a26e3.r2.dev
R2_API_TOKEN_VALUE=7qsAb9Sz5mlfYQpl_ilXSBV92NtA8rxnHAjQ4RR-
R2_API_DEFAULT_VALUE=https://d64e7978ed801f4ac433d221e0cb0649.r2.cloudflarestorage.com

# CORS Configuration (Update with your Vercel URL)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. GitHub Actions Setup

1. **Get Vercel Tokens**
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token
   - Copy the token

2. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 5. Deploy

1. **Automatic Deployment**
   - Push to main branch triggers automatic deployment
   - GitHub Actions will build and deploy to Vercel

2. **Manual Deployment**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

### 6. Post-Deployment Setup

1. **Run Database Migrations**
   ```bash
   # Connect to Vercel function and run migrations
   vercel env pull .env.local
   npm run migrate:prod
   npm run seed:prod
   ```

2. **Verify Deployment**
   - Check API endpoints: `https://your-app.vercel.app/api/health`
   - Test frontend: `https://your-app.vercel.app`
   - Test admin login with credentials:
     - Username: `admin`
     - Password: `Asif@12345`

## File Structure for Deployment

```
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── .gitignore                      # Git ignore file
├── vercel.json                     # Vercel configuration
├── api/index.js                    # Vercel serverless function
├── backend/                        # Backend API
├── frontend/                       # Vue.js frontend
└── DEPLOYMENT.md                   # This guide
```

## Troubleshooting

1. **Build Failures**
   - Check environment variables
   - Verify Node.js version compatibility
   - Check build logs in Vercel dashboard

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Railway database status
   - Ensure SSL is enabled

3. **API Issues**
   - Check CORS configuration
   - Verify FRONTEND_URL matches your domain
   - Check rate limiting settings

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Admin user created
- [ ] SSL certificates active
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Monitoring set up
