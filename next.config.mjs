/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  // Enable experimental features for better DX
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
