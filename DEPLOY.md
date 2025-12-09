# 🚀 Quick Deploy Guide

## 📋 Quick Start

Run the one-click deployment script:

\`\`\`bash
./deploy.sh
\`\`\`

---

## 🔧 Manual Deployment Steps

### Step 1: Push to GitHub

\`\`\`bash
cd /Users/k/Desktop/novel-free-my/W-0-260

# Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit: 2048 games platform"

# Add remote repository
git remote add origin https://github.com/wang2186223/gametest.git
git branch -M main
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Website (Recommended)

1. Visit [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `wang2186223/gametest` repository
5. Click "Deploy"

#### Option B: Using Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\`

### Step 3: Configure Custom Domain

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add domain: `game.irresistibleseduction.top`
4. Update DNS records as instructed by Vercel

---

## 🌐 DNS Configuration

Add these records to your DNS provider:

\`\`\`
Type: CNAME
Name: game (or @)
Value: cname.vercel-dns.com
\`\`\`

Or use A records:
\`\`\`
Type: A
Name: @ or game
Value: 76.76.21.21
\`\`\`

---

## ✅ Verify Deployment

After deployment, test your site:

- ✅ Visit: https://game.irresistibleseduction.top
- ✅ Check both games load correctly
- ✅ Test on mobile and desktop
- ✅ Verify navigation works

---

## 🔄 Update Website

To update after making changes:

\`\`\`bash
git add .
git commit -m "Update description"
git push
\`\`\`

Vercel will automatically redeploy!

---

## 📊 Project Info

- **Repository**: https://github.com/wang2186223/gametest
- **Domain**: game.irresistibleseduction.top
- **Games**: 2 (2048 variations)
- **Platform**: Vercel

---

## 🆘 Troubleshooting

### Problem: Git push rejected
\`\`\`bash
git pull origin main --rebase
git push origin main
\`\`\`

### Problem: Domain not working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check Vercel domain settings

### Problem: Games not loading
- Check browser console for errors
- Verify game file paths are correct
- Ensure all game files are pushed to GitHub

---

**Ready to deploy? Run `./deploy.sh` to get started!** 🚀
