# Deployment Guide

This guide will walk you through deploying CLI Quest to GitHub and hosting platforms.

## Prerequisites

- Git installed on your system
- GitHub account
- GitHub repository created at: https://github.com/jonholm/cli-quest

## Pushing to GitHub

### First Time Setup

1. **Initialize Git Repository** (if not already done)
   ```bash
   cd /Users/jonholm/Dev/CLI-Quest
   git init
   ```

2. **Add All Files**
   ```bash
   git add .
   ```

3. **Create Initial Commit**
   ```bash
   git commit -m "Initial commit: CLI Quest v1.0

   Features:
   - 5 learning zones with 25+ levels
   - 16 working CLI commands
   - Virtual file system simulation
   - XP system and achievements
   - 100% keyboard navigation
   - MacOS terminal window chrome
   - Comprehensive documentation

   Tech stack:
   - Next.js 14 with App Router
   - TypeScript
   - Tailwind CSS
   - Zustand state management"
   ```

4. **Add GitHub Remote**
   ```bash
   git remote add origin https://github.com/jonholm/cli-quest.git
   ```

5. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

   If your default branch is `master` instead of `main`:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Future Updates

For future changes:

```bash
# Check what files have changed
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug"
# or
git commit -m "docs: update documentation"

# Push to GitHub
git push
```

## Deploying to Vercel

Vercel is the recommended hosting platform for Next.js apps (created by the Next.js team).

### Steps:

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `jonholm/cli-quest`

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - Your app will be live at: `https://cli-quest.vercel.app` (or custom domain)

5. **Automatic Deployments**
   - Every push to `main` branch will automatically deploy
   - Pull requests get preview deployments

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `cliquest.com`)
4. Follow DNS configuration instructions

## Deploying to Netlify

Alternative to Vercel:

1. **Go to Netlify**
   - Visit https://netlify.com
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select `jonholm/cli-quest`

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

4. **Next.js Plugin** (Important!)
   - Go to "Plugins" in your site dashboard
   - Install "Next.js Plugin" for proper functionality

## Deploying to Other Platforms

### AWS Amplify

1. Visit AWS Amplify Console
2. Connect to GitHub repository
3. Amplify auto-detects Next.js configuration
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t cli-quest .
docker run -p 3000:3000 cli-quest
```

### Static Export (Not Recommended for CLI Quest)

CLI Quest uses dynamic routes and server features, so static export may not work properly. Stick with platforms that support full Next.js.

## Environment Variables

Currently, CLI Quest doesn't require any environment variables. If you add features that need them (like analytics):

### Vercel
1. Go to project settings → Environment Variables
2. Add your variables
3. Redeploy

### Netlify
1. Site settings → Build & Deploy → Environment
2. Add variables
3. Trigger redeploy

## Post-Deployment Checklist

After deploying:

- [ ] Test all zones load correctly
- [ ] Verify keyboard navigation works
- [ ] Test level completion and progress saving
- [ ] Check achievements system
- [ ] Test on mobile browsers
- [ ] Verify terminal chrome displays properly
- [ ] Test sandbox mode
- [ ] Check tutorial page
- [ ] Update README with live demo URL

## Monitoring

### Vercel Analytics (Free Tier)
- Automatically enabled
- View in Vercel dashboard

### Google Analytics (Optional)
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`
3. Redeploy

## Troubleshooting

### Build Fails

**Issue:** Build fails with module not found
- **Fix:** Make sure all imports use correct paths
- Run `npm run build` locally first to catch errors

**Issue:** Tailwind styles not applying
- **Fix:** Check `tailwind.config.ts` is correct
- Verify `globals.css` imports Tailwind directives

### Runtime Errors

**Issue:** localStorage not working
- **Fix:** This is expected on first visit
- Zustand handles this gracefully

**Issue:** Routes not working
- **Fix:** Ensure platform supports Next.js App Router
- Check that dynamic routes `[param]` are supported

### Performance

**Issue:** Slow load times
- **Fix:** Enable Vercel's Edge Network (automatic)
- Consider code splitting for large level files

## Updates and Maintenance

### Updating Dependencies

Periodically update dependencies:

```bash
# Check for outdated packages
npm outdated

# Update all to latest compatible versions
npm update

# Or update specific package
npm install next@latest

# Test thoroughly
npm run build
npm start

# Commit and push
git add package*.json
git commit -m "chore: update dependencies"
git push
```

### Adding Features

1. Create feature branch
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and test

3. Commit and push
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push -u origin feature/new-feature
   ```

4. Create Pull Request on GitHub

5. Merge and deploy

## Support

- **Issues:** https://github.com/jonholm/cli-quest/issues
- **Discussions:** https://github.com/jonholm/cli-quest/discussions

---

**Congratulations!** Your CLI Quest app is now live and ready to help people learn the command line! 🎉
