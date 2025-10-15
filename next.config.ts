import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gist.github.com",
        pathname: "/user-attachments/assets/**",
      },
      {
        protocol: "https",
        hostname: "html.tailus.io",
        pathname: "/blocks/customers/**",
      },
    ],
  },
};

export default nextConfig;
