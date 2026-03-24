# CoreFoundry Frontend
 
Frontend application for CoreFoundry - AI Agent Management Platform.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

Every push to the `main` branch will automatically trigger a deployment to GitHub Pages via GitHub Actions.

### One-time Setup Required

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Build and deployment**, set:
   - **Source**: GitHub Actions

That's it! Future commits to `main` will deploy automatically.

### Manual Build

To build locally:

```bash
npm run build
```

The build output will be in the `dist` folder.

### Local Development

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file with:

```
VITE_COREFOUNDRY_API_URL=https://your-api-url.com
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- TanStack Query
- React Hook Form
- Zod

## GitHub Pages URL

After deployment, your app will be available at:
```
https://YOUR_USERNAME.github.io/corefoundry-frontend/
```

Replace `YOUR_USERNAME` with your GitHub username.
