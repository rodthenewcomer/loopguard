import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@loopguard/types'],
  async redirects() {
    return [
      {
        source: '/install.sh',
        destination:
          'https://raw.githubusercontent.com/rodthenewcomer/loopguard/main/packages/context-engine/install.sh',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
