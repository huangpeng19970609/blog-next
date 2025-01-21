import { useEffect, useState } from "react";
import { Tabs, Breadcrumb, message, Card, Spin, Empty, Button } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { getCurrentFolderDetail } from "@/request/folder/api";
import { IFolder, IArticle, NODE_TYPE } from "@/type/request.type";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

function Daily() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderList, setFolderList] = useState<IFolder[]>([]);
  const [folderHistory, setFolderHistory] = useState<IFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const router = useRouter();

  const fetchFolderDetail = async (folderId?: string) => {
    setLoading(true);
    try {
      const response = await getCurrentFolderDetail(folderId);
      if (response) {
        const { folder, article, currentFolderId } = response;
        setCurrentFolderId(currentFolderId);
        setArticles(article || []);
        setFolderList(folder || []);

        // 修改历史记录逻辑
        if (folderId) {
          // 找到当前点击的文件夹信息
          const currentFolder =
            folder?.find((f) => f.id.toString() === folderId) ||
            folderList.find((f) => f.id.toString() === folderId);

          if (currentFolder) {
            // 确保不重复添加相同的文件夹
            setFolderHistory((prev) => {
              // 如果已经在历史记录中，先移除旧的
              const filteredHistory = prev.filter(
                (f) => f.id !== currentFolder.id
              );
              return [...filteredHistory, currentFolder];
            });
          }
        } else {
          // 如果是访问根目录，清空历史记录
          setFolderHistory([]);
        }
      }
    } catch (error) {
      message.error("获取文件夹详情失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    // 如果点击的是当前文件夹，不做任何操作
    if (key === currentFolderId?.toString()) {
      return;
    }
    // 直接调用 fetchFolderDetail
    fetchFolderDetail(key);
  };

  const handleBack = () => {
    if (folderHistory.length === 0) {
      // 如果没有历史记录，直接返回根目录
      fetchFolderDetail();
      return;
    }

    // 移除最后一个历史记录并返回上一级
    setFolderHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop(); // 移除最后一个
      const lastFolder = newHistory[newHistory.length - 1];

      // 延迟执行 fetchFolderDetail，确保 folderHistory 状态已更新
      setTimeout(() => {
        if (lastFolder) {
          fetchFolderDetail(lastFolder.id.toString());
        } else {
          fetchFolderDetail();
        }
      }, 0);

      return newHistory;
    });
  };

  const items: TabsProps["items"] = folderList.map((folder) => ({
    key: folder.id.toString(),
    label: folder.name,
  }));

  if (currentFolderId) {
    items.unshift({
      key: currentFolderId?.toString() || "",
      label: "默认",
    });
  }

  // 组件初始化时获取根目录内容
  useEffect(() => {
    fetchFolderDetail();
  }, []);

  return (
    <div className={styles.dailyContainer}>
      {/* 左侧面板 */}
      <div className={styles.leftPanel}>
        {/* 返回按钮 */}
        <div className={styles.backButton}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            disabled={folderHistory.length === 0}
          >
            返回上级
          </Button>
        </div>
        {/* tabs标签 */}
        <div className={styles.tabsWrapper}>
          <Tabs
            loading={loading}
            activeKey={currentFolderId?.toString()}
            tabPosition="left"
            items={items}
            onChange={handleTabChange}
          />
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.rightPanel}>
        <div className={styles.articleList}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <Spin size="large" />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="暂无文章" />
          ) : (
            articles.map((article, index) => (
              <Card
                key={article.id}
                hoverable
                className={styles.articleCard}
                onClick={() => router.push(`/article/${article.id}`)}
              >
                <div className={styles.articleContent}>
                  <div className={styles.articleInfo}>
                    <div className={styles.articleIndex}>
                      <span className={styles.number}>
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <div className={styles.articleTitle}>{article.name}</div>
                      <div className={styles.articleContent}>
                        {article.content}
                      </div>
                    </div>
                  </div>

                  <div className={styles.articleMeta}>
                    <span className={styles.timeInfo}>
                      <CalendarOutlined className={styles.icon} />
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    <span className={styles.timeInfo}>
                      <ClockCircleOutlined className={styles.icon} />
                      {new Date(article.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Daily;
