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
    unoptimized: false,
    domains: ['s.cn.bing.net'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    quality: 75,
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
    '@babel/runtime'
  ],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*'
      },
    ];
  },
  // redirects: 静态打包不会生效
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: true,
  //     },
  //   ]
  // },

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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ant-design/icons/lib/dist$': '@ant-design/icons/lib/index.es.js',
    };

    // 确保 antd 的样式能够正确加载
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    return config;
  },

  // 禁用一些服务端特性
  experimental: {
    esmExternals: false
  }
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX(nextConfig)
