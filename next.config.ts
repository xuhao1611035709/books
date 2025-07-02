import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // 启用 standalone 输出用于 Docker
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    // 启用服务器组件的外部目录支持
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 重定向配置
  async redirects() {
    return [
      // 根据环境重定向
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'auth-token',
          },
        ],
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },

  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加 fallback 用于 Node.js 模块
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // TypeScript 配置
  typescript: {
    // 在生产构建期间忽略 TypeScript 错误
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    // 在生产构建期间忽略 ESLint 错误
    ignoreDuringBuilds: false,
  },

  // 压缩配置
  compress: true,

  // 性能配置
  poweredByHeader: false,
  
  // 静态优化
  trailingSlash: false,
  
  // 页面扩展名
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default withNextIntl(nextConfig);
