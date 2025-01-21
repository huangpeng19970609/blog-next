import { ReactNode } from "react";
import dynamic from "next/dynamic";

// 动态导入页面组件
const Home = dynamic(() => import("@/pages/home"));
const Blog = dynamic(() => import("@/pages/blog"));
const Test = dynamic(() => import("@/pages/test"));
const FolderManager = dynamic(() => import("@/pages/test/FolderManager"));
const ArticleEditor = dynamic(() => import("@/components/ArticleEditor"));

export interface RouteConfig {
  path: string;
  title?: string;
  icon?: ReactNode;
  children?: RouteConfig[];
  auth?: boolean;
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
    path: "/test",
    title: "黄鹏",
    children: [
      {
        path: "/test/folder-manager",
        title: "文件管理",
      },
    ],
  },
  {
    path: "/article/edit/:id",
    title: "文章编辑",
  },
];

export default routes;
