# Free Hosting on GitHub + Railway (Complete Guide)

## Overview

We'll use:
- **GitHub** - Store code (free)
- **Railway** - Host Node.js app (free tier with credits)
- **MongoDB Atlas** - Database (free tier with 512MB)

Total Cost: **$0**

---

## Step 1: Setup GitHub Repository

### 1.1 Create GitHub Account
- Go to https://github.com
- Sign up (free account)
- Verify email

### 1.2 Create New Repository

1. Click "+" → "New repository"
2. Repository name: `agrovision`
3. Description: "Agricultural Planning Platform"
4. Choose: **Public** (can be private too)
5. Check: "Add a README file"
6. Click "Create repository"

### 1.3 Push Your Code to GitHub

Open PowerShell in your project folder (`c:\Users\Welcome\cp`):

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AgroVision application"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/agrovision.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

### 1.4 Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/agrovision
2. You should see all your files there

---

## Step 2: Setup MongoDB Atlas (Free Database)

### 2.1 Create MongoDB Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Register"
- Sign up with email or GitHub
- Verify email

### 2.2 Create Free Cluster

1. Click "Create a Deployment"
2. Choose **M0 (Free)** tier
3. Choose Cloud Provider: **AWS**
4. Choose Region: closest to you
5. Click "Create Deployment"
6. Wait 2-3 minutes for creation

### 2.3 Setup Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Username: `agrovision`
4. Password: Create strong password (save it!)
5. Click "Add User"

### 2.4 Setup Network Access

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add 0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String

1. In left sidebar, click "Database"
2. Click "Connect" button on your cluster
3. Choose "Drivers" (Node.js)
4. Copy connection string
5. Replace `<password>` with your password from Step 2.3

Example:
```
mongodb+srv://agrovision:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agrovision?retryWrites=true&w=majority
```

**Save this! You'll need it next.**

---

## Step 3: Setup Railway (Free Hosting)

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Click "Sign up"
3. **Choose: Sign up with GitHub** (easiest)
4. Authorize Railway to access GitHub
5. Complete signup

### 3.2 Create New Project

1. In Railway dashboard, click "New Project"
2. Click "Deploy from GitHub repo"
3. Search and select: `agrovision`
4. Click "Deploy"

### 3.3 Configure Environment Variables

After deployment starts:

1. Go to your project
2. Click on the Node.js service
3. Click "Variables" tab
4. Add these variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3002` |
   | `MONGODB_URI` | `mongodb+srv://agrovision:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agrovision?retryWrites=true&w=majority` |

   (Use the connection string from Step 2.5)

5. Click "Deploy" to redeploy with new variables

### 3.4 Get Your Live URL

1. In Railway dashboard, find your project
2. Look for "Deployments" section
3. You'll see a URL like: `https://agrovision-production-xxxx.up.railway.app`
4. **Click it - your app is live!** 🎉

---

## Step 4: Auto-Deployment Setup (Optional but Recommended)

Railway automatically deploys when you push to GitHub!

### How it works:

1. You make changes locally
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. Railway detects the push
4. Automatically deploys your changes
5. Your live app updates automatically! ✨

---

## Complete Workflow for Future Development

### Making Changes Locally

```bash
# 1. Make changes to your code
# (Edit files in VS Code)

# 2. Test locally
npm run dev
# Check: http://localhost:3002

# 3. Commit changes
git add .
git commit -m "Add new feature description"

# 4. Push to GitHub
git push origin main

# 5. Railway auto-deploys
# (Check Railway dashboard for status)
# Your live app updates in 1-2 minutes!
```

---

## Troubleshooting

### App won't deploy
1. Check Railway logs: Click project → Deployments → View Logs
2. Common issues:
   - Missing MONGODB_URI variable
   - Wrong MongoDB password
   - Node.js version mismatch

### Database connection fails
1. Check MongoDB Atlas Network Access allows Railway
2. Verify connection string is correct
3. Check username/password in connection string

### Changes not showing after push
1. Wait 1-2 minutes for Railway to redeploy
2. Hard refresh browser (Ctrl+Shift+R)
3. Check Railway deployment status

### Port issues
1. Railway assigns PORT automatically
2. Make sure PORT is set to `3002` in variables
3. Don't hardcode port in code

---

## Useful Commands

### Git Commands
```bash
# Check status
git status

# See commit history
git log

# See what changed
git diff

# Undo last commit (keep files)
git reset --soft HEAD~1

# Push to GitHub
git push origin main

# Pull latest from GitHub
git pull origin main
```

### Railway Dashboard
- View logs: Click Deployments
- See environment: Click Variables
- Monitor: Click Metrics
- Rollback: Click older deployment

---

## File Structure for Hosting

Everything is ready! Railway automatically:
- ✅ Installs dependencies from package.json
- ✅ Runs `npm start` script
- ✅ Exposes port 3002
- ✅ Handles logs and monitoring

---

## Security Notes

1. **Never commit `.env` file** (it's in .gitignore)
2. **Use Railway Variables** for secrets
3. **GitHub can be public** - no secrets will be exposed
4. **MongoDB password** - only in Railway variables
5. **Keep backups** - export data regularly

---

## Continuous Development Workflow

```
Local Development
       ↓
    (git push)
       ↓
   GitHub Repo
       ↓
   (auto-trigger)
       ↓
   Railway Deploy
       ↓
   Live Website 🌐
```

---

## Next Steps

1. ✅ Push code to GitHub (Step 1)
2. ✅ Create MongoDB Atlas cluster (Step 2)
3. ✅ Deploy on Railway (Step 3)
4. ✅ Test your live app
5. ✅ Continue developing!

---

## Limits & Quotas (Free Tier)

| Service | Free Limit |
|---------|-----------|
| Railway Credits | $5/month (usually enough) |
| MongoDB Storage | 512MB |
| MongoDB Queries | No limit |
| GitHub Repos | Unlimited |
| Deployments | Unlimited |

**Your app should run fine within these limits!**

---

## Example Live App URL

After deployment, your app will be at:
```
https://agrovision-production-xxxx.up.railway.app
```

Share this URL with friends and family to show them your app! 🚀

---

## Get Help

- Railway Docs: https://docs.railway.app/
- MongoDB Docs: https://docs.mongodb.com/
- GitHub Guides: https://guides.github.com/
- Node.js Docs: https://nodejs.org/docs/

---

## Summary

| Step | Service | Cost |
|------|---------|------|
| 1 | GitHub (code) | Free ∞ |
| 2 | MongoDB Atlas (DB) | Free 512MB |
| 3 | Railway (hosting) | Free +$5 monthly credit |
| **Total** | | **$0 Forever** |

You now have a **fully functional production app** hosted online for **$0**! 🎉

---

**Status**: ✅ Ready for Free Hosting
**Last Updated**: May 10, 2026
