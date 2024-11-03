/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 20:38:09
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
import { IFolder } from "@/utils/node";
import { MenuItemGroupType } from "antd/es/menu/interface";

type MenuItem = Required<MenuProps>["items"][number];

function LeftMenu(props: {
  folderList: IFolder[];
  setActiveMenuKey: ISetState;
  menuChange: any;
}): ReactElement {
  const { folderList, setActiveMenuKey } = props;

  const listsTree = [];

  const list = getListItem(folderList?.[0]) || [];

  listsTree.push(...(list.children || []));

  function getListItem(folder: IFolder) {
    const result = {
      key: folder?.path,
      label: folder?.name,
    } as MenuItemGroupType;

    if (folder.children) {
      result.children = [];

      for (let i = 0; i < folder.children.length; i++) {
        const element = getListItem(folder.children[i]);
        result.children.push(element);
      }
    }
    return result;
  }

  const onClick: MenuProps["onClick"] = (e) => {
    setActiveMenuKey(e.key);

    props.menuChange(e as any);
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={listsTree}
      inlineIndent={16}
    />
  );
}

export default LeftMenu;
