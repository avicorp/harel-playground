"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { games, type Game } from "@/lib/games";

function matchesQuery(game: Game, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [game.title, game.titleHe, game.description, game.slug].some((field) =>
    field.toLowerCase().includes(q)
  );
}

export default function Navbar({ currentSlug }: { currentSlug?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredGames = useMemo(
    () => games.filter((game) => matchesQuery(game, query)),
    [query]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // On open: reset the search, focus it, and scroll the current game into view
  useEffect(() => {
    if (!menuOpen) return;
    setQuery("");
    const currentIndex = games.findIndex((g) => g.slug === currentSlug);
    setHighlighted(Math.max(currentIndex, 0));
    searchRef.current?.focus();
    listRef.current
      ?.querySelector<HTMLElement>('[data-current="true"]')
      ?.scrollIntoView({ block: "center" });
  }, [menuOpen, currentSlug]);

  // Keep the keyboard-highlighted item visible while scrolling with arrows
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    setHighlighted(0);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filteredGames.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const game = filteredGames[highlighted];
      if (game) {
        closeMenu();
        router.push(`/games/${game.slug}`);
      }
    } else if (e.key === "Escape") {
      closeMenu();
    }
  }

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.brand}>
        <span style={styles.brandIcon}>🎮</span>
        <span style={styles.brandText}>Harel & Yuval Playground</span>
      </Link>

      <div ref={menuRef} style={styles.menuWrapper}>
        <button
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Game menu"
          aria-expanded={menuOpen}
        >
          <span>Games</span>
          <span style={{ fontSize: 12, marginRight: 4 }}>
            {menuOpen ? "▲" : "▼"}
          </span>
        </button>

        {menuOpen && (
          <div style={styles.dropdown}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                ref={searchRef}
                type="search"
                className="game-search-input"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search games... / חיפוש משחק"
                aria-label="Search games"
                style={styles.searchInput}
              />
            </div>
            <div style={styles.resultCount}>
              {filteredGames.length} / {games.length} games
            </div>

            <div ref={listRef} className="game-list" style={styles.list}>
              {filteredGames.length === 0 && (
                <div style={styles.empty}>
                  <div style={{ fontSize: 32 }}>🤷</div>
                  <div>No games found</div>
                  <div style={styles.gameDesc}>לא נמצאו משחקים</div>
                </div>
              )}
              {filteredGames.map((game: Game, index: number) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="game-list-item"
                  data-index={index}
                  data-current={currentSlug === game.slug}
                  style={{
                    ...styles.dropdownItem,
                    ...(index === highlighted ? styles.dropdownItemHighlighted : {}),
                    ...(currentSlug === game.slug
                      ? styles.dropdownItemActive
                      : {}),
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={closeMenu}
                >
                  <span style={styles.gameEmoji}>{game.emoji}</span>
                  <div>
                    <div style={styles.gameTitle}>{game.title}</div>
                    <div style={styles.gameDesc}>{game.titleHe}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "var(--nav-height)",
    padding: "0 20px",
    background: "var(--bg-secondary)",
    borderBottom: "1px solid rgba(233, 69, 96, 0.3)",
    position: "relative",
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "var(--text-primary)",
  },
  brandIcon: {
    fontSize: 28,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  menuWrapper: {
    position: "relative",
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 18px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--bg-card)",
    border: "1px solid rgba(233, 69, 96, 0.3)",
    borderRadius: 12,
    overflow: "hidden",
    width: "min(320px, calc(100vw - 24px))",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 10,
    padding: "0 10px",
    background: "var(--bg-primary)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 14,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: "10px 0",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "inherit",
  },
  resultCount: {
    padding: "0 14px 6px",
    fontSize: 11,
    color: "var(--text-secondary)",
  },
  list: {
    maxHeight: "min(420px, calc(100vh - var(--nav-height) - 120px))",
    overflowY: "auto",
    overscrollBehavior: "contain",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  empty: {
    padding: "24px 16px",
    textAlign: "center",
    color: "var(--text-primary)",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    textDecoration: "none",
    color: "var(--text-primary)",
    transition: "background 0.15s",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  dropdownItemHighlighted: {
    background: "rgba(255, 255, 255, 0.07)",
  },
  dropdownItemActive: {
    background: "rgba(233, 69, 96, 0.2)",
    borderLeft: "3px solid var(--accent)",
  },
  gameEmoji: {
    fontSize: 28,
    flexShrink: 0,
  },
  gameTitle: {
    fontWeight: 600,
    fontSize: 15,
  },
  gameDesc: {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginTop: 2,
  },
};
