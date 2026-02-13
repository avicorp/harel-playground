import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harel Playground",
  description: "A collection of fun games by Harel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
