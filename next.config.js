// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended to keep or add if not present
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Your existing pattern
        port: "",
        // pathname: '/**', // Optional: if you want to be more specific for Sanity paths
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Added for Google user profile images
        port: '',
        pathname: '/a/**', // Common path prefix for Google avatars
      },
      // Add other domains here if needed in the future
    ],
  },
  // ... any other existing Next.js configurations you might have
};

module.exports = nextConfig;