/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-29 00:01:02
 * @Description: 博客文章的详情页面
 */
// pages/posts/[id].js
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";

function Post({ post }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
}

export default Post;
