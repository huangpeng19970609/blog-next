import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import styles from "./index.module.scss";
import FolderList from "./folder-list";
import List from "./list";

function Daily() {
  const [viewMode, setViewMode] = useState<"folder" | "list">("list");

  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <Switch
          checked={viewMode === "list"}
          onChange={(checked) => {
            console.log("[Debug] Switch 切换:", checked ? "list" : "folder");
            setViewMode(checked ? "list" : "folder");
          }}
          checkedChildren="列表视图"
          unCheckedChildren="文件夹视图"
        />
      </div>
      <div className={styles.content}>
        {viewMode === "folder" ? <FolderList /> : <List />}
      </div>
    </div>
  );
}

export default Daily;
