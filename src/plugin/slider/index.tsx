/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-30 23:46:29
 * @Description: 这是一个注释
 */

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

import Image from "next/image";
import { ColorUtils } from "@/utils/css";
import { debounce, throttle } from "lodash";

interface SliderProps {
  list: SlideItem[];
  themes: ThemeConfig[];
  onThemeChange?: (theme: ThemeConfig) => void;
  onSlideChange?: (index: number) => void;
}

function Slider({ list, themes, onThemeChange, onSlideChange }: SliderProps) {
  const width = 900;
  const height = 500;
  const [activeStep, setActiveStep] = useState<number>(0);
  const activeStepRef = useRef<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastInteractionTime = useRef<number>(0);

  const handleSlideChange = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;
      if (newIndex < 0 || newIndex >= list.length) return;

      setIsTransitioning(true);
      setActiveStep(newIndex);
      activeStepRef.current = newIndex;

      if (themes[newIndex] && onThemeChange) {
        onThemeChange(themes[newIndex]);
      }

      if (onSlideChange) {
        onSlideChange(newIndex);
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, list.length, onThemeChange, onSlideChange, themes]
  );

  // 处理滚轮事件，节流时间调整为 300ms
  const handleWheel = useCallback(
    throttle((e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastInteractionTime.current < 500) return;
      lastInteractionTime.current = now;

      const currentIndex = activeStepRef.current;
      if (e.deltaY > 0 && currentIndex < list.length - 1) {
        handleSlideChange(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        handleSlideChange(currentIndex - 1);
      }
    }, 300),
    [handleSlideChange, list.length]
  );

  // 按钮点击处理
  const buttonClick = (index: number) => {
    handleSlideChange(index);
  };

  useEffect(() => {
    const element = document.querySelector(`.${styles.container}`);
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  const ImageList = list.map((item, index) => {
    const isActive = activeStep === index;
    const finallyWidth = isActive ? width + 40 : width;

    const transform = isActive
      ? "translate3d(0, 0, 100px) rotateX(0deg) scale(1.08)"
      : index > activeStep
      ? `translate3d(0, ${
          (index - activeStep) * (height + 20)
        }px, -100px) rotateX(10deg) scale(0.95)`
      : `translate3d(0, ${
          (index - activeStep) * (height + 20)
        }px, -100px) rotateX(-10deg) scale(0.95)`;

    return (
      <div
        className={`${styles["image-list-item-container"]} ${
          isActive ? styles.active : ""
        }`}
        key={index}
      >
        <div
          className={`${styles["image-list-item"]} ${
            isActive ? styles.active : ""
          }`}
          style={{
            transform,
            zIndex: list.length - Math.abs(activeStep - index),
          }}
        >
          <Image
            hp-mouse-name="scroll"
            width={finallyWidth}
            height={height}
            alt={item.title || "Slider image"}
            src={item.url}
            style={{
              objectFit: "cover",
              borderRadius: "12px",
            }}
            priority={index === 0}
          />
          <div style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    );
  });

  const ButtonList = list.map((item, index) => (
    <div key={index} onClick={() => buttonClick(index)}>
      <div
        className={`${styles["button"]} ${
          activeStep === index ? styles.active : ""
        }`}
      ></div>
    </div>
  ));

  return (
    <div className={styles.container}>
      <div className={styles["button-list"]}>
        <div className={styles["list-container"]}>{ButtonList}</div>
      </div>
      <div className={styles["imge-list-container"]}>{ImageList}</div>
    </div>
  );
}

export default Slider;
