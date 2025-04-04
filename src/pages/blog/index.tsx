import React, { useState } from "react";
import { Switch, message } from "antd";
import styles from "./index.module.scss";
import { getFileTree, IFolder } from "@/utils/node";
import getConfig from "next/config";
import dynamic from "next/dynamic";

// 懒加载组件
const FolderList = dynamic(() => import("./folder-list"), {
  loading: () => <div>加载文件夹视图中...</div>,
});

const List = dynamic(() => import("./list"), {
  loading: () => <div>加载列表视图中...</div>,
});

function Blog({ lists }: { lists: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [viewMode, setViewMode] = useState<"folder" | "list">("list");
  const [menuItems] = useState<IFolder[]>(lists ? JSON.parse(lists) : []);

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.footer}>
        <Switch
          checked={viewMode === "list"}
          onChange={(checked) => setViewMode(checked ? "list" : "folder")}
          checkedChildren="列表视图"
          unCheckedChildren="文件夹视图"
        />
      </div>
      <div className={styles.content}>
        {viewMode === "folder" ? (
          <FolderList menuItems={menuItems} />
        ) : (
          <List menuItems={menuItems} />
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const path = require("path");

  try {
    const rawLists = await getFileTree(
      path.join(getConfig().publicRuntimeConfig.PROJECT_ROOT, "/public/md")
    );

    // 过滤并只保留必要的信息
    const cleanLists = JSON.parse(
      JSON.stringify(rawLists, [
        "name", // 文件/文件夹名称
        "path", // 文件路径
        "title", // 文章标题
        "children", // 子文件夹/文件
        "type", // 类型（文件/文件夹）
        "relativePath", // 相对路径
      ])
    );

    return {
      props: {
        lists: JSON.stringify(cleanLists),
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        lists: JSON.stringify([]),
      },
    };
  }
}

export default Blog;
