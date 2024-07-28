/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 18:29:22
 * @Description: 这是一个注释
 */

import { useState } from "react";
import styles from "./index.module.scss";

import Image from "next/image";

function Slider() {
  const width = 400;

  const height = 400;

  const List = [
    {
      url: "https://s.cn.bing.net/th?id=OHR.BeachHutsSweden_ZH-CN4193150313_1920x1080.webp&qlt=50",
    },
    {
      url: "https://s.cn.bing.net/th?id=OHR.BeachHutsSweden_ZH-CN4193150313_1920x1080.webp&qlt=50",
    },
    {
      url: "https://s.cn.bing.net/th?id=OHR.BeachHutsSweden_ZH-CN4193150313_1920x1080.webp&qlt=50",
    },
  ];

  // 默认显示第一张图片
  const [activeStep, setActiveStep] = useState<number>(0);

  const ImageList = List.map((item, index) => {
    const translateY =
      "translateY(" + (activeStep - index) * -1 * (height + 20) + "px)";

    return (
      <div
        className={styles["image-list-item"]}
        key={item.url}
        style={{
          transform: translateY,
        }}
      >
        {
          <Image
            width={width}
            height={height}
            alt="Picture of the author"
            src={item.url}
          ></Image>
        }
      </div>
    );
  });

  const buttonClick = (index: number) => {
    setActiveStep(index);
  };

  const ButtonList = List.map((item, index) => {
    return (
      <div key={item.url} onClick={() => buttonClick(index)}>
        <div
          className={styles["button"]}
          style={
            activeStep === index
              ? {
                  background: "pink",
                }
              : undefined
          }
        ></div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles["imge-list-container"]}>{ImageList}</div>
      <div className={styles["button-list"]}>
        <div className={styles["list-container"]}>{ButtonList}</div>
      </div>
    </div>
  );
}
export default Slider;
