# Harel & Yuval Playground

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
| `public/games/fruit-ninja/` | Swipe to slice flying fruits! |
| `public/games/restaurant/` | Pick ingredients and serve to a robot judge! |
| `public/games/division-practice/` | Practice division with numbers 1-100! |
| `public/games/ninja-turtle/` | Choose your Ninja Turtle and smash bricks! |
| `public/games/yearly-calendar/` | Yearly calendar with Israeli holidays! |
| `public/games/hebrew-verbs/` | Learn Hebrew verb conjugation! |
| `public/games/hebrew-piano/` | Learn piano notes Guitar Hero style! |
| `public/games/read-it-to-me/` | Practice reading Hebrew words with nikud! Includes a full-text mode (`STORIES` array in `index.html`): nikud stories in big lines of max 4 words with alternating backgrounds, slow-scroll-to-the-end fireworks, and a קָרָאתִי button. A story can also have a `quiz` array (10 questions: 6 multiple-choice, 2 open with keyword scoring, 2 drag-from-word-bank fill-ins of 4 sentences) checked only at the end with a score out of 100 — see אֶרִיק וְהַחוֹמָה הַגְּבוֹהָה and אֶרִיק וּבְעָיַת הַחָלָל. |
| `public/games/division-remainder/` | Practice division with remainders for 6th grade! |
| `public/games/function-explorer/` | Plot functions, drag m and b, compose g(f(x)) and see the inverse! |
| `public/games/english-learning-v3/` | Learn English 3.0 — test prep for 6.11 (24 words of exercise 23, 20 mixed questions out of a 50-question bank) plus units 1+2 word list in 10 categories with 4 games (listen, word→picture, picture→word, English→Hebrew) and a mixed mode! |

## Story World: Miller 21 (for `read-it-to-me` stories)

Stories set in the building at Tova & Tuvia Miller St. 21 (7 floors) use this cast. The only human mentioned is Yuval. Don't rewrite existing stories to match; apply this to new ones. The same cast is in a comment above `STORIES` in `index.html`.

| Floor | Character |
|---|---|
| 6 | **ג'ינג'ר**: Persian cat, blond (not ginger despite the name), grumpy face but not really, sleeps all day, secret adventurer, "it was on purpose". Lives with Yuval. |
| 6 (next door) | **אריק**: black mischievous kitten with a red ball. **אוליביה**: gray adult cat, dislikes petting/smiles/nonsense, calm. |
| 5 (under Ginger) | **The three-legged dog** (small, fast, loves missions) and **the quiet cat** who lives with him. |
| 5 (under Erik) | **The two fat cats**: cowardly, hide behind the sofa. |
| 5 (opposite the fat cats) | **The giant dog**: big as a sofa, serious, gentle, deep voice. |
| 3 | **צ'יינה**: black-and-white medium-size dog, quiet, adult, motherly, kind to everyone. |

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` triggers GitHub Actions to build and deploy to GitHub Pages. See `SETUP.md` for custom domain setup.
