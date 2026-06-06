import createMDX from "@next/mdx";
import "@Saints/env/web";
import type { NextConfig } from "next";

// Turbopack-compatible: pass plugin options as strings (require paths)
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  typedRoutes: true,
  reactCompiler: true,
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 85],
  },
};

export default withMDX(nextConfig);