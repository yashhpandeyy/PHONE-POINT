
import type { NextConfig } from 'next';

const unquote = (str?: string) => str?.replace(/(^"|"$)/g, '');
const r2PublicUrl = unquote(process.env.R2_PUBLIC_URL);
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // Cloudflare R2 Public Domain
      {
        protocol: 'https',
        hostname: 'pub-642b64eb0f14404c91d93ae3ac99c05d.r2.dev',
        pathname: '/**',
      },
      // Dynamically add hostname from .env if present
      ...(r2PublicUrl ? [{
        protocol: 'https' as const,
        hostname: r2PublicUrl.replace(/^https?:\/\//, '').split('/')[0],
        pathname: '/**',
      }] : []),
      // Appwrite Storage
      {
        protocol: 'https',
        hostname: 'nyc.cloud.appwrite.io',
        pathname: '/**',
      },
      // Cloudflare R2 Endpoint wildcard fix
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      // Exact hostname from error
      {
        protocol: 'https',
        hostname: '167fa204f37576a8b5d3e3288f66fd11.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
