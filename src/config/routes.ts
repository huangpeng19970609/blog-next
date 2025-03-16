import { ReactNode } from "react";

// 改为静态导入
export interface RouteConfig {
  path: string;
  title?: string;
  icon?: ReactNode;
  children?: RouteConfig[];
  auth?: boolean;
  hidden?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: "/home",
    title: "首页",
  },
  {
    path: "/blog",
    title: "笔记",
  },
  {
    path: "/daily",
    title: "日记",
  },
  {
    path: "/game",
    title: "模块中心",
  },
  {
    path: "/edit",
    title: "编辑",
    children: [
      {
        path: "/folder-manager",
        title: "文件管理",
      },
      {
        path: "/interview",
        title: "面试题管理",
      },
    ],
    hidden: true,
  },
];

export default routes;
