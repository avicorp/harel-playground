# Harel Playground

A game portal built with Next.js. The main page shows the latest game, and a nav bar menu lets you switch between all available games.

## Games

| Game | Description |
|------|-------------|
| **Space Shooter** 🚀 | Fly a spaceship and blast enemies in space |
| **Balloon Popper** 🎈 | Pop balloons, upgrade characters, unlock abilities |

## Getting Started

```bash
npm install
npm run dev
```

See [SETUP.md](./SETUP.md) for deployment and custom domain instructions.

## How It Works

- Next.js serves the portal with a nav bar and game menu
- Each game is plain HTML/CSS/JS in `public/games/` embedded via iframe
- The latest game in `src/lib/games.ts` is shown on the homepage
- CI/CD via GitHub Actions deploys to GitHub Pages on push to `main`
