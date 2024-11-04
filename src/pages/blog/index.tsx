/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:31:01
 * @Description: 博客菜单
 */
import LeftMenu from "@/components/LeftMenu";
import styles from "./index.module.scss";
import { MenuProps, message, Radio, RadioChangeEvent } from "antd";
import { useEffect, useRef, useState } from "react";
import Content from "./content/index";
import getConfig from "next/config";
import { getFileTree, IFolder } from "@/utils/node";
import { commonFetch } from "@/fetch";
import { MenuInfo } from "@/type/react.type";
import { openNotification } from "@/utils/message";

type TabPosition = "left" | "right" | "top" | "bottom";

function Blog(props) {
  const [messageApi, contextHolder] = message.useMessage();

  const [mode, setMode] = useState<TabPosition>("top");

  const [menuItems, setMenuItems] = useState<IFolder[]>(
    JSON.parse(props.lists)
  );

  const [activeMenuKey, setActiveMenuKey] = useState<string>();

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  // mode => menus
  useEffect(() => {}, [mode]);

  // menuActive => rightPanel的内容
  useEffect(() => {
    openNotification("进入成功", activeMenuKey + "");
  }, [activeMenuKey, messageApi]);

  const contentRef = useRef();

  const menuChange = (e: MenuInfo) => {
    if (contentRef.current) {
      // TODO: 暂时如此处理

      const url = e.key.replace(/^public\//, "");

      commonFetch<any>(url, {
        method: "GET",
      }).then((res) => {
        console.log("loading");

        res.text().then((val) => {
          const obj = {
            // 文件的string流
            file: val,
            title: url.replace(/^md\//, ""),
          };
          // 触发右侧content事件
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
          <div className={styles.segnent}>
            <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio.Button value="top">Horizontal</Radio.Button>
              <Radio.Button value="left">Vertical</Radio.Button>
            </Radio.Group>
          </div>
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

// 此函数在构建时被调用
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
