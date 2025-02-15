/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:31:01
 * @Description: 博客页面组件
 * 功能：
 * 1. 展示博客文章目录结构
 * 2. 加载并显示markdown文章内容
 */
import LeftMenu from "@/components/LeftMenu";
import styles from "./index.module.scss";
import { Empty, message } from "antd";
import { useEffect, useRef, useState } from "react";
import ArticleEditor from "@/components/ArticleEditor";
import getConfig from "next/config";
import { getFileTree, IFolder } from "@/utils/node";
import { request, staticRequest } from "@/request";
import { MenuInfo } from "@/type/react.type";
import { openNotification } from "@/utils/message";
import { getLastArticle, setLastArticle } from "@/utils/cookie";

type TabPosition = "left" | "right" | "top" | "bottom";

/**
 * Blog 组件 - 博客页面主组件
 * @param props - 包含文章目录树结构的属性对象
 */
function Blog(props: any) {
  const [messageApi, contextHolder] = message.useMessage();

  // 导航模式状态（顶部/左侧）
  const [mode, setMode] = useState<TabPosition>("top");

  // 菜单数据状态，初始化为服务端获取的目录树
  const [menuItems, setMenuItems] = useState<IFolder[]>(
    props.lists ? JSON.parse(props.lists) : []
  );

  // 当前激活的菜单项key
  const [activeMenuKey, setActiveMenuKey] = useState<string>();

  // 保存当前展开的节点
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 添加文章内容状态
  const [articleContent, setArticleContent] = useState<{
    content: string;
    title: string;
  }>({
    content: "",
    title: "",
  });

  // 修改 getParentKeys 函数，处理路径前缀问题
  const getParentKeys = (targetPath: string, folders: IFolder[]): string[] => {
    const keys: string[] = [];

    // 确保目标路径有 public/ 前缀
    const fullTargetPath = targetPath.startsWith("public/")
      ? targetPath
      : `public/${targetPath}`;
    console.log("Full target path:", fullTargetPath); // 添加日志

    const findPath = (path: string, items: IFolder[]) => {
      for (const item of items) {
        // 检查当前项的路径是否是目标路径的父路径
        if (path.startsWith(item.path + "/") && item.path !== path) {
          console.log("Found parent:", item.path); // 添加日志
          keys.push(item.path);
          if (item.children) {
            findPath(path, item.children);
          }
        }
      }
    };

    findPath(fullTargetPath, folders);
    return keys;
  };

  // 加载文章的通用函数
  const loadArticle = (url: string) => {
    // 计算需要展开的节点
    const parentKeys = getParentKeys(url, menuItems);

    // 确保url以'/'开头
    const requestUrl = url.startsWith("/") ? url : `/${url}`;

    staticRequest({
      url: requestUrl,
      method: "GET",
      responseType: "text",
    }).then((val) => {
      if (val) {
        setArticleContent({
          content: val,
          title: url.replace(/^md\//, ""),
        });
      }
    });
  };

  /**
   * 处理菜单项点击事件
   * @param e - 菜单点击事件信息
   */
  const menuChange = (e: MenuInfo) => {
    const url = e.key.replace(/^public\//, "");
    console.log("Menu item clicked:", url); // 添加日志
    // 保存当前文章位置
    setLastArticle(url);
    loadArticle(url);
  };

  // 修改初始化逻辑，确保 menuItems 加载完成后再计算展开路径
  useEffect(() => {
    document.body.style.overflow = "auto";

    // 检查是否有保存的文章位置
    const savedArticle = getLastArticle();
    const targetArticle = savedArticle || "md/面试题/手写题.md";

    // 确保 menuItems 已加载
    if (menuItems.length > 0) {
      console.log("Menu structure:", JSON.stringify(menuItems, null, 2)); // 添加菜单结构日志
      // 计算需要展开的节点
      const parentKeys = getParentKeys(targetArticle, menuItems);
      console.log("Parent keys calculated:", parentKeys);
      console.log("Target article:", targetArticle);
      setOpenKeys(parentKeys);
      // 加载文章
      loadArticle(targetArticle);
    }
  }, [menuItems]);
  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.left}>
        <LeftMenu
          folderList={menuItems}
          menuChange={menuChange}
          setActiveMenuKey={setActiveMenuKey}
          defaultSelectedKey={activeMenuKey}
          defaultOpenKeys={openKeys}
        />
      </div>
      <div className={styles.right}>
        {articleContent.content ? (
          <ArticleEditor
            title={articleContent.title}
            value={articleContent.content}
            readonly={true}
          />
        ) : (
          <Empty description={false} />
        )}
      </div>
    </div>
  );
}

/**
 * getStaticProps - Next.js静态生成函数
 * @returns {Promise<{props: {lists: string}}>} 序列化后的文件目录树结构
 */
export async function getStaticProps() {
  const path = require("path");

  try {
    // 获取整体文件的结构
    const lists = await getFileTree(
      path.join(getConfig().publicRuntimeConfig.PROJECT_ROOT, "/public/md")
    );

    return {
      props: {
        lists: JSON.stringify(lists),
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
