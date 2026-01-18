# Fix Deployment Issues

## Issue 1: WEB_APP_URL is localhost

**Problem:** The bot is using `http://localhost:3000` which won't work in production.

**Solution:** Set the `WEB_APP_URL` environment variable in your deployment platform.

### For Railway:
1. Go to your Railway project dashboard
2. Click on your Discord bot service
3. Go to the **Variables** tab
4. Add or update `WEB_APP_URL`:
   - Value: `https://your-web-app.vercel.app` (replace with your actual Vercel URL)
   - Or: `https://your-web-app-domain.com` (if using a custom domain)

### For Render:
1. Go to your Render dashboard
2. Click on your Background Worker
3. Go to the **Environment** tab
4. Add or update `WEB_APP_URL`:
   - Key: `WEB_APP_URL`
   - Value: `https://your-web-app.vercel.app` (replace with your actual URL)

### Finding Your Web App URL:
- If deployed on Vercel: Check your Vercel dashboard → Your project → Settings → Domains
- Common format: `https://your-project-name.vercel.app`
- Or use your custom domain if configured

### After Updating:
- Railway/Render will automatically restart the bot
- Check the logs to verify the new URL is being used
- You should see: `🌐 Web app URL: https://your-app.vercel.app`

---

## Issue 2: Deprecation Warning (Fixed)

**Problem:** `(node:26) DeprecationWarning: The ready event has been renamed to clientReady`

**Status:** ✅ **FIXED** - The code has been updated to use `clientReady` instead of `ready`.

**Action Required:** 
- Pull the latest code: `git pull`
- Redeploy (or wait for auto-deploy if connected to GitHub)

---

## Quick Fix Checklist

- [ ] Set `WEB_APP_URL` environment variable in deployment platform
- [ ] Use HTTPS URL (not HTTP) for production
- [ ] Verify the URL is accessible (test in browser)
- [ ] Check bot logs after restart to confirm new URL
- [ ] Test by posting a video URL in Discord channel

---

## Testing the Fix

1. **Verify Environment Variable:**
   - Check deployment logs - should show the correct URL
   - Should NOT show `http://localhost:3000`

2. **Test Video Submission:**
   - Post a YouTube or TikTok URL in your Discord channel
   - Check bot logs for submission status
   - Verify video appears in your web app

3. **Check for Errors:**
   - Look for connection errors in logs
   - Should see successful API calls to your web app

---

## Common Mistakes

❌ **Wrong:**
```
WEB_APP_URL=http://localhost:3000
WEB_APP_URL=https://localhost:3000
```

✅ **Correct:**
```
WEB_APP_URL=https://your-app.vercel.app
WEB_APP_URL=https://tiktok-challenge-platform.vercel.app
```

---

## Still Having Issues?

1. **Check API Endpoint:**
   - Verify `/api/videos/submit` exists on your web app
   - Test it manually: `curl -X POST https://your-app.vercel.app/api/videos/submit`

2. **Check CORS:**
   - Ensure your web app allows requests from your bot's origin
   - Check web app logs for CORS errors

3. **Check Authentication:**
   - If using `API_SECRET`, ensure it matches in both bot and web app
   - Check web app logs for authentication errors

4. **Network Issues:**
   - Verify the web app URL is publicly accessible
   - Check if there are firewall restrictions
