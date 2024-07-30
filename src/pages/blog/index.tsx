/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-30 22:58:23
 * @Description: 博客菜单
 */
import LeftMenu from "@/components/LeftMenu";
import styles from "./index.module.scss";
import { MenuProps, message, Radio, RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import BlogList from "@/pages-component/blog/List";

type TabPosition = "left" | "right" | "top" | "bottom";
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  { key: "JavaScript", label: "JavaScript" },
  {
    type: "divider",
  },
  { key: "Vue", label: "Vue" },
  {
    type: "divider",
  },
  { key: "React", label: "React、" },
  {
    type: "divider",
  },
  { key: "14", label: "TS" },
];
const items2: MenuItem[] = [
  {
    key: "grp1231",
    label: "Group",
    type: "group",
    children: [
      { key: "1223", label: "123qwrqrwqrwq213131 13" },
      { key: "1224", label: "wqrqrwqrqwr 14" },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "gr232312p",
    label: "Group",
    type: "group",
    children: [
      { key: "143", label: "12312312 13" },
      { key: "154", label: "Option 14qr" },
    ],
  },
  {
    type: "divider",
  },
];

function Blog() {
  const [messageApi, contextHolder] = message.useMessage();

  const [mode, setMode] = useState<TabPosition>("top");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [activeMenuKey, setActiveMenuKey] = useState<string>();

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  // mode => menus
  useEffect(() => {
    let resultMenuITems = [];
    if (mode === "top") {
      resultMenuITems = items;
    } else {
      resultMenuITems = items2;
    }
    setMenuItems(resultMenuITems);
  }, [mode]);

  // menuActive => rightPanel的内容
  useEffect(() => {
    if (activeMenuKey === "JavaScript") {
      messageApi.success("进入" + activeMenuKey);
      return;
    }
    messageApi.error("目前不支持" + activeMenuKey);
  }, [activeMenuKey, messageApi]);

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
            items={menuItems}
            setActiveMenuKey={setActiveMenuKey}
          ></LeftMenu>
        </div>
        <div className={styles.right}>
          <BlogList></BlogList>
        </div>
      </div>
    </>
  );
}

export default Blog;
