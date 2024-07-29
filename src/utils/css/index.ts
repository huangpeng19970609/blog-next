/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-29 23:44:48
 * @Description: 这是一个注释
 */

// 修改mainColor
function changeMainColor(color: string) {
  // const bodyColor = '--body-bg-color: black'
  const mainColor = "--main-bg-color";

  const html = document.querySelector("html")!;

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(mainColor, color);
}

// 修改fontColor
function changeFontColor(color: string) {
  const html = document.querySelector("html")!;

  const fontColor = "--font-color";

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(fontColor, color);
}

function changePaddingColor(color: string) {
  const html = document.querySelector("html")!;

  const fontColor = "--padding-right-color";

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(fontColor, color);
}

function changeTitleColor(color: string) {
  const html = document.querySelector("html")!;

  const fontColor = "--title-color";

  // 修改一个 Dom 节点上的 CSS 变量
  html.style.setProperty(fontColor, color);
}

const ColorUtils = {
  changeMainColor,
  changeFontColor,
  changePaddingColor,
  changeTitleColor,
};

export { ColorUtils };
