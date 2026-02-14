"use client";

import { type Game } from "@/lib/games";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function GameFrame({ game }: { game: Game }) {
  return (
    <div style={styles.container}>
      <iframe
        src={`${basePath}${game.path}`}
        style={styles.iframe}
        title={game.titleHe}
        allow="autoplay"
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
  },
};
