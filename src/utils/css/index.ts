/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 12:16:58
 * @Description: 这是一个注释
 */

// 修改mainColor
function changeMainColor(color: string) {
  // const bodyColor = '--body-bg-color: black'
  const mainColor = "--main-bg-color: white";

  const html = document.querySelector("html")!;

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(mainColor, color);
}

// 修改fontColor
function changeFontColor(color: string) {
  const html = document.querySelector("html")!;

  const fontColor = "--font-color: white";

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(fontColor, color);
}

const ColorUtils = {
  changeMainColor,
  changeFontColor,
};

export { ColorUtils };
