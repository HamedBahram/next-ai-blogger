/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rawygl3cdocgv3sb.public.blob.vercel-storage.com'
      }
    ]
  }
}

module.exports = nextConfig
