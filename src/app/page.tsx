import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Harel Playground</h1>
          <p style={styles.description}>
            A game portal where each page gets a unique, private link. Publish
            games with your email and manage them through Google Sign-In.
          </p>
          <div style={styles.buttons}>
            <Link href="/publish" style={styles.btnPrimary}>
              Publish a Page
            </Link>
            <Link href="/dashboard" style={styles.btnSecondary}>
              My Pages
            </Link>
          </div>
        </div>

        <div style={styles.howItWorks}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.steps}>
            <div style={styles.step}>
              <span style={styles.stepNumber}>1</span>
              <h3 style={styles.stepTitle}>Publish</h3>
              <p style={styles.stepDesc}>
                Pick a game, name your page, and enter your email. You get a
                unique UUID link.
              </p>
            </div>
            <div style={styles.step}>
              <span style={styles.stepNumber}>2</span>
              <h3 style={styles.stepTitle}>Share</h3>
              <p style={styles.stepDesc}>
                Share the private link with anyone. Only people with the link can
                access the page.
              </p>
            </div>
            <div style={styles.step}>
              <span style={styles.stepNumber}>3</span>
              <h3 style={styles.stepTitle}>Manage</h3>
              <p style={styles.stepDesc}>
                Sign in with Google to see all pages tied to your email. Copy
                links or delete pages.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    flex: 1,
    overflowY: "auto",
    background: "var(--bg-primary)",
  },
  hero: {
    textAlign: "center",
    padding: "80px 20px 60px",
    maxWidth: 600,
    margin: "0 auto",
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: 16,
    letterSpacing: "-1px",
  },
  description: {
    fontSize: 18,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    marginBottom: 36,
  },
  buttons: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 32px",
    background: "var(--accent)",
    color: "white",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
  },
  btnSecondary: {
    padding: "14px 32px",
    background: "var(--bg-card)",
    color: "var(--text-primary)",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  howItWorks: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "40px 20px 80px",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "var(--text-primary)",
    textAlign: "center",
    marginBottom: 40,
  },
  steps: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  step: {
    background: "var(--bg-card)",
    borderRadius: 14,
    padding: "28px 24px",
    flex: "1 1 200px",
    maxWidth: 240,
    textAlign: "center",
    border: "1px solid rgba(233, 69, 96, 0.15)",
  },
  stepNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    background: "var(--accent)",
    color: "white",
    borderRadius: "50%",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 14,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
};
