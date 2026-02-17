"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PublishedPage {
  uuid: string;
  gameSlug: string;
  pageName: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [pages, setPages] = useState<PublishedPage[]>([]);
  const [loading, setLoading] = useState(true);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    if (session?.user?.email) {
      fetchPages();
    } else {
      setLoading(false);
    }
  }, [session]);

  async function fetchPages() {
    try {
      const res = await fetch(`${basePath}/api/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(uuid: string) {
    if (!confirm("Are you sure you want to delete this page?")) return;

    const res = await fetch(`${basePath}/api/pages`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid }),
    });

    if (res.ok) {
      setPages((prev) => prev.filter((p) => p.uuid !== uuid));
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.heading}>My Pages</h1>
          <p style={styles.subtitle}>
            Sign in with Google to see all pages connected to your account.
          </p>
          <button style={styles.googleBtn} onClick={() => signIn("google")}>
            Sign in with Google
          </button>
          <Link href="/" style={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>My Pages</h1>
            <p style={styles.subtitle}>{session.user?.email}</p>
          </div>
          <button style={styles.signOutBtn} onClick={() => signOut()}>
            Sign Out
          </button>
        </div>

        {pages.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              You haven&apos;t published any pages yet.
            </p>
            <Link href="/publish" style={styles.publishLink}>
              Publish Your First Page
            </Link>
          </div>
        ) : (
          <div style={styles.pageList}>
            {pages.map((page) => (
              <div key={page.uuid} style={styles.pageItem}>
                <div style={styles.pageInfo}>
                  <div style={styles.pageTitle}>{page.pageName}</div>
                  <div style={styles.pageGame}>{page.gameSlug}</div>
                  <div style={styles.pageDate}>
                    {new Date(page.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.pageActions}>
                  <a
                    href={`${basePath}/p/${page.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.openBtn}
                  >
                    Open
                  </a>
                  <button
                    style={styles.copyBtn}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}${basePath}/p/${page.uuid}`
                      )
                    }
                  >
                    Copy Link
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(page.uuid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <Link href="/publish" style={styles.publishLink}>
            Publish New Page
          </Link>
          <Link href="/" style={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    padding: 40,
    background: "var(--bg-primary)",
  },
  card: {
    background: "var(--bg-card)",
    borderRadius: 16,
    padding: 40,
    maxWidth: 640,
    width: "100%",
    border: "1px solid rgba(233, 69, 96, 0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  loadingText: {
    color: "var(--text-secondary)",
    textAlign: "center",
    padding: 40,
  },
  googleBtn: {
    display: "block",
    width: "100%",
    padding: "14px 20px",
    background: "#4285f4",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 20,
  },
  signOutBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: 16,
    marginBottom: 16,
  },
  pageList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  pageItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "var(--bg-secondary)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  pageInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 4,
  },
  pageGame: {
    fontSize: 12,
    color: "var(--accent)",
    marginBottom: 2,
  },
  pageDate: {
    fontSize: 12,
    color: "var(--text-secondary)",
  },
  pageActions: {
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },
  openBtn: {
    padding: "8px 14px",
    background: "var(--accent)",
    color: "white",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
  },
  copyBtn: {
    padding: "8px 14px",
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  deleteBtn: {
    padding: "8px 14px",
    background: "transparent",
    color: "#ff4444",
    border: "1px solid rgba(255,68,68,0.3)",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  publishLink: {
    color: "var(--accent)",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
  },
  backLink: {
    color: "var(--text-secondary)",
    fontSize: 14,
    textDecoration: "none",
  },
};
