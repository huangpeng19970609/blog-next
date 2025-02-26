import { Tabs } from "antd";
import { useState } from "react";
import Questions from "./questions";
import Categories from "./categories";
import Tags from "./tags";
import styles from "./index.module.scss";

const { TabPane } = Tabs;

export default function Interview() {
  const [activeKey, setActiveKey] = useState("questions");

  return (
    <div className={styles.container}>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane tab="题目管理" key="questions">
          <Questions />
        </TabPane>
        <TabPane tab="类别管理" key="categories">
          <Categories />
        </TabPane>
        <TabPane tab="标签管理" key="tags">
          <Tags />
        </TabPane>
      </Tabs>
    </div>
  );
}
