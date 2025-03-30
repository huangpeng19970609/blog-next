import React, { useEffect, useState } from "react";
import styles from "./static-data.module.scss";
import {
  getSummaryStatistics,
  ISummaryStatistics,
} from "../../request/static-data";
import { Spin } from "antd";

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
                <p>本周新增用户: {statistics.overview.new_user_count_week}</p>
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
                      {status}: {count}
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* 热门文章格子 */}
        <div className={styles.gridItem}>
          <div className={styles.gridItemContent}>
            <h3>热门文章</h3>
            {statistics && (
              <ul className={styles.list}>
                {statistics.articles.top_articles.map((article) => (
                  <li key={article.id}>
                    {article.title} (浏览量: {article.view_count})
                  </li>
                ))}
              </ul>
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
                    {user.username} (文章数: {user.article_count})
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
                    {folder.name} (文章数: {folder.article_count})
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
                <p>
                  简单题目: {statistics.questions.difficulty_distribution.简单}
                </p>
                <p>
                  中等题目: {statistics.questions.difficulty_distribution.中等}
                </p>
                <p>
                  困难题目: {statistics.questions.difficulty_distribution.困难}
                </p>
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
