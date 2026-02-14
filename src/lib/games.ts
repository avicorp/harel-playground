export interface Game {
  slug: string;
  title: string;
  titleHe: string;
  emoji: string;
  description: string;
  descriptionHe: string;
  path: string;
}

export const games: Game[] = [
  {
    slug: "space-shooter",
    title: "Space Shooter",
    titleHe: "יריות בחלל",
    emoji: "🚀",
    description: "Fly a spaceship and blast enemies in space!",
    descriptionHe: "טוסו בחללית והשמידו אויבים בחלל!",
    path: "/games/space-shooter/index.html",
  },
  {
    slug: "balloon-popper",
    title: "Balloon Popper",
    titleHe: "פוצץ בלונים",
    emoji: "🎈",
    description: "Pop as many balloons as you can! Upgrade characters and unlock new abilities.",
    descriptionHe: "פוצצו כמה שיותר בלונים! שדרגו דמויות ופתחו יכולות חדשות.",
    path: "/games/balloon-popper/index.html",
  },
  {
    slug: "fruit-ninja",
    title: "Fruit Ninja",
    titleHe: "חותך פירות",
    emoji: "🍉",
    description: "Swipe to slice flying fruits! Avoid bombs and chain combos for high scores.",
    descriptionHe: "החליקו כדי לחתוך פירות מעופפים! הימנעו מפצצות ושרשרו קומבואים לניקוד גבוה.",
    path: "/games/fruit-ninja/index.html",
  },
  {
    slug: "restaurant",
    title: "Robot Chef",
    titleHe: "שף רובוט",
    emoji: "🤖",
    description: "Pick ingredients, chop them on a cutting board, and serve to a robot judge!",
    descriptionHe: "בחרו מרכיבים, חתכו אותם על קרש חיתוך והגישו לשופט הרובוט!",
    path: "/games/restaurant/index.html",
  },
  {
    slug: "english-learning",
    title: "Learn English",
    titleHe: "לומדים אנגלית",
    emoji: "📚",
    description: "Learn English words with pictures, sounds, and Hebrew translations!",
    descriptionHe: "למדו מילים באנגלית עם תמונות, צלילים ותרגומים לעברית!",
    path: "/games/english-learning/index.html",
  },
];

export function getLatestGame(): Game {
  return games[games.length - 1];
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
