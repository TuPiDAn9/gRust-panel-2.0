import type { NextConfig } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || 'https://eshkrk.ru'

const nextConfig: NextConfig = {
        async rewrites() {
        return [
          {
            source: '/script.js',
            destination: `https://analytics.eshkrk.com/script.js`,
          },
          {
            source: '/api/send',
            destination: 'https://analytics.eshkrk.com/api/send'
          },
        ]
    }
};

export default nextConfig;
