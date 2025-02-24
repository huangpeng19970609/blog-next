/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:31:01
 * @Description: 博客页面组件
 * 功能：
 * 1. 展示博客文章目录结构
 * 2. 加载并显示markdown文章内容
 */
import { useEffect, useState } from "react";
import LeftMenu from "@/components/LeftMenu";
import styles from "./index.module.scss";
import { Empty } from "antd";
import ArticleEditor from "@/components/ArticleEditor";
import { IFolder } from "@/utils/node";
import { MenuInfo } from "@/type/react.type";
import { Article } from "@/type/request.type";
import { getLastArticle, setLastArticle } from "@/utils/cookie";
import { getStaticArticleData } from "@/request/article/api";

interface FolderListProps {
  menuItems: IFolder[];
}

function FolderList({ menuItems }: FolderListProps) {
  const [activeMenuKey, setActiveMenuKey] = useState<string>();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [articleContent, setArticleContent] = useState<Article>({
    id: 0,
    title: "",
    content: "",
    user_id: 0,
    created_at: "",
    cover_url: "",
  });

  // 获取父级路径keys
  const getParentKeys = (targetPath: string, folders: IFolder[]): string[] => {
    const keys: string[] = [];
    const fullTargetPath = targetPath.startsWith("public/")
      ? targetPath
      : `public/${targetPath}`;

    const findPath = (path: string, items: IFolder[]) => {
      for (const item of items) {
        if (path.startsWith(item.path + "/") && item.path !== path) {
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

  // 加载文章内容
  const loadArticle = (url: string) => {
    const requestUrl = url.startsWith("/") ? url : `/${url}`;

    getStaticArticleData(requestUrl).then((val) => {
      setArticleContent(val);
    });
  };

  // 处理菜单点击
  const handleMenuChange = (e: MenuInfo) => {
    const url = e.key.replace(/^public\//, "");
    setLastArticle(url);
    loadArticle(url);
  };

  // 初始化加载
  useEffect(() => {
    if (menuItems.length > 0) {
      const savedArticle = getLastArticle();
      const targetArticle = savedArticle || "md/面试题/手写题.md";
      const parentKeys = getParentKeys(targetArticle, menuItems);
      setOpenKeys(parentKeys);
      loadArticle(targetArticle);
    }
  }, [menuItems]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <LeftMenu
          folderList={menuItems}
          menuChange={handleMenuChange}
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
            cover_url={articleContent.cover_url}
          />
        ) : (
          <Empty description={false} />
        )}
      </div>
    </div>
  );
}

export default FolderList;
