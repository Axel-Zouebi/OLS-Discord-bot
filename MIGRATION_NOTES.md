# Migration Notes

This Discord bot has been moved from `Tiktok-Challenge/discord-bot` to its own separate directory at `C:\Users\axelz\Documents\discord-bot`.

## What Changed

- ✅ Bot is now in its own directory: `C:\Users\axelz\Documents\discord-bot`
- ✅ All files have been moved successfully
- ✅ PM2 ecosystem config has been updated
- ✅ Bot can now be in a separate GitHub repository

## Next Steps

### 1. Initialize Git Repository (if not already done)

```bash
cd C:\Users\axelz\Documents\discord-bot
git init
git add .
git commit -m "Initial commit: Discord video submission bot"
```

### 2. Create GitHub Repository

1. Go to GitHub and create a new repository
2. Add the remote:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### 3. Delete Old Folder (when ready)

Once you've verified everything works, you can delete the old folder:
```bash
# Close any programs using the folder (IDE, terminals, etc.)
# Then delete:
Remove-Item -Path "C:\Users\axelz\Documents\Tiktok-Challenge\discord-bot" -Recurse -Force
```

### 4. Update Deployment Configurations

If you've already deployed the bot, update:
- Railway: Update root directory to `/` (or remove it)
- Render: Update root directory to `/` (or remove it)
- VPS: Update any scripts that reference the old path

## Running the Bot

From the new location:
```bash
cd C:\Users\axelz\Documents\discord-bot
npm install  # If needed
npm run dev  # Development
npm start    # Production
```

## Environment Variables

Make sure your `.env` file is in `C:\Users\axelz\Documents\discord-bot\.env` with:
- `DISCORD_BOT_TOKEN`
- `DISCORD_CHANNEL_ID`
- `WEB_APP_URL` (your deployed web app URL)
- `YOUTUBE_API_KEY` (optional)

