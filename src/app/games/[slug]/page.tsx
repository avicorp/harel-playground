import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import GameFrame from "@/components/GameFrame";
import { games, getGameBySlug } from "@/lib/games";

export function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <>
      <Navbar currentSlug={game.slug} />
      <GameFrame game={game} />
    </>
  );
}
