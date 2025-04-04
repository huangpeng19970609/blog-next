import dynamic from "next/dynamic";
import { Spin } from "antd";
import React from "react";

const DefaultLoading = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
    <Spin tip="加载中..." />
  </div>
);

// 编辑器组件
export const ArticleEditor = dynamic(
  () => import("@/components/ArticleEditor"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

// 面试题编辑器
export const QuestionEditor = dynamic(
  () => import("@/page-components/components/QuestionEditor"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

// 博客组件
export const BlogList = dynamic(() => import("@/pages/blog/list"), {
  loading: () => <div>加载列表视图中...</div>,
});

export const BlogFolderList = dynamic(
  () => import("@/pages/blog/folder-list"),
  {
    loading: () => <div>加载文件夹视图中...</div>,
  }
);

// 如果创建了统计组件，保留这些导出；否则可以移除
export const StatisticsCharts = dynamic(
  () => import("@/page-components/statistics/StatisticsCharts"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

export const StatisticsTable = dynamic(
  () => import("@/page-components/statistics/StatisticsTable"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

// 其他常用的大型组件...
