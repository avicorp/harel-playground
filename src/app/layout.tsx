import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מגרש המשחקים של הראל",
  description: "אוסף משחקים כיפיים מאת הראל",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
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
