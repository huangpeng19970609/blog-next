/** @type {import('next').NextConfig} */


const nextConfig = {

  images: {
    domains: ['s.cn.bing.net'],
  },
  // Next.js 可以自动转译和捆绑来自本地包（如 monorepos）或外部依赖项
  // PS: 这是antd所使用到所有依赖
  transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table"],
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
})

module.exports = withMDX(nextConfig)
