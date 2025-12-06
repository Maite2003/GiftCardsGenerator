import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    FONTCONFIG_PATH: '/tmp',
  },
};

export default nextConfig;
