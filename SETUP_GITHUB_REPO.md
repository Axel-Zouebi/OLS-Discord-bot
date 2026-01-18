# Setting Up GitHub Repository for Discord Bot

This guide will help you create a GitHub repository and push your Discord bot code.

## ⚠️ Important Note

**Work from within the `discord-bot/` directory only!** This ensures that:
- ✅ Only the `discord-bot/` folder is pushed to GitHub
- ✅ The parent `OLS-Discord/` folder is NOT included
- ✅ The `Tiktok-Challenge/` folder (which has its own repo) is NOT included

All git commands should be run from: `C:\Users\axelz\Documents\OLS-Discord\discord-bot`

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. **Go to GitHub**
   - Visit https://github.com
   - Sign in (or create an account if needed)

2. **Create New Repository**
   - Click the **"+"** icon in the top right
   - Select **"New repository"**

3. **Configure Repository**
   - **Repository name**: `discord-bot` or `ols-discord-bot` (or your preferred name)
   - **Description**: "Discord bot for video submission"
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT** initialize with README, .gitignore, or license (we already have files)
   - Click **"Create repository"**

4. **Copy the Repository URL**
   - GitHub will show you the repository URL
   - Copy it (it will look like: `https://github.com/yourusername/OLS-Discord.git`)

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create OLS-Discord --public --source=. --remote=origin --push
```

---

## Step 2: Initialize Git and Push Code

**⚠️ Important:** Work from within the `discord-bot/` directory to ensure only the bot code is pushed (not the parent folder or `Tiktok-Challenge/`).

Open PowerShell or Terminal and navigate to the discord-bot directory:

```powershell
cd C:\Users\axelz\Documents\OLS-Discord\discord-bot
```

### 1. Initialize Git (if not already done)

```powershell
git init
```

### 2. Add All Files

```powershell
git add .
```

### 3. Create Initial Commit

```powershell
git commit -m "Initial commit: Discord bot with GitHub deployment setup"
```

### 4. Add GitHub Remote

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/axelz/discord-bot.git
```

### 5. Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**✅ This will only push the `discord-bot/` folder contents, not the parent directory or `Tiktok-Challenge/`.**

---

## Step 3: Verify

1. **Check GitHub**
   - Go to your repository on GitHub
   - You should see all your files

2. **Verify Remote**
   ```powershell
   git remote -v
   ```
   Should show your GitHub repository URL

---

## Troubleshooting

### "Repository already exists" Error

If you already have a git repository:
```powershell
git remote -v
```
If origin exists, update it:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Authentication Issues

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use token as password when pushing

**Option 2: Use GitHub CLI**
```powershell
gh auth login
```

**Option 3: Use SSH (Recommended for long-term)**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Change remote to SSH:
   ```powershell
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

### "Nothing to commit" Error

If you see "nothing to commit":
- Check if `.gitignore` is excluding files
- Verify files are tracked: `git status`

---

## Next Steps

After pushing to GitHub:

1. ✅ **Connect to Railway/Render** (see `GITHUB_DEPLOYMENT.md`)
2. ✅ **Set up GitHub Secrets** (if using GitHub Actions)
3. ✅ **Enable branch protection** (optional but recommended)

---

## Quick Command Reference

**⚠️ Always run these commands from within the `discord-bot/` directory:**

```powershell
# Navigate to discord-bot directory
cd C:\Users\axelz\Documents\OLS-Discord\discord-bot

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Your commit message"

# Add remote (first time only)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main

# Future pushes (after first time)
git add .
git commit -m "Your commit message"
git push
```

---

## Need Help?

- [GitHub Docs: Creating a Repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [GitHub Docs: Pushing to GitHub](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository)
