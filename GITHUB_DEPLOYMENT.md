# Deploying Discord Bot via GitHub

This guide covers deploying your Discord bot using GitHub integration with various platforms.

## 🎯 Overview

Since Discord bots need to run continuously, you'll deploy to a platform that supports long-running processes. GitHub Actions can be used for CI/CD, but the actual deployment happens on platforms like Railway, Render, or a VPS.

## 🚀 Option 1: Railway (Recommended - Easiest GitHub Integration)

Railway offers seamless GitHub integration with automatic deployments.

### Steps:

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect Railway to GitHub**
   - Go to https://railway.app
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect the project
   - Set the **Root Directory** to `discord-bot`
   - Railway will use the `railway.json` config file automatically

4. **Add Environment Variables**
   - Go to your service → Variables tab
   - Add these secrets:
     ```
     DISCORD_BOT_TOKEN=your_discord_bot_token
     DISCORD_CHANNEL_ID=your_channel_id
     WEB_APP_URL=https://your-web-app.vercel.app
     YOUTUBE_API_KEY=your_youtube_api_key
     API_SECRET=your_api_secret (optional)
     ```

5. **Automatic Deployments**
   - Railway automatically deploys on every push to your main branch
   - You can also set up branch deployments for staging

6. **Monitor Deployments**
   - Check the Deployments tab to see build logs
   - View real-time logs in the Logs tab
   - You should see: `✅ Discord bot logged in as YourBot#1234`

---

## 🚀 Option 2: Render (Free Tier Available)

Render offers GitHub integration with automatic deployments.

### Steps:

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect Render to GitHub**
   - Go to https://render.com
   - Sign up/login with GitHub
   - Click "New +" → "Background Worker"

3. **Configure Service**
   - **Name**: `discord-video-bot`
   - **Repository**: Select your GitHub repo
   - **Root Directory**: `discord-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier available

4. **Add Environment Variables**
   - Go to Environment tab
   - Add all required variables (same as Railway)

5. **Deploy**
   - Click "Create Background Worker"
   - Render will build and deploy automatically
   - Future pushes to main branch will auto-deploy

---

## 🔧 Option 3: GitHub Actions + Self-Hosted Runner

If you have your own server/VPS, you can use GitHub Actions to deploy automatically.

### Setup:

1. **Create GitHub Actions Workflow**
   - See `.github/workflows/deploy.yml` (created below)
   - This workflow will:
     - Run tests on push/PR
     - Deploy to your server on push to main

2. **Set Up Self-Hosted Runner**
   - Go to your repo → Settings → Actions → Runners
   - Click "New self-hosted runner"
   - Follow instructions for your OS
   - Run the runner on your VPS

3. **Add GitHub Secrets**
   - Go to repo → Settings → Secrets and variables → Actions
   - Add secrets:
     - `DISCORD_BOT_TOKEN`
     - `DISCORD_CHANNEL_ID`
     - `WEB_APP_URL`
     - `YOUTUBE_API_KEY`
     - `API_SECRET` (optional)
     - `SERVER_HOST` (your VPS IP/hostname)
     - `SERVER_USER` (SSH username)
     - `SSH_PRIVATE_KEY` (SSH private key for deployment)

4. **Deploy**
   - Push to main branch
   - GitHub Actions will automatically deploy

---

## 🔄 Option 4: GitHub Actions + Railway API

Deploy to Railway automatically via GitHub Actions using Railway's API.

### Setup:

1. **Get Railway API Token**
   - Go to Railway → Account Settings → Tokens
   - Create a new token
   - Copy the token

2. **Add GitHub Secrets**
   - Go to repo → Settings → Secrets and variables → Actions
   - Add `RAILWAY_TOKEN` with your Railway API token
   - Add `RAILWAY_SERVICE_ID` (find in Railway dashboard URL)

3. **Workflow**
   - The workflow (see below) will trigger Railway deployments
   - Railway handles the actual deployment

---

## 📋 GitHub Actions Workflows

### CI/CD Workflow (Testing & Building)

This workflow runs on every push and PR to ensure code quality:

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: discord-bot/package-lock.json
    
    - name: Install dependencies
      working-directory: ./discord-bot
      run: npm ci
    
    - name: Run linter
      working-directory: ./discord-bot
      run: npm run lint || true
    
    - name: Build
      working-directory: ./discord-bot
      run: npm run build
```

