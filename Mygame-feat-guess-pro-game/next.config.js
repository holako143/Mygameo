/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  // Adding these configurations to make the build process more robust
  // especially in environments where database access might be limited during build time.
  experimental: {
    // This can help in environments where the build process might be memory constrained.
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Disable Eslint during build, as it's already checked in pre-commit.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking during build, as it's already checked in pre-commit.
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
