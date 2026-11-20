"use client";

import { type Game } from "@/lib/games";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
// Set at build time; makes the iframe URL unique per deploy so that
// browsers do not keep showing a cached copy of an updated game.
const buildId = process.env.NEXT_PUBLIC_BUILD_ID || "";

export default function GameFrame({ game }: { game: Game }) {
  const src = buildId ? `${basePath}${game.path}?v=${buildId}` : `${basePath}${game.path}`;
  return (
    <div style={styles.container}>
      <iframe
        src={src}
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
