/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 18:17:01
 * @Description: 博客文章的详情页面
 */
// pages/posts/[id].js
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

export default Post;
