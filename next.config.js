/** @type {import('next').NextConfig} */
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

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
  // output: 'export',  // 设置输出模式为静态导出

  // 确保图片配置只出现一次
  images: {
    unoptimized: true,  // 静态导出时必须设置为 true
    domains: ['s.cn.bing.net'],
  },

  // 如果有动态路由，需要配置
  trailingSlash: true,  // 为所有页面添加尾部斜杠


  // 禁用一些服务端特性
  experimental: {
    esmExternals: false,
  },

  // 添加静态优化配置
  poweredByHeader: false, // 移除X-Powered-By头

  // 优化webpack配置
  webpack: (config, { isServer, dev }) => {
    // 客户端webpack配置
    if (!isServer) {
      // 优化分块策略
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 30,
        cacheGroups: {
          // 默认cacheGroups
          defaultVendors: false,
          default: false,

          // 首页核心依赖
          homepage: {
            test: /[\\/]node_modules[\\/](react|react-dom|next|axios)[\\/]/,
            name: 'vendors-homepage',
            chunks: (chunk) => {
              return chunk.name === 'pages/index' || chunk.name === 'pages/_app';
            },
            priority: 40,
            enforce: true,
          },

          // antd相关库
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design|rc-[a-z-]+)[\\/]/,
            name: 'vendors-antd',
            priority: 30,
            enforce: true,
          },

          // 编辑器相关库
          editor: {
            test: /[\\/]node_modules[\\/](bytemd|codemirror|juejin-markdown-themes|katex|markdown-it|highlight\.js)[\\/]/,
            name: 'vendors-editor',
            priority: 20,
            chunks: (chunk) => {
              return !chunk.name?.includes('pages/index');
            },
            enforce: true,
          },

          // 图表相关库
          charts: {
            test: /[\\/]node_modules[\\/](echarts|chart\.js|d3|victory)[\\/]/,
            name: 'vendors-charts',
            priority: 15,
            enforce: true,
          },

          // 格式化、日期、工具库
          utils: {
            test: /[\\/]node_modules[\\/](lodash|moment|dayjs|date-fns)[\\/]/,
            name: 'vendors-utils',
            priority: 15,
            enforce: true,
          },

          // 其他第三方库
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors-others',
            priority: 10,
            enforce: true,
            maxSize: 300000, // 限制为300KB
            minChunks: 2, // 至少被引用两次才会被打包到这里
          },
        },
      };

      // 生产环境添加压缩和压缩插件
      if (!dev) {
        // 使用Terser进行更激进的压缩
        config.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // 移除console
                pure_funcs: ['console.log', 'console.info'], // 移除特定函数调用
              },
              mangle: true,
              output: {
                comments: false, // 移除注释
              },
            },
            extractComments: false,
          }),
        ];

        // 添加gzip预压缩
        config.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240, // 仅处理大于10KB的文件
            minRatio: 0.8, // 仅当压缩率高于0.8时才压缩
          })
        );
      }
    }

    return config;
  },
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
