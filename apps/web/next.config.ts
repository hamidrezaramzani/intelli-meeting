import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@intelli-meeting/shared-ui",
    "@intelli-meeting/design-system",
  ],
};

export default nextConfig;
