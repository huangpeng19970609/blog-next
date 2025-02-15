import { message, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import React from "react";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:33:53
 * @Description: 这是一个注释
 */

// 创建一个带有样式的 React 元素
const SuccessstyledIcon = React.createElement(SmileOutlined, {
  // 浅绿色
  style: { color: "green" },
});

const ErrorstyledIcon = React.createElement(FrownOutlined, {
  // 浅红色
  style: { color: "red" },
});

const config = {
  showProgress: true,
  pauseOnHover: true,
  duration: 1,
  maxCount: 1,
  stack: 1,
};

const openNotification = (
  message: string,
  str: string,
  type?: "success" | "error"
) => {
  notification[type || "open"]({
    message: message,
    description: str,
    icon: type === "error" ? ErrorstyledIcon : SuccessstyledIcon,
    ...config,
  });
};

export { openNotification };
