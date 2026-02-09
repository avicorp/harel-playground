# Harel Playground

This is Harel's collection of fun games and projects. Everything is built with plain HTML, CSS, and JavaScript -- no fancy setup needed. Just open a file in your browser and play!

## How This Repo Is Organized

Each game or project lives in **its own folder**. Inside each folder there is always an `index.html` file -- that's the file you open to run the game. Some games also have extra files like `style.css` (for how it looks) and `game.js` or `script.js` (for how it works). All of a game's files stay together in the same folder.

At the very top of the repo there is a **main `index.html`** file. This is the homepage -- it shows a nice card for every game with a link to play it.

```
harel-playground/
  index.html          <-- homepage with links to all games
  README.md           <-- description of the repo
  CLAUDE.md           <-- this file (rules for working here)
  space-shooter/      <-- space shooting game
    index.html
    style.css
    game.js
  balloon-popper/     <-- balloon popping game
    index.html
  animated-site/      <-- animated portfolio website
    index.html
    style.css
    script.js
```

## Rules for Working in This Repo

1. **Work directly on `main`** -- no extra branches, no pull requests. Just push straight to `main`.
2. **When you add a new game**, you must do two extra things:
   - Add a link to it in the **root `index.html`** (the homepage) so people can find it.
   - Add a short description of it in **`README.md`**.
3. **Keep each game in its own folder** with its own `index.html`.

## The Games So Far

| Folder | What Is It? |
|---|---|
| `space-shooter/` | A space shooting game -- fly a spaceship and blast enemies! |
| `balloon-popper/` | Pop as many balloons as you can! |
| `animated-site/` | A portfolio website with cool animations. |
