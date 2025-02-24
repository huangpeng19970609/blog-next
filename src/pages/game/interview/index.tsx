import BackButton from "@/components/back-button";
import React, { useState } from "react";
import { List } from "antd";
import styles from "./index.module.scss";

// 模拟数据
const mockInterviews = [
  {
    id: 1,
    title: "什么是React的虚拟DOM？",
    content:
      "虚拟DOM是React的一个核心概念，它是真实DOM的JavaScript对象表示。React通过比较虚拟DOM的差异来最小化实际DOM操作，从而提高性能。",
  },
  {
    id: 2,
    title: "请解释React中的状态提升",
    content:
      "状态提升是指将多个组件共用的状态提升到它们最近的共同父组件中。这样可以确保数据的一致性，并使组件之间的数据流更加清晰。",
  },
  {
    id: 3,
    title: "什么是Next.js的SSR？",
    content:
      "SSR（服务器端渲染）是Next.js的一个重要特性，它允许在服务器端预渲染页面，提供更好的首屏加载性能和SEO优化。",
  },
];

export default function Interview() {
  const [selectedInterview, setSelectedInterview] = useState<
    (typeof mockInterviews)[0] | null
  >(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <List
          dataSource={mockInterviews}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                setSelectedInterview(item);
                setShowAnswer(false);
              }}
              className={
                selectedInterview?.id === item.id ? styles.selected : ""
              }
            >
              <div className={styles.listItem}>{item.title}</div>
            </List.Item>
          )}
        />
      </div>
      <div className={styles.right}>
        <BackButton />
        {selectedInterview && (
          <div className={styles.content}>
            <h2>{selectedInterview.title}</h2>
            <div
              className={styles.answer}
              onClick={() => setShowAnswer(true)}
              style={{
                filter: showAnswer ? "none" : "blur(5px)",
                cursor: showAnswer ? "default" : "pointer",
              }}
            >
              {selectedInterview.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
