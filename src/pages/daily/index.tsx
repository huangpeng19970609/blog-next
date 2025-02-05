import { useEffect, useState } from "react";
import { Tabs, Breadcrumb,  Card, Spin, Empty, Button } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { getCurrentFolderDetail } from "@/request/folder/api";
import { IFolder, IArticle, NODE_TYPE } from "@/type/request.type";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import ArticleEditor from "@/components/ArticleEditor";
import { openNotification } from "@/utils/message";

function Daily() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderList, setFolderList] = useState<IFolder[]>([]);
  const [folderHistory, setFolderHistory] = useState<IFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
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
      openNotification("获取文件夹详情失败", "请稍后再试", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    // 如果点击的是当前文件夹，不做任何操作
    if (key === currentFolderId?.toString()) {
      return;
    }
    // 重置选中的文章
    setSelectedArticle(null);
    // 直接调用 fetchFolderDetail
    fetchFolderDetail(key);
  };

  const handleArticleClick = (article: IArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
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

  const items: TabsProps["items"] = folderList.map((folder, index) => ({
    key: folder.id.toString(),
    label: (
      <div className={styles.tabItem}>
        <FolderOutlined />
        <span className={styles.tabIndex}>
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span className={styles.tabName}>{folder.name}</span>
      </div>
    ),
  }));

  if (currentFolderId) {
    items.unshift({
      key: currentFolderId?.toString() || "",
      label: (
        <div className={styles.tabItem}>
          <FolderOutlined />
          <span className={styles.tabIndex}>00</span>
          <span className={styles.tabName}>默认</span>
        </div>
      ),
    });
  }

  // 生成面包屑项
  const breadcrumbItems = [
    {
      title: "根目录",
      onClick: () => {
        setSelectedArticle(null);
        fetchFolderDetail();
      },
    },
    ...folderHistory.map((folder) => ({
      title: folder.name,
      onClick: () => {
        setSelectedArticle(null);
        fetchFolderDetail(folder.id.toString());
      },
    })),
  ];

  // 组件初始化时获取根目录内容
  useEffect(() => {
    const init = async () => {
      const { articleId } = router.query;

      // 等待 fetchFolderDetail 完成
      await fetchFolderDetail();

      // 确保 articleId 存在且为字符串类型
      if (typeof articleId === "string") {
        // 重新获取最新的 articles 状态
        const response = await getCurrentFolderDetail();
        if (response && response.article) {
          const targetArticle = response.article.find(
            (article) => article.id.toString() === articleId
          );
          if (targetArticle) {
            setSelectedArticle(targetArticle);
          }
        }
      }
    };

    init();
  }, [router.query]);

  return (
    <div className={styles.dailyContainer}>
      {/* 左侧面板 */}
      <div className={styles.leftPanel}>
        {/* 面包屑导航 */}
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems.map((item, index) => ({
              title: (
                <span onClick={item.onClick} className={styles.breadcrumbItem}>
                  {item.title}
                </span>
              ),
            }))}
            separator=">"
          />
        </div>

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
          <Spin spinning={loading}>
            <Tabs
              activeKey={currentFolderId?.toString()}
              tabPosition="left"
              items={items}
              onChange={handleTabChange}
            />
          </Spin>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.rightPanel}>
        {/* 文章详情 */}
        {selectedArticle ? (
          <Spin spinning={loading}>
            <div className={styles.articleEditorWrapper}>
              <div className={styles.backToListButton}>
                <Button onClick={handleBackToList} icon={<ArrowLeftOutlined />}>
                  返回文章列表
                </Button>
              </div>
              <ArticleEditor
                title={selectedArticle.name}
                value={selectedArticle.content}
                readonly={true}
              />
            </div>
          </Spin>
        ) : (
          // 文章列表
          <div className={styles.articleListWrapper}>
            {loading ? (
              <div className={styles.loadingWrapper}>
                <Spin size="large" tip="加载中..." />
              </div>
            ) : articles.length === 0 ? (
              <Empty description="暂无文章" />
            ) : (
              articles.map((article, index) => (
                <div
                  key={article.id}
                  className={styles.articleItem}
                  onClick={() => handleArticleClick(article)}
                >
                  <div className={styles.articleIndex}>
                    <span>{(index + 1).toString().padStart(2, "0")}</span>
                  </div>
                  <div className={styles.articleMain}>
                    <div className={styles.articleTitle}>{article.name}</div>
                    <div className={styles.articleMeta}>
                      <span>
                        <CalendarOutlined />
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        <ClockCircleOutlined />
                        {new Date(article.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Daily;
