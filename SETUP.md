# Harel Playground — Setup Guide

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (GitHub Pages — Free)

The repo uses GitHub Actions to automatically build and deploy to GitHub Pages on every push to `main`. No external services needed.

### One-Time GitHub Setup

1. **Go to your repo** on GitHub
2. **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it — the workflow at `.github/workflows/deploy.yml` handles the rest

After the first push to `main`, the site will be live at:
```
https://<your-github-username>.github.io/<repo-name>/
```

### Custom Domain (Free)

To use your own domain (e.g. `play.example.com`):

1. **Settings → Pages → Custom domain** — enter your domain
2. **At your DNS provider**, add one of these records:

   **For a subdomain** (e.g. `play.example.com`):
   ```
   CNAME  play  <your-github-username>.github.io
   ```

   **For an apex domain** (e.g. `example.com`):
   ```
   A  @  185.199.108.153
   A  @  185.199.109.153
   A  @  185.199.110.153
   A  @  185.199.111.153
   ```

3. **Check "Enforce HTTPS"** in the Pages settings (free SSL via GitHub)
4. **Add a `CNAME` file** to the repo's `public/` folder containing just your domain:
   ```
   play.example.com
   ```

5. If using a custom base path, update `next.config.ts`:
   ```ts
   const nextConfig: NextConfig = {
     output: "export",
     basePath: "", // empty for custom domain, or "/repo-name" for github.io
     images: { unoptimized: true },
   };
   ```

### If Deploying Without a Custom Domain

When serving from `https://<user>.github.io/<repo>/`, you need to set a `basePath` in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/harel-playground",
  images: { unoptimized: true },
};
```

And update the game paths in `src/lib/games.ts` to include the base path prefix.

## Adding a New Game

1. Create a folder under `public/games/<game-name>/` with at least an `index.html`
2. Add an entry to the `games` array in `src/lib/games.ts`:
   ```ts
   {
     slug: "my-new-game",
     title: "My New Game",
     titleHe: "המשחק החדש שלי",
     emoji: "🎯",
     description: "A short description of the game",
     path: "/games/my-new-game/index.html",
   }
   ```
3. The latest game in the array is shown on the homepage automatically
4. Push to `main` — the CI/CD pipeline deploys it

## Tech Stack

- **Next.js 15** with App Router and static export
- **TypeScript**
- **GitHub Actions** for CI/CD (free for public repos, 2000 min/month for private)
- **GitHub Pages** for hosting (free, includes custom domain + HTTPS)
- Games are plain HTML/CSS/JS served from `public/games/` and embedded via iframe
