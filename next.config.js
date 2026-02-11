/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ADMIN_ENABLED: process.env.ADMIN_ENABLED || "true"
  }
};

module.exports = nextConfig;
