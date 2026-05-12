import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'img-macfit.mncdn.com',
            },
        ],
    },
};

export default nextConfig;