### Deployment Workflow (Self-Hosted)

**File**: `.github/workflows/deploy.yml`

This workflow deploys to a VPS using SSH:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: self-hosted
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: ./discord-bot
      run: npm ci --production
    
    - name: Create .env file
      working-directory: ./discord-bot
      run: |
        echo "DISCORD_BOT_TOKEN=${{ secrets.DISCORD_BOT_TOKEN }}" > .env
        echo "DISCORD_CHANNEL_ID=${{ secrets.DISCORD_CHANNEL_ID }}" >> .env
        echo "WEB_APP_URL=${{ secrets.WEB_APP_URL }}" >> .env
        echo "YOUTUBE_API_KEY=${{ secrets.YOUTUBE_API_KEY }}" >> .env
        [ -n "${{ secrets.API_SECRET }}" ] && echo "API_SECRET=${{ secrets.API_SECRET }}" >> .env
    
    - name: Restart bot with PM2
      run: |
        pm2 restart discord-video-bot || pm2 start ecosystem.config.js
        pm2 save
```

---

## 🔐 GitHub Secrets Setup

To use GitHub Actions for deployment, add these secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DISCORD_BOT_TOKEN` | Discord bot token | `MTIzNDU2Nzg5MDEyMzQ1Njc4OQ...` |
| `DISCORD_CHANNEL_ID` | Channel ID to monitor | `123456789012345678` |
| `WEB_APP_URL` | Your web app URL | `https://your-app.vercel.app` |
| `YOUTUBE_API_KEY` | YouTube API key | `AIzaSy...` |
| `API_SECRET` | API secret (optional) | `your-secret-key` |

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] Platform connected to GitHub (Railway/Render)
- [ ] Environment variables configured
- [ ] Bot shows as "Active" in Discord
- [ ] Logs show successful login
- [ ] Test by posting a video URL in Discord
- [ ] Verify video submission works
- [ ] Set up monitoring/alerting

---

## 🔄 Updating the Bot

### Automatic (Railway/Render)
- Just push to GitHub
- Platform auto-deploys on push to main branch

### Manual (GitHub Actions)
- Push to main branch
- GitHub Actions workflow runs automatically
- Bot restarts with new code

---

## 🐛 Troubleshooting

### GitHub Actions Fails
- ✅ Check all secrets are set correctly
- ✅ Verify workflow file syntax (YAML)
- ✅ Check Actions tab for error logs

### Deployment Doesn't Trigger
- ✅ Verify branch name matches workflow trigger
- ✅ Check if workflow file is in `.github/workflows/`
- ✅ Ensure file has `.yml` or `.yaml` extension

### Bot Not Starting After Deploy
- ✅ Check environment variables are set
- ✅ Review deployment logs
- ✅ Verify Discord bot token is valid

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway GitHub Integration](https://docs.railway.app/guides/github)
- [Render GitHub Integration](https://render.com/docs/github)
- [Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)

---

## 💡 Best Practices

1. **Use Branch Protection**
   - Require PR reviews before merging to main
   - Run CI checks before allowing merge

2. **Environment Variables**
   - Never commit secrets to GitHub
   - Use GitHub Secrets or platform environment variables

3. **Deployment Strategy**
   - Use staging branch for testing
   - Deploy to production from main branch only

4. **Monitoring**
   - Set up alerts for failed deployments
   - Monitor bot uptime
   - Check logs regularly
