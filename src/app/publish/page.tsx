"use client";

import { useState } from "react";
import Link from "next/link";
import { games, type Game } from "@/lib/games";

export default function PublishPage() {
  const [selectedGame, setSelectedGame] = useState("");
  const [pageName, setPageName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    uuid: string;
    pageName: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${basePath}/api/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSlug: selectedGame,
          pageName,
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to publish page");
        return;
      }

      const page = await res.json();
      setResult({ uuid: page.uuid, pageName: page.pageName });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Publish a Page</h1>
        <p style={styles.subtitle}>
          Select a game, name your page, and enter your email to get a unique
          link.
        </p>

        {result ? (
          <div style={styles.resultBox}>
            <p style={styles.successText}>Page published!</p>
            <p style={styles.pageName}>{result.pageName}</p>
            <div style={styles.linkBox}>
              <code style={styles.linkCode}>
                {typeof window !== "undefined"
                  ? `${window.location.origin}${basePath}/p/${result.uuid}`
                  : `/p/${result.uuid}`}
              </code>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.btnPrimary}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}${basePath}/p/${result.uuid}`
                  );
                }}
              >
                Copy Link
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => {
                  setResult(null);
                  setSelectedGame("");
                  setPageName("");
                }}
              >
                Publish Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} style={styles.form}>
            <label style={styles.label}>
              Game
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Select a game...</option>
                {games.map((game: Game) => (
                  <option key={game.slug} value={game.slug}>
                    {game.emoji} {game.title}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Page Name
              <input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="My Awesome Game Page"
                style={styles.input}
                required
              />
            </label>

            <label style={styles.label}>
              Your Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
                required
              />
            </label>

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              type="submit"
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Page"}
            </button>
          </form>
        )}

        <Link href="/" style={styles.backLink}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: 20,
    background: "var(--bg-primary)",
  },
  card: {
    background: "var(--bg-card)",
    borderRadius: 16,
    padding: 40,
    maxWidth: 480,
    width: "100%",
    border: "1px solid rgba(233, 69, 96, 0.2)",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text-secondary)",
    marginBottom: 28,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  },
  select: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  },
  btnPrimary: {
    padding: "12px 20px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSecondary: {
    padding: "12px 20px",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
  },
  resultBox: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
    textAlign: "center",
  },
  successText: {
    color: "#4caf50",
    fontSize: 18,
    fontWeight: 600,
  },
  pageName: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  linkBox: {
    background: "var(--bg-secondary)",
    padding: "12px 16px",
    borderRadius: 8,
    width: "100%",
    overflowX: "auto",
  },
  linkCode: {
    color: "var(--accent)",
    fontSize: 13,
    wordBreak: "break-all",
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  backLink: {
    display: "block",
    textAlign: "center",
    marginTop: 24,
    color: "var(--text-secondary)",
    fontSize: 14,
  },
};
