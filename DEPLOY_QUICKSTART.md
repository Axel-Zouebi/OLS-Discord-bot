# Quick Deployment Guide

## ⚠️ Why Not Vercel?

Vercel is perfect for your Next.js web app, but **not for the Discord bot** because:
- Vercel uses serverless functions (10-60 second timeouts)
- Discord bots need persistent, always-running processes
- Bots maintain WebSocket connections that must stay alive 24/7

**Solution:** Deploy the web app to Vercel, and the bot to Railway/Render/VPS.

---

## 🚀 Fastest Way: Railway (5 minutes)

1. **Go to Railway**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Configure**:
   - Root Directory: `discord-bot`
   - Start Command: `npm start`
4. **Add Environment Variables**:
   ```
   DISCORD_BOT_TOKEN=your_token
   DISCORD_CHANNEL_ID=your_channel_id
   WEB_APP_URL=https://your-app.vercel.app
   YOUTUBE_API_KEY=your_key
   ```
5. **Deploy** - Done! ✅

---

## 📋 Required Environment Variables

Copy these to your deployment platform:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_channel_id
WEB_APP_URL=https://your-deployed-web-app.com
YOUTUBE_API_KEY=your_youtube_api_key
```

**Optional:**
```env
API_SECRET=your_api_secret
DISCORD_GUILD_ID=your_server_id
```

---

## ✅ Verify Deployment

1. Check logs - should see: `✅ Discord bot logged in as YourBot#1234`
2. Test by posting a YouTube/TikTok URL in your Discord channel
3. Check your web app dashboard - video should appear

---

## 📖 Full Guide

See `DEPLOYMENT.md` for detailed instructions on:
- Railway, Render, VPS, Heroku
- PM2 setup
- Monitoring
- Troubleshooting

---

## 🔗 Quick Links

- [Discord Developer Portal](https://discord.com/developers/applications) - Get bot token
- [Railway](https://railway.app) - Easiest deployment
- [Render](https://render.com) - Free tier available

