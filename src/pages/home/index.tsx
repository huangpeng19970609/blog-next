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
import { homePageConfig } from "@/config/home-page";
import { ColorUtils } from "@/utils/css";
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

function HomePage(params: InferGetStaticPropsType<typeof getStaticProps>) {
  const [, contextHolder] = message.useMessage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const handleThemeChange = useCallback((theme: ThemeConfig) => {
    ColorUtils.changeFontColor(theme.fontColor);
    ColorUtils.changeMainColor(theme.bgColor);
    ColorUtils.changePaddingColor(theme.paddingColor);
    ColorUtils.changeTitleColor(theme.titleColor);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    debugger;
    setActiveIndex(index);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.padding}></div>
      <div className={styles.left}>
        <div className={styles.title}>
          {homePageConfig.slides[activeIndex].title}
        </div>
        <div className={styles.content}>
          {homePageConfig.slides[activeIndex].description}
        </div>
        <Button 
          type="primary" 
          icon={<RightOutlined />}
          size="large"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 24px',
            height: 'auto',
            fontSize: '16px',
            borderRadius: '24px',
          }}
          ghost  // 添加 ghost 属性使按钮透明
        >
          查看详情
        </Button>
      </div>
      <div className={styles.right}>
        <Slider 
          list={homePageConfig.slides} 
          themes={homePageConfig.themes}
          onThemeChange={handleThemeChange}
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  );
}

export default HomePage;
