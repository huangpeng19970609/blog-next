import { MutableRefObject, useEffect, useRef, useState } from "react";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 15:52:55
 * @Description: 这是一个基于canvas做的slider滑动效果
 */
function SliderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasHeight, setCanvasHeight] = useState<number>(1000);

  const [canvasWidth, setCanvasWidth] = useState<number>(900);

  useEffect(() => {
    console.log(canvasRef.current);

    const current = canvasRef.current;

    if (!current) return;

    const ctx = current.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    img.src =
      "https://s.cn.bing.net/th?id=OHR.BeachHutsSweden_ZH-CN4193150313_1920x1080.webp";

    // img.style.objectFit = "cover";

    img.onload = function () {
      // 原图片初始宽高
      const w = img.naturalWidth;

      const h = img.naturalHeight;

      // ctx.drawImage(img, 0, 0, w, h, 0, 0, 192, 108);

      ctx.drawImage(img, 50, 50, 192 * 3, 108 * 3);
    };

    setCanvasHeight(canvasHeight * window.devicePixelRatio);
    setCanvasWidth(canvasWidth * window.devicePixelRatio);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasHeight}
        height={canvasWidth}
      ></canvas>
    </div>
  );
}

export default SliderCanvas;
