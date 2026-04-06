/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['blockpay.live', 'firebasestorage.googleapis.com'],
  },
  // Suppress firebase-admin warnings in edge/client bundles
  serverExternalPackages: ['firebase-admin'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
