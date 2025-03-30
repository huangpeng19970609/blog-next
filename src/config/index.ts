interface IConfig {
  isDevelopment: boolean;
  isMobile: boolean;
  isMobileFn: () => boolean;
}

import { isMobile } from "react-device-detect";

// 创建一个安全的设备类型检测函数
const isMobileCheck = () => {
  return isMobile;
};

const CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",

  // 检测函数
  isMobile: isMobileCheck,
};

export { CONFIG };
