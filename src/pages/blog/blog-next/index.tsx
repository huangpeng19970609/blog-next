/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 10:49:24
 */
/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-27 20:17:01
 */
function About(params: { posts: string }) {
  return <div>{params.posts}</div>;
}

// 此函数在构建时被调用
export async function getStaticProps() {
  // 调用外部 API 获取博文列表

  return {
    props: {
      posts: "blog-next",
    },
  };
}

export default About;
