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
  {
    slug: "restaurant",
    title: "Robot Chef",
    titleHe: "שף רובוט",
    emoji: "🤖",
    description: "Pick ingredients, chop them on a cutting board, and serve to a robot judge!",
    path: "/games/restaurant/index.html",
  },
  {
    slug: "english-learning",
    title: "Learn English",
    titleHe: "לומדים אנגלית",
    emoji: "📚",
    description: "Learn English words with pictures, sounds, and Hebrew translations!",
    path: "/games/english-learning/index.html",
  },
  {
    slug: "division-practice",
    title: "Division Practice",
    titleHe: "תרגול חילוק",
    emoji: "➗",
    description: "Practice division with numbers from 1 to 100! Choose easy, medium, or hard difficulty.",
    path: "/games/division-practice/index.html",
  },
  {
    slug: "ninja-turtle",
    title: "Ninja Turtles",
    titleHe: "צבי הנינג'ה",
    emoji: "🐢",
    description: "Choose your Ninja Turtle and smash bricks in the old neighborhood! Cowabunga!",
    path: "/games/ninja-turtle/index.html",
  },
  {
    slug: "yearly-calendar",
    title: "Yearly Calendar",
    titleHe: "לוח שנה",
    emoji: "📅",
    description: "A beautiful yearly calendar with Israeli holidays and special dates!",
    path: "/games/yearly-calendar/index.html",
  },
];

export function getLatestGame(): Game {
  return games[games.length - 1];
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
