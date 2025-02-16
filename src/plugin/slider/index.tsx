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

  const ImageList = list.map((item, index) => {
    const isActive = activeStep === index;
    const finallyWidth = isActive ? width + 40 : width;

    // 增强3D效果的transform
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

  const buttonClick = (index: number) => {
    setActiveStep(index);
    activeStepRef.current = index;

    if (themes[index] && onThemeChange) {
      onThemeChange(themes[index]);
    }

    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  const ButtonList = list.map((item, index) => {
    return (
      <div key={index} onClick={() => buttonClick(index)}>
        <div
          className={`${styles["button"]} ${
            activeStep === index ? styles.active : ""
          }`}
        ></div>
      </div>
    );
  });

  const onWheel = useCallback(
    debounce((e: WheelEvent) => {
      const deltaY = e.deltaY;

      const val = activeStepRef.current;

      // 向下
      if (deltaY > 0) {
        if (val + 1 <= list.length - 1) {
          setActiveStep(val + 1);
          activeStepRef.current = val + 1;
        }
      }
      // 向上
      else {
        if (val - 1 >= 0) {
          setActiveStep(val - 1);
          activeStepRef.current = val - 1;
        }
      }

      buttonClick(activeStepRef.current);
    }, 100),
    []
  );
  useEffect(() => {
    window.addEventListener("wheel", onWheel);

    return function () {
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

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
