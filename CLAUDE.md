# Harel Playground

A game portal built with Next.js. The homepage shows the latest game fullscreen with a nav bar for switching between games.

## Repo Structure

```
harel-playground/
  package.json             <-- Node project config
  next.config.ts           <-- Next.js config (static export)
  tsconfig.json            <-- TypeScript config
  src/
    app/
      layout.tsx           <-- root layout
      page.tsx             <-- homepage (shows latest game)
      globals.css          <-- global styles
      games/[slug]/
        page.tsx           <-- dynamic game page
    components/
      Navbar.tsx           <-- nav bar with game menu
      GameFrame.tsx        <-- iframe wrapper for games
    lib/
      games.ts             <-- game registry (add new games here)
  public/
    games/
      space-shooter/       <-- space shooting game (HTML/CSS/JS)
      balloon-popper/      <-- balloon popping game (HTML/CSS/JS)
  .github/
    workflows/
      deploy.yml           <-- CI/CD: build + deploy to GitHub Pages
  SETUP.md                 <-- deployment & custom domain instructions
  README.md
  CLAUDE.md                <-- this file
```

## Rules for Working in This Repo

1. **When adding a new game:**
   - Put game files in `public/games/<game-name>/` with an `index.html`
   - Add an entry to the `games` array in `src/lib/games.ts`
   - The last entry in the array is the "latest" game shown on the homepage
2. **Keep games as plain HTML/CSS/JS** — they run in iframes, no build step needed for game code.
3. **Don't modify game HTML files** to add framework dependencies — games must work standalone.

## Games

| Folder | What Is It? |
|---|---|
| `public/games/space-shooter/` | Fly a spaceship and blast enemies! |
| `public/games/balloon-popper/` | Pop as many balloons as you can! |

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` triggers GitHub Actions to build and deploy to GitHub Pages. See `SETUP.md` for custom domain setup.
