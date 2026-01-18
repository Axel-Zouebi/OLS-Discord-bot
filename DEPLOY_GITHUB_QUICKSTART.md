# Quick Start: Deploy Discord Bot via GitHub

## ⚠️ First Time Setup

**If you haven't created a GitHub repository yet**, see `SETUP_GITHUB_REPO.md` first!

---

## 🚀 Fastest Method: Railway + GitHub

1. **Push to GitHub** (if repo already exists)
   ```bash
   git add .
   git commit -m "Add Discord bot"
   git push origin main
   ```

2. **Connect Railway**
   - Visit https://railway.app
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Set **Root Directory**: `discord-bot`
   - Railway auto-detects `railway.json` config

4. **Add Secrets**
   - Go to Variables tab
   - Add:
     - `DISCORD_BOT_TOKEN`
     - `DISCORD_CHANNEL_ID`
     - `WEB_APP_URL`
     - `YOUTUBE_API_KEY`

5. **Done!**
   - Railway auto-deploys on every push
   - Check logs to verify bot is running

## 📝 What Happens Next?

- ✅ Every push to `main` → Auto-deploys
- ✅ Bot runs 24/7
- ✅ Logs available in Railway dashboard
- ✅ Bot restarts automatically on crashes

## 🔄 Alternative: Render (Free Tier)

1. Visit https://render.com
2. Sign in with GitHub
3. New → Background Worker
4. Connect repo, set root to `discord-bot`
5. Add environment variables
6. Deploy!

## 📚 Full Guide

See `GITHUB_DEPLOYMENT.md` for detailed instructions and GitHub Actions setup.
