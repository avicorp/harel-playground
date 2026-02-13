import Navbar from "@/components/Navbar";
import GameFrame from "@/components/GameFrame";
import { getLatestGame } from "@/lib/games";

export default function Home() {
  const latestGame = getLatestGame();

  return (
    <>
      <Navbar currentSlug={latestGame.slug} />
      <GameFrame game={latestGame} />
    </>
  );
}
