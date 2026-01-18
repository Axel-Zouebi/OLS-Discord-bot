# Discord Bot Deployment Guide

This guide covers deploying the Discord bot for video submission to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Discord bot token (from [Discord Developer Portal](https://discord.com/developers/applications))
- ✅ Discord channel ID where videos will be submitted
- ✅ Web app URL (your deployed Next.js app URL)
- ✅ YouTube API key (optional, for YouTube video metadata)
- ✅ Node.js 18+ installed (on your deployment platform)

## ⚠️ Why Not Vercel?

**Important:** While Vercel is perfect for your Next.js web app, it's **not suitable** for the Discord bot. Here's why:

### Technical Limitations

1. **Serverless Architecture**
   - Vercel uses serverless functions that run on-demand
   - Functions execute only when triggered (HTTP requests)
   - Discord bots need a **persistent, always-running process**

2. **Execution Time Limits**
   - Free tier: 10-second timeout
   - Pro tier: 60-second timeout
   - Discord bots maintain WebSocket connections that must run **indefinitely**
   - The bot would timeout and disconnect constantly

3. **No Background Workers**
   - Vercel doesn't support long-running background processes
   - No way to keep a process alive between requests
   - Discord bots need to stay connected 24/7 to receive messages

4. **WebSocket Connection Requirements**
   - Discord bots use WebSocket connections to Discord's Gateway API
   - This connection must remain open continuously
   - Serverless functions can't maintain persistent connections

5. **Cold Starts**
   - Even if it could work, serverless functions have cold starts
   - The bot would disconnect every time it goes "cold"
   - Messages would be missed during reconnection

### The Solution

**Deploy separately:**
- ✅ **Web App** → Vercel (perfect for Next.js)
- ✅ **Discord Bot** → Railway/Render/VPS (for long-running processes)

This is the standard approach - many projects use Vercel for the frontend/API and a separate service for bots/workers.

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Easiest)

[Railway](https://railway.app) is the easiest way to deploy Node.js bots with automatic deployments.

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect the project
   - Set the **Root Directory** to `discord-bot`
   - Set the **Start Command** to `npm start`

4. **Add Environment Variables**
   - Go to your service → Variables tab
   - Add these variables:
     ```
     DISCORD_BOT_TOKEN=your_discord_bot_token
     DISCORD_CHANNEL_ID=your_channel_id
     WEB_APP_URL=https://your-web-app.vercel.app
     YOUTUBE_API_KEY=your_youtube_api_key
     API_SECRET=your_api_secret (optional)
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Check the logs to verify the bot is running
   - You should see: `✅ Discord bot logged in as YourBot#1234`

#### Railway Configuration File (Optional)

Create `railway.json` in the `discord-bot` directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 2: Render

[Render](https://render.com) offers free tier for background workers.

#### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Background Worker**
   - Click "New +" → "Background Worker"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `discord-video-bot`
   - **Root Directory**: `discord-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Go to Environment tab
   - Add all required variables (same as Railway)

5. **Deploy**
   - Click "Create Background Worker"
   - Render will build and deploy
   - Check logs for confirmation

---

### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

For more control, deploy to a VPS.

#### Steps:

1. **Set Up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Clone and Setup**
   ```bash
   # Clone your repository
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo/discord-bot
   
   # Install dependencies
   npm install --production
   ```

3. **Create Environment File**
   ```bash
   # Create .env file
   nano .env
   ```
   
   Add your environment variables:
   ```env
   DISCORD_BOT_TOKEN=your_token
   DISCORD_CHANNEL_ID=your_channel_id
   WEB_APP_URL=https://your-web-app.vercel.app
   YOUTUBE_API_KEY=your_key
   ```

4. **Start with PM2**
   ```bash
   # Start the bot
   pm2 start npm --name "discord-bot" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   # Follow the instructions it outputs
   ```

5. **Monitor**
   ```bash
   # View logs
   pm2 logs discord-bot
   
   # View status
   pm2 status
   
   # Restart bot
   pm2 restart discord-bot
   ```

#### PM2 Ecosystem File (Optional)

Create `ecosystem.config.js` in `discord-bot`:

```javascript
module.exports = {
  apps: [{
    name: 'discord-bot',
    script: 'npm',
    args: 'start',
    cwd: './discord-bot',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

Then start with: `pm2 start ecosystem.config.js`

---

### Option 4: Heroku

Heroku supports background workers (dynos).

#### Steps:

1. **Install Heroku CLI**
   - Download from https://devcenter.heroku.com/articles/heroku-cli

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-bot-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DISCORD_BOT_TOKEN=your_token
   heroku config:set DISCORD_CHANNEL_ID=your_channel_id
   heroku config:set WEB_APP_URL=https://your-web-app.vercel.app
   heroku config:set YOUTUBE_API_KEY=your_key
   ```

4. **Create Procfile**
   Create `Procfile` in `discord-bot` directory:
   ```
   worker: npm start
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix discord-bot heroku main
   # Or use Heroku Git:
   heroku git:remote -a your-bot-name
   git push heroku main
   ```

6. **Scale Worker**
   ```bash
   heroku ps:scale worker=1
   ```

---

## 🔧 Production Optimizations

### Update package.json for Production

Add a production build script to `discord-bot/package.json`:

```json
{
  "scripts": {
    "start": "tsx index.ts",
    "dev": "tsx watch index.ts",
    "build": "tsc",
    "start:prod": "node dist/index.js"
  }
}
```

Then update `tsconfig.json` to compile to `dist/` folder and use `npm run start:prod` in production.

### Add Health Check Endpoint (Optional)

For platforms that require health checks, you can add a simple HTTP server:

```typescript
// Add to index.ts
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', bot: client.user?.tag }))
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(process.env.PORT || 3001, () => {
  console.log('Health check server running on port', process.env.PORT || 3001)
})
```

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_BOT_TOKEN` | ✅ Yes | Discord bot token from Developer Portal |
| `DISCORD_CHANNEL_ID` | ✅ Yes | Channel ID to monitor for video links |
| `WEB_APP_URL` | ✅ Yes | Your deployed web app URL (e.g., `https://your-app.vercel.app`) |
| `YOUTUBE_API_KEY` | ⚠️ Optional | YouTube Data API key for metadata |
| `API_SECRET` | ⚠️ Optional | Secret for authenticating with web app API |
| `DISCORD_GUILD_ID` | ⚠️ Optional | Discord server ID (for validation) |
| `PORT` | ⚠️ Optional | Port for health check server (default: 3001) |

---

## ✅ Post-Deployment Checklist

- [ ] Bot is online and shows as "Active" in Discord
- [ ] Bot logs show successful login: `✅ Discord bot logged in as...`
- [ ] Test by posting a YouTube/TikTok URL in the configured channel
- [ ] Check bot logs for successful video submission
- [ ] Verify video appears in your web app dashboard
- [ ] Set up monitoring/alerting (optional but recommended)

---

## 📊 Monitoring & Logging

### Railway/Render
- Built-in logs available in dashboard
- Set up alerts for crashes

### VPS with PM2
```bash
# View logs
pm2 logs discord-bot

# Monitor in real-time
pm2 monit

# Set up log rotation
pm2 install pm2-logrotate
```

### External Monitoring (Optional)
- Use services like [UptimeRobot](https://uptimerobot.com) to ping your health check endpoint
- Set up Discord webhook alerts for bot downtime

---

## 🐛 Troubleshooting

### Bot Won't Start
- ✅ Check `DISCORD_BOT_TOKEN` is correct
- ✅ Verify MESSAGE CONTENT INTENT is enabled in Discord Developer Portal
- ✅ Check environment variables are set correctly
- ✅ Review deployment logs for errors

### Bot Not Responding to Messages
- ✅ Verify `DISCORD_CHANNEL_ID` matches the channel
- ✅ Ensure bot has permissions in the channel
- ✅ Check bot is in the correct server

### Videos Not Submitting
- ✅ Verify `WEB_APP_URL` is correct (use HTTPS in production)
- ✅ Check web app API endpoint is accessible
- ✅ Review bot logs for API errors
- ✅ Ensure `API_SECRET` matches if using authentication

### Bot Keeps Crashing
- ✅ Check memory limits (increase if needed)
- ✅ Review error logs for specific issues
- ✅ Ensure all dependencies are installed
- ✅ Verify Node.js version is 18+

---

## 🔄 Updating the Bot

### Railway/Render
- Push changes to GitHub
- Platform auto-deploys (or trigger manual deploy)

### VPS
```bash
cd your-repo/discord-bot
git pull
npm install
pm2 restart discord-bot
```

### Heroku
```bash
git subtree push --prefix discord-bot heroku main
```

---

## 💡 Best Practices

1. **Never commit `.env` files** - Use environment variables in your platform
2. **Use HTTPS** for `WEB_APP_URL` in production
3. **Set up auto-restart** - Use PM2 or platform auto-restart features
4. **Monitor logs** - Regularly check for errors
5. **Keep dependencies updated** - Run `npm audit` periodically
6. **Use process managers** - PM2, systemd, or platform managers
7. **Set up alerts** - Get notified if bot goes down

---

## 📚 Additional Resources

- [Discord.js Documentation](https://discord.js.org)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the logs first
2. Verify all environment variables
3. Test locally before deploying
4. Review the troubleshooting section above

