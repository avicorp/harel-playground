export interface Game {
  slug: string;
  title: string;
  titleHe: string;
  emoji: string;
  description: string;
  path: string;
}

export const games: Game[] = [
  {
    slug: "space-shooter",
    title: "Space Shooter",
    titleHe: "יריות בחלל",
    emoji: "🚀",
    description: "Fly a spaceship and blast enemies in space!",
    path: "/games/space-shooter/index.html",
  },
  {
    slug: "balloon-popper",
    title: "Balloon Popper",
    titleHe: "פוצץ בלונים",
    emoji: "🎈",
    description: "Pop as many balloons as you can! Upgrade characters and unlock new abilities.",
    path: "/games/balloon-popper/index.html",
  },
  {
    slug: "fruit-ninja",
    title: "Fruit Ninja",
    titleHe: "חותך פירות",
    emoji: "🍉",
    description: "Swipe to slice flying fruits! Avoid bombs and chain combos for high scores.",
    path: "/games/fruit-ninja/index.html",
  },
];

export function getLatestGame(): Game {
  return games[games.length - 1];
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
