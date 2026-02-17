"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Sign In</h1>
        <p style={styles.subtitle}>
          Sign in with your Google account to manage your published pages.
        </p>
        <button style={styles.googleBtn} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Sign in with Google
        </button>
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
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
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
    lineHeight: 1.5,
    marginBottom: 28,
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
  },
  backLink: {
    display: "block",
    marginTop: 24,
    color: "var(--text-secondary)",
    fontSize: 14,
  },
};
