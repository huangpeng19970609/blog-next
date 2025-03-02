/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:40:02
 * @Description: 业务组件 - [博客] 使用的左侧导航栏
 */
import React, { ReactElement, useState, useEffect } from "react";
import styles from "./index.module.scss";
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
  defaultSelectedKey?: string;
  defaultOpenKeys?: string[];
}): ReactElement {
  const { folderList, setActiveMenuKey, defaultSelectedKey, defaultOpenKeys } =
    props;

  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys || []);

  const listsTree = [];

  const list = getListItem(folderList?.[0]) || [];

  listsTree.push(...(list.children || []));

  function getListItem(folder: IFolder) {
    const result = {
      key: folder?.path,
      label: folder?.name,
    } as MenuItemGroupType;

    if (folder && folder.children) {
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

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    if (defaultOpenKeys && defaultOpenKeys.length > 0) {
      console.log("Updating openKeys with:", defaultOpenKeys);
      setOpenKeys(defaultOpenKeys);
    }
  }, [defaultOpenKeys]);

  return (
    <div className={styles["hp-menu"]}>
      <Menu
        onClick={onClick}
        selectedKeys={[defaultSelectedKey || ""]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={listsTree}
        inlineIndent={16}
      />
    </div>
  );
}

export default LeftMenu;
