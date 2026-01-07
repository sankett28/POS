/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Legacy billing endpoint (keeps /api prefix)
      {
        source: '/api/billing',
        destination: 'http://localhost:8000/api/billing',
      },
      // All other API routes (strip /api prefix)
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // Python backend
      },
    ]
  },
}

module.exports = nextConfig

