import React, { useEffect, useState } from "react";
import styles from "./static-data.module.scss";
import {
  getSummaryStatistics,
  ISummaryStatistics,
} from "../../request/static-data";
import { Spin, Tabs, Tag } from "antd";

export default function StaticData() {
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<ISummaryStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getSummaryStatistics();
        if (response.code === 200 && response.data) {
          setStatistics(response.data);
          console.log("统计数据:", response.data);
        } else {
          setError(response.message || "获取数据失败");
        }
      } catch (err) {
        setError("获取数据时发生错误");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="正在加载数据..." />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  // 获取文章状态，并为不同状态设置不同颜色
  const getStatusTag = (status: string) => {
    const statusColors: { [key: string]: string } = {
      draft: "orange",
      published: "green",
      "": "default",
    };

    return (
      <Tag color={statusColors[status] || "default"}>{status || "无状态"}</Tag>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {/* 基础统计信息格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>基础统计</h3>
            {statistics && (
              <div>
                <p>用户总数: {statistics.overview.user_count}</p>
                <p>文章总数: {statistics.overview.article_count}</p>
                <p>已发布文章: {statistics.overview.published_article_count}</p>
                <p>文件夹总数: {statistics.overview.folder_count}</p>
                <p>问题总数: {statistics.overview.question_count}</p>
                <p>本周新增用户: {statistics.overview.new_user_count_week}</p>
                <p>
                  本周新增文章: {statistics.overview.new_article_count_week}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 文章状态分布格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>文章状态分布</h3>
            {statistics && (
              <div>
                {Object.entries(statistics.articles.status_distribution).map(
                  ([status, count]) => (
                    <p key={status}>
                      {getStatusTag(status)} {count}篇
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* 文章内容格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>文章内容</h3>
            {statistics && (
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="热门文章" key="1">
                  <ul className={styles.list}>
                    {statistics.articles.top_articles.map((article) => (
                      <li key={article.id}>
                        {article.title} {getStatusTag(article.status || "")}
                        <div className={styles.articleMeta}>
                          浏览量: {article.view_count} | 创建于:{" "}
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Tabs.TabPane>
                <Tabs.TabPane tab="最近文章" key="2">
                  <ul className={styles.list}>
                    {statistics.articles.recent_articles.map((article) => (
                      <li key={article.id}>
                        {article.title} {getStatusTag(article.status || "")}
                        <div className={styles.articleMeta}>
                          浏览量: {article.view_count} | 创建于:{" "}
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Tabs.TabPane>
              </Tabs>
            )}
          </div>
        </div>

        {/* 活跃用户格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>活跃用户</h3>
            {statistics && (
              <ul className={styles.list}>
                {statistics.users.top_active_users.map((user) => (
                  <li key={user.id}>
                    <div className={styles.userName}>{user.username}</div>
                    <div className={styles.userMeta}>
                      文章数: {user.article_count}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 热门文件夹格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>热门文件夹</h3>
            {statistics && (
              <ul className={styles.list}>
                {statistics.folders.top_folders.map((folder) => (
                  <li key={folder.id}>
                    <div className={styles.folderName}>{folder.name}</div>
                    <div className={styles.folderMeta}>
                      文章数: {folder.article_count}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 面试题统计格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>面试题统计</h3>
            {statistics && statistics.questions ? (
              <div>
                <div className={styles.section}>
                  <h4>难度分布</h4>
                  <p>
                    <Tag color="success">简单</Tag>{" "}
                    {statistics.questions.difficulty_distribution.简单}题
                  </p>
                  <p>
                    <Tag color="warning">中等</Tag>{" "}
                    {statistics.questions.difficulty_distribution.中等}题
                  </p>
                  <p>
                    <Tag color="error">困难</Tag>{" "}
                    {statistics.questions.difficulty_distribution.困难}题
                  </p>
                </div>

                <div className={styles.section}>
                  <h4>分类分布</h4>
                  {Object.entries(
                    statistics.questions.category_distribution
                  ).map(([category, count]) => (
                    <p key={category}>
                      <Tag color="blue">{category}</Tag> {count}题
                    </p>
                  ))}
                </div>

                <div className={styles.section}>
                  <h4>热门题目</h4>
                  <ul className={styles.list}>
                    {statistics.questions.top_questions.map((question) => (
                      <li key={question.id}>
                        {question.title}
                        <div className={styles.questionMeta}>
                          浏览量: {question.view_count} | 点赞:{" "}
                          {question.like_count}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>暂无面试题数据</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
