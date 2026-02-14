"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { games, type Game } from "@/lib/games";

export default function Navbar({ currentSlug }: { currentSlug?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.brand}>
        <span style={styles.brandIcon}>🎮</span>
        <span style={styles.brandText}>מגרש המשחקים של הראל</span>
      </Link>

      <div ref={menuRef} style={styles.menuWrapper}>
        <button
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט משחקים"
        >
          <span>משחקים</span>
          <span style={{ fontSize: 12, marginInlineEnd: 4 }}>
            {menuOpen ? "▲" : "▼"}
          </span>
        </button>

        {menuOpen && (
          <div style={styles.dropdown}>
            {games.map((game: Game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                style={{
                  ...styles.dropdownItem,
                  ...(currentSlug === game.slug
                    ? styles.dropdownItemActive
                    : {}),
                }}
                onClick={() => setMenuOpen(false)}
              >
                <span style={styles.gameEmoji}>{game.emoji}</span>
                <div>
                  <div style={styles.gameTitle}>{game.titleHe}</div>
                  <div style={styles.gameDesc}>{game.descriptionHe}</div>
                </div>
              </Link>
            ))}
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
    insetInlineEnd: 0,
    background: "var(--bg-card)",
    border: "1px solid rgba(233, 69, 96, 0.3)",
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 260,
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
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
  dropdownItemActive: {
    background: "rgba(233, 69, 96, 0.2)",
    borderInlineStart: "3px solid var(--accent)",
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
