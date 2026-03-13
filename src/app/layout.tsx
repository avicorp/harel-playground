import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harel & Yuval Playground",
  description: "A collection of fun games for Harel and Yuval",
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
