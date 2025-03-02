import { Tabs } from "antd";
import { useState } from "react";
import Questions from "./questions";
import Categories from "./categories/index";
import Tags from "./tags";
import styles from "./index.module.scss";

export default function Interview() {
  const [activeKey, setActiveKey] = useState("questions");

  return (
    <div className={styles.container}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: "questions",
            label: "题目管理",
            children: <Questions />,
          },
          {
            key: "categories",
            label: "类别管理",
            children: <Categories />,
          },
          {
            key: "tags",
            label: "标签管理",
            children: <Tags />,
          },
        ]}
      />
    </div>
  );
}
