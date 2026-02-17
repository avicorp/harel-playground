"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.brand}>
        <span style={styles.brandIcon}>🎮</span>
        <span style={styles.brandText}>Harel Playground</span>
      </Link>

      <div style={styles.actions}>
        <Link href="/publish" style={styles.navLink}>
          Publish
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" style={styles.navLink}>
              My Pages
            </Link>
            <button style={styles.authBtn} onClick={() => signOut()}>
              Sign Out
            </button>
          </>
        ) : (
          <button
            style={styles.authBtnPrimary}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Sign In
          </button>
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
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  navLink: {
    color: "var(--text-secondary)",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 8,
  },
  authBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  authBtnPrimary: {
    padding: "8px 18px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
