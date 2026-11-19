import type { NextConfig } from "next";
import { execSync } from "node:child_process";

function commit() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: __dirname, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  }
}

const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // `STATIC_EXPORT=1 pnpm build` produces a plain `out/` folder that can be hosted anywhere.
  output: isExport ? "export" : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: isExport, formats: ["image/avif", "image/webp"] },
  env: {
    NEXT_PUBLIC_BUILD_SHA: commit(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
