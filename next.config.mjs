/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/leaderboard/:path*',
        destination: 'https://api.openformat.tech/v1/leaderboard/:path*',
      },
    ];
  },
};

export default nextConfig;
