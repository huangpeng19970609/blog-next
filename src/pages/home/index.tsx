/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 16:18:46
 */

import { InferGetStaticPropsType } from "next";
import styles from "./index.module.scss";
import { RightArrowSvg } from "@/components/svg/index";
import Slider from "@/plugin/slider";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { throttle } from "lodash";
import { homePageConfig, SlideItem } from "@/config/home-page";
import { ColorUtils } from "@/utils/css";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getLatestArticle } from "@/request/article/api";

function HomePage(params: InferGetStaticPropsType<typeof getStaticProps>) {
  const [, contextHolder] = message.useMessage();
  const [activeIndex, setActiveIndex] = useState(0);

  const [slides, setSlides] = useState<SlideItem[]>([]);

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
  }, []);

  const handleThemeChange = useCallback((theme: ThemeConfig) => {
    ColorUtils.changeFontColor(theme.fontColor);
    ColorUtils.changeMainColor(theme.bgColor);
    ColorUtils.changePaddingColor(theme.paddingColor);
    ColorUtils.changeTitleColor(theme.titleColor);
    document.documentElement.style.setProperty(
      "--button-color",
      theme.titleColor
    );
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleGoToArticle = () => {
    const id = slides[activeIndex]?.id;
    if (id) {
      router.push(`/article-detail/${id}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.padding}></div>
      <div className={styles.left}>
        <div className={styles.title}>{slides[activeIndex]?.title}</div>
        <div className={styles.content}>{slides[activeIndex]?.description}</div>
        <Button
          hp-mouse-name="点击"
          onClick={handleGoToArticle}
          type="primary"
          icon={<RightOutlined />}
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 24px",
            height: "auto",
            fontSize: "16px",
            borderRadius: "24px",
            borderColor: "var(--button-color)",
            color: "var(--button-color)",
          }}
          ghost
        >
          查看详情
        </Button>
      </div>
      <div className={styles.right}>
        <Slider
          list={slides}
          themes={homePageConfig.themes}
          onThemeChange={handleThemeChange}
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  );
}

export default HomePage;
