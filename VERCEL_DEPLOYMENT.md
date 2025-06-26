# Deploying Module Federation to Vercel

This guide will help you deploy your Nx module federation setup to Vercel.

## Overview

Your project consists of:
- **Shell app** (`apps/shell/`) - The host application that consumes remotes
- **Chart app** (`apps/chart/`) - A remote application that exposes modules

## Pre-deployment Setup

1. **Install Vercel CLI** (if you haven't already):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

## Deployment Steps

### Step 1: Deploy the Chart (Remote) App First

The remote app needs to be deployed first so we can get its URL for the shell configuration.

1. Navigate to the chart app directory:
```bash
cd apps/chart
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. **Important**: Note the production URL that Vercel provides (e.g., `https://your-chart-app.vercel.app`)

### Step 2: Update Shell Configuration

1. Open `apps/shell/module-federation.config.prod.js`
2. Replace `your-chart-app.vercel.app` with the actual chart deployment URL from Step 1:

```javascript
module.exports = {
  name: 'shell',
  remotes: [
    ['chart', 'https://your-actual-chart-url.vercel.app/']
  ],
};
```

### Step 3: Deploy the Shell (Host) App

1. Navigate to the shell app directory:
```bash
cd apps/shell
```

2. Deploy to Vercel:
```bash
vercel --prod
```

## Alternative: Using Vercel Dashboard

You can also deploy using the Vercel dashboard:

1. Go to [vercel.com](https://vercel.com) and login
2. Click "New Project"
3. Import your repository
4. For each app (chart and shell), create separate projects:

### For Chart App:
- **Framework Preset**: Other
- **Root Directory**: `apps/chart`
- **Build Command**: `npx nx build chart --prod`
- **Output Directory**: `dist/apps/chart`

### For Shell App:
- **Framework Preset**: Other  
- **Root Directory**: `apps/shell`
- **Build Command**: `npx nx build shell --prod`
- **Output Directory**: `dist/apps/shell`

## Important Notes

1. **CORS Headers**: The chart app is configured with CORS headers to allow cross-origin requests from the shell app.

2. **Build Order**: Always deploy the remote (chart) first, then update the shell configuration with the remote URL.

3. **Environment Variables**: If you need environment-specific URLs, you can use Vercel environment variables:
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add `CHART_REMOTE_URL` with your chart app URL
   - Update the config to use `process.env.CHART_REMOTE_URL`

4. **Testing**: After deployment, test that:
   - The chart app loads independently at its URL
   - The shell app loads and can consume the chart remote
   - All module federation features work as expected

## Troubleshooting

- **CORS Issues**: Ensure the chart app includes proper CORS headers (already configured in `vercel.json`)
- **Build Failures**: Check that all dependencies are listed in `package.json`
- **Module Loading Errors**: Verify the remote URL in the shell configuration is correct and accessible

## File Structure After Setup

```
apps/
├── chart/
│   ├── vercel.json
│   └── rspack.config.prod.js (updated)
├── shell/
│   ├── vercel.json
│   ├── module-federation.config.prod.js (new)
│   └── rspack.config.prod.js (updated)
```

After following these steps, both your shell and chart applications will be deployed and working with module federation on Vercel! 