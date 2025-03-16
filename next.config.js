/** @type {import('next').NextConfig} */

const nextConfig = {
  publicRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    BASE_URL: '/',
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: '/'
  },

  images: {
    unoptimized: true,  // 静态导出时必须设置为 true
    domains: ['s.cn.bing.net'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    quality: 75,
    remotePatterns: [],  // Next.js 15 推荐使用 remotePatterns
  },
  // Next.js 可以自动转译和捆绑来自本地包（如 monorepos）或外部依赖项
  // PS: 这是antd所使用到所有依赖
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    '@ant-design/cssinjs',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    'rc-input',  // 添加 rc-input
    'rc-field-form',  // 添加相关依赖
    'rc-cascader',
    'rc-select',
    'rc-checkbox',
    'rc-menu',
    '@babel/runtime',
    'qiankun',
    'framer-motion',
  ],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*'
      },
    ];
  },

  // 添加 ESLint 配置
  eslint: {
    // 在生产环境构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },

  // 添加 TypeScript 配置
  typescript: {
    // 在生产环境构建时忽略类型检查错误
    ignoreBuildErrors: true,
  },

  // 修改输出配置
  output: 'export',  // 设置输出模式为静态导出

  // 确保图片配置只出现一次
  images: {
    unoptimized: true,  // 静态导出时必须设置为 true
    domains: ['s.cn.bing.net'],
  },

  // 如果有动态路由，需要配置
  trailingSlash: true,  // 为所有页面添加尾部斜杠

  // 添加 webpack 配置
  webpack: (config, { isServer }) => {
    // MJS 文件处理
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    // 处理 ES 模块
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [
        /node_modules\/antd/,
        /node_modules\/@ant-design/,
        /node_modules\/rc-/,
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: ['@babel/plugin-transform-modules-commonjs']
        }
      }
    });

    // 整体替换 regenerator 模块
    config.resolve.alias = {
      ...config.resolve.alias,
      '@babel/runtime/regenerator': require.resolve('@babel/runtime/regenerator/index.js'),
      '@ant-design/icons/lib/dist$': '@ant-design/icons/lib/index.es.js',
      'regenerator-runtime': require.resolve('regenerator-runtime'),
    };

    return config;
  },

  // 禁用一些服务端特性
  experimental: {
    esmExternals: false,
  }
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
})

module.exports = withMDX(nextConfig)
