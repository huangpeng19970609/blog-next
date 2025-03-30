/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 16:18:46
 */

import { InferGetStaticPropsType } from "next";
import styles from "./index.module.scss";
import { RightArrowSvg } from "@/components/svg/index";
import Slider from "@/plugin/slider";
import { message, Card, List, Image } from "antd";
import { useCallback, useEffect, useState } from "react";
import { throttle } from "lodash";
import { homePageConfig, SlideItem, ThemeConfig } from "@/config/home-page";
import { ColorUtils } from "@/utils/css";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getLatestArticle } from "@/request/article/api";
import { CONFIG } from "@/config";
import dynamic from "next/dynamic";

// 动态导入桌面版和移动版组件，不进行SSR
const DesktopView = dynamic(
  () => import("../../page-components/home/HomeDesktopView"),
  {
    ssr: false,
  }
);
const MobileView = dynamic(
  () => import("../../page-components/home/HomeMobileView"),
  {
    ssr: false,
  }
);

function HomePage(params: InferGetStaticPropsType<typeof getStaticProps>) {
  const [, contextHolder] = message.useMessage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getLatestArticle().then((res) => {
      const lists = res.data.map((item) => ({
        id: item.id + "",
        url: item.cover_url || "/images/default.png",
        title: item.title,
        description: item.content.slice(0, 15),
      }));

      setSlides(lists || []);
    });

    // 标记组件已挂载到客户端
    setIsMounted(true);
  }, []);

  // 仅在客户端挂载后渲染视图组件
  return (
    <div className={styles.container}>
      {isMounted && (
        <>
          <DesktopView
            slides={slides}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <MobileView slides={slides} />
        </>
      )}
      {contextHolder}
    </div>
  );
}

export default HomePage;
