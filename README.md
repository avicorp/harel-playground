# Harel & Yuval Playground

A game portal built with Next.js for my children Harel and Yuval. The main page shows the latest game, and a nav bar menu lets you switch between all available games.
The games are created with Claude Code.

## Games

| Game | Description |
|------|-------------|
| **Space Shooter** 🚀 | Fly a spaceship and blast enemies in space |
| **Balloon Popper** 🎈 | Pop balloons, upgrade characters, unlock abilities |
| **Fruit Ninja** 🍉 | Swipe to slice flying fruits! Avoid bombs and chain combos |
| **Robot Chef** 🤖 | Pick ingredients, chop them, and serve to a robot judge |
| **Learn English** 📚 | Learn English words with pictures, sounds, and Hebrew translations |
| **Division Practice** ➗ | Practice division with numbers from 1 to 100 |
| **Ninja Turtles** 🐢 | Choose your Ninja Turtle and smash bricks! Cowabunga! |
| **Yearly Calendar** 📅 | A yearly calendar with Israeli holidays and special dates |
| **Hebrew Verbs** 📝 | Learn verb conjugation in Hebrew |
| **Magic Piano** 🎹 | Learn piano notes Guitar Hero style in Hebrew |

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
