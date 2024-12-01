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
import Content from "./content/index";
import getConfig from "next/config";
import { getFileTree, IFolder } from "@/utils/node";
import { http } from "@/fetch";
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

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  /**
   * 处理导航模式切换
   * @param e - Radio切换事件对象
   */
  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

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
    if (contentRef.current) {
      // 移除public前缀获取实际文件路径
      const url = e.key.replace(/^public\//, "");

      // 获取文章内容
      http.get(url, {
        method: "GET",
      }).then((res) => {
        res.text().then((val) => {
          const obj = {
            file: val,                    // markdown文件内容
            title: url.replace(/^md\//, "") // 文章标题（从路径中提取）
          };
          // 更新内容区域
          contentRef?.current.childMethod(obj);
        });
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        {contextHolder}
        <div className={styles.left}>
          {/* <div className={styles.segnent}> */}
            {/* <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio.Button value="top">Horizontal</Radio.Button>
              <Radio.Button value="left">Vertical</Radio.Button>
            </Radio.Group> */}
          {/* </div> */}
          <LeftMenu
            folderList={menuItems}
            menuChange={menuChange}
            setActiveMenuKey={setActiveMenuKey}
          ></LeftMenu>
        </div>
        <div className={styles.right}>
          <Content ref={contentRef}></Content>
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
