/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-30 23:20:14
 */

import { InferGetStaticPropsType } from "next";
import styles from "./index.module.scss";
import { RightArrowSvg } from "@/components/svg/index";
import Slider from "@/plugin/slider";
import { message } from "antd";
import { useCallback, useEffect } from "react";
import { throttle } from "lodash";

function HomePage(params: InferGetStaticPropsType<typeof getStaticProps>) {
  const [, contextHolder] = message.useMessage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.padding}></div>
      <div className={styles.left}>
        <div className={styles.title}>这是测试样式 {params.posts}</div>
        <div className={styles.content}>
          My year long journey around the world to shine a light on creatives
          from 16 different countries.
        </div>
        <div className="font-color">
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
