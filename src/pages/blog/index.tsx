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
import { MenuProps, message, Radio, RadioChangeEvent } from "antd";
import { useEffect, useRef, useState } from "react";
import ArticleEditor from "@/components/ArticleEditor";
import getConfig from "next/config";
import { getFileTree, IFolder } from "@/utils/node";
import { request } from "@/request";
import { MenuInfo } from "@/type/react.type";
import { openNotification } from "@/utils/message";

type TabPosition = "left" | "right" | "top" | "bottom";

/**
 * Blog 组件 - 博客页面主组件
 * @param props - 包含文章目录树结构的属性对象
 */
function Blog(props) {
  const [messageApi, contextHolder] = message.useMessage();

  // 导航模式状态（顶部/左侧）
  const [mode, setMode] = useState<TabPosition>("top");

  // 菜单数据状态，初始化为服务端获取的目录树
  const [menuItems, setMenuItems] = useState<IFolder[]>(
    JSON.parse(props.lists)
  );

  // 当前激活的菜单项key
  const [activeMenuKey, setActiveMenuKey] = useState<string>();

  // 添加文章内容状态
  const [articleContent, setArticleContent] = useState<{
    content: string;
    title: string;
  }>({
    content: "",
    title: "",
  });

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  // mode => menus
  useEffect(() => {}, [mode]);

  // menuActive => rightPanel的内容
  useEffect(() => {
    openNotification("进入成功", activeMenuKey + "");
  }, [activeMenuKey, messageApi]);

  /**
   * 内容展示区域的引用
   */
  const contentRef = useRef();

  /**
   * 处理菜单项点击事件
   * @param e - 菜单点击事件信息
   */
  const menuChange = (e: MenuInfo) => {
    const url = e.key.replace(/^public\//, "");
    request
      .get<string>(url, {
        responseType: "text",
      })
      .then((val) => {
        if (val) {
          setArticleContent({
            content: val,
            title: url.replace(/^md\//, ""),
          });
        }
      });
  };

  return (
    <>
      <div className={styles.container}>
        {contextHolder}
        <div className={styles.left}>
          <LeftMenu
            folderList={menuItems}
            menuChange={menuChange}
            setActiveMenuKey={setActiveMenuKey}
          ></LeftMenu>
        </div>
        <div className={styles.right}>
          <ArticleEditor
            title={articleContent.title}
            value={articleContent.content}
            onChange={(newValue) => setArticleContent(newValue)}
            readonly={true}
          />
        </div>
      </div>
    </>
  );
}

/**
 * getStaticProps - Next.js静态生成函数
 * @returns {Promise<{props: {lists: string}}>} 序列化后的文件目录树结构
 */
export async function getStaticProps() {
  // 调用外部 API 获取博文列表
  const path = require("path");

  // 获取整体文件的结构
  const lists = await getFileTree(
    path.join(getConfig().publicRuntimeConfig.PROJECT_ROOT, "/public/md")
  );

  return {
    props: {
      lists: JSON.stringify(lists),
    },
  };
}

export default Blog;
