"use client";

import { type Game } from "@/lib/games";

export default function GameFrame({ game }: { game: Game }) {
  return (
    <div style={styles.container}>
      <iframe
        src={game.path}
        style={styles.iframe}
        title={game.title}
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
