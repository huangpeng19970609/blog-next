import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { RightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Slider from "@/plugin/slider";
import { homePageConfig, SlideItem, ThemeConfig } from "@/config/home-page";
import { ColorUtils } from "@/utils/css";
import styles from "@/pages/home/index.module.scss";
import { CONFIG } from "@/config";
import { getUseCustomTheme } from "@/utils/cookie";
import { Tooltip } from "antd";

interface DesktopViewProps {
  slides: SlideItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

function DesktopView({
  slides,
  activeIndex,
  setActiveIndex,
}: DesktopViewProps) {
  const router = useRouter();
  const [useCustomTheme, setUseCustomTheme] = useState<boolean>(false);

  // 如果是移动设备，不渲染桌面视图
  if (CONFIG.isMobile()) {
    return null;
  }

  // 检查自定义主题状态
  useEffect(() => {
    setUseCustomTheme(getUseCustomTheme());
  }, []);

  // 添加 useEffect 管理 body overflow 样式
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // 清理函数，组件卸载时执行
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleThemeChange = useCallback(
    (theme: ThemeConfig) => {
      // 如果启用了自定义主题，则不应用滑动主题变化
      if (!useCustomTheme) {
        ColorUtils.changeFontColor(theme.fontColor);
        ColorUtils.changeMainColor(theme.bgColor);
        ColorUtils.changePaddingColor(theme.paddingColor);
        ColorUtils.changeTitleColor(theme.titleColor);
        document.documentElement.style.setProperty(
          "--button-color",
          theme.titleColor
        );
      }
    },
    [useCustomTheme]
  );

  const handleSlideChange = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handleGoToArticle = () => {
    const id = slides[activeIndex]?.id;
    if (id) {
      router.push(`/article-detail/${id}`);
    }
  };

  return (
    <div className={styles.pcContainer}>
      {useCustomTheme && (
        <div className={styles.themeNotice}>
          <Tooltip title="您已启用自定义主题，滑动页面将不会改变颜色主题">
            <InfoCircleOutlined /> 自定义主题已启用
          </Tooltip>
        </div>
      )}
      <div className={styles.padding}></div>
      <div className={styles.left}>
        <div
          hp-mouse-name="点击"
          className={`${styles.title} global-hover-color`}
          onClick={handleGoToArticle}
        >
          {slides[activeIndex]?.title}
        </div>
        <div
          className={`${styles.content} global-hover-color`}
          hp-mouse-name="点击"
          onClick={handleGoToArticle}
        >
          {slides[activeIndex]?.description}
        </div>
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

export default DesktopView;
