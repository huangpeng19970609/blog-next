/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 23:31:27
 */

import { InferGetStaticPropsType } from "next";
import styles from "./index.module.scss";
import { RightArrowSvg } from "@/components/svg/index";
import Slider from "@/plugin/slider";
import { message } from "antd";

function HomePage(params: InferGetStaticPropsType<typeof getStaticProps>) {
  const [, contextHolder] = message.useMessage();

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.left}>
        <div className={styles.title}>这是测试样式 {params.posts}</div>
        <div className={styles.content}>
          My year long journey around the world to shine a light on creatives
          from 16 different countries.
        </div>
        <div>
          查看详情 <span>{/* 滚动Canvas画布 */}</span>
        </div>
      </div>
      <div className={styles.right}>
        <Slider></Slider>
      </div>
    </div>
  );
}

// 此函数在构建时被调用
export async function getStaticProps() {
  // 调用外部 API 获取博文列表

  return {
    props: {
      posts: "home",
    },
  };
}

export default HomePage;
