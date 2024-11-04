import { message, notification } from "antd";

import { SmileOutlined } from "@ant-design/icons";
import React from "react";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:33:53
 * @Description: 这是一个注释
 */

// 创建一个带有样式的 React 元素
const styledIcon = React.createElement(SmileOutlined, {
  style: { color: "#108ee9" },
});

const openNotification = (message: string, str: string) => {
  notification.open({
    message: message,
    description: str,
    onClick: () => {
      console.log("Notification Clicked!");
    },
    showProgress: true,
    pauseOnHover: true,
    icon: styledIcon,
    duration: 2,
  });
};

export { openNotification };
