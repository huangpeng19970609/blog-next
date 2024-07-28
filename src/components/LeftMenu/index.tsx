/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 23:27:30
 * @Description: 业务组件 - [博客] 使用的左侧导航栏
 */
import React, { ReactElement } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { ISetState } from "@/type/react.type";

type MenuItem = Required<MenuProps>["items"][number];

function LeftMenu(props: {
  items: MenuItem[];
  setActiveMenuKey: ISetState;
}): ReactElement {
  const { items, setActiveMenuKey } = props;

  const onClick: MenuProps["onClick"] = (e) => {
    setActiveMenuKey(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
      inlineIndent={16}
    />
  );
}

export default LeftMenu;
