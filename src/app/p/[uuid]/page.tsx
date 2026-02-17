import { notFound } from "next/navigation";
import GameFrame from "@/components/GameFrame";
import { getPageByUuid } from "@/lib/pages-db";
import { getGameBySlug } from "@/lib/games";

export default async function UuidPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const page = getPageByUuid(uuid);

  if (!page) {
    notFound();
  }

  const game = getGameBySlug(page.gameSlug);

  if (!game) {
    notFound();
  }

  return (
    <>
      <nav style={styles.nav}>
        <span style={styles.title}>
          {game.emoji} {page.pageName}
        </span>
      </nav>
      <GameFrame game={game} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "var(--nav-height)",
    padding: "0 20px",
    background: "var(--bg-secondary)",
    borderBottom: "1px solid rgba(233, 69, 96, 0.3)",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text-primary)",
  },
};
