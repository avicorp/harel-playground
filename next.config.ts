import type { NextConfig } from "next";

const basePath = "/harel-playground";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Changes on every deploy so browsers fetch fresh game pages
    NEXT_PUBLIC_BUILD_ID: (process.env.GITHUB_SHA || String(Date.now())).slice(0, 10),
  },
};

export default nextConfig;
