import React, { useEffect, useState, useCallback, useRef } from "react";
import { Image, Spin, Modal } from "antd";
import Masonry from "react-masonry-css";
import { useInView } from "react-intersection-observer";
import styles from "./index.module.scss";
import { getArticleList } from "@/request/article/api";
import { Article } from "@/type/request.type";
import ArticleEditor from "@/components/ArticleEditor";
import { useRouter } from "next/router";

// 定义不同屏幕宽度下的列数
const breakpointColumnsObj = {
  default: 4,
  1400: 3,
  1100: 2,
  700: 1,
};

function List() {
  const router = useRouter();
  // 状态管理：文章列表、加载状态、当前页码和是否有更多数据
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs用于跟踪组件挂载状态和加载状态，防止内存泄漏
  const mounted = useRef(true);
  const isLoadingRef = useRef(false);

  // IntersectionObserver监听是否滚动到底部
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // 获取文章列表的函数，使用useCallback以避免不必要的重新渲染
  const fetchArticles = useCallback(async (pageNum: number) => {
    if (isLoadingRef.current || !mounted.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    const startTime = Date.now();

    try {
      // 调用API获取文章列表
      const response = await getArticleList({ page: pageNum, pageSize: 12 });

      if (!mounted.current) return;

      const data = response.data;

      // 确保请求间隔至少为1秒，提升用户体验
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }

      // 如果没有更多数据，则设置hasMore为false
      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      // 更新文章列表，确保相同id的文章不会重复出现
      setArticles((prev) => {
        const newArticles = pageNum === 1 ? data : [...prev, ...data];
        return Array.from(
          new Map(newArticles.map((item) => [item.id, item])).values()
        );
      });

      // 增加页码
      if (mounted.current) {
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      if (mounted.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    }
  }, []);

  // 组件挂载时获取第一页的数据，并在卸载时更新mounted状态
  useEffect(() => {
    fetchArticles(1);
    return () => {
      mounted.current = false;
    };
  }, []);

  // 当滚动到视图底部且有更多数据时触发下一页的数据获取
  useEffect(() => {
    if (inView && !loading && !isLoadingRef.current && hasMore && page > 1) {
      fetchArticles(page);
    }
  }, [inView, hasMore, page, fetchArticles, loading]);

  const handleArticleClick = (article: Article) => {
    router.push(`/test/article-detail/${article.id}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // 渲染文章列表
  return (
    <div className={styles.listContainer}>
      {/* 使用Masonry布局展示文章 */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.masonryGrid}
        columnClassName={styles.masonryColumn}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            className={styles.imageContainer}
            onClick={() => handleArticleClick(article)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.imageWrapper}>
              {/* 文章图片，若无imageUrl则随机选择一个默认图片 */}
              <Image
                alt={article.title}
                src={
                  article.cover_url ||
                  `/images/home/${Math.floor(Math.random() * 7) + 1}.png`
                }
                className={styles.image}
                preview={false}
              />
              <div className={styles.titleBar}>
                <h3 className={styles.title}>{article.title}</h3>
              </div>
              <div className={styles.overlay}>
                <p className={styles.content}>{article.content}</p>
                <div className={styles.footer}>
                  {/* 显示创建日期 */}
                  <span>
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
      {/* 加载指示器 */}
      {loading && (
        <div className={styles.loadingMore}>
          <Spin size="large" />
        </div>
      )}
      {/* IntersectionObserver的目标元素 */}
      <div ref={ref} style={{ height: "20px" }} />

      <Modal
        title={selectedArticle?.title}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {selectedArticle && (
          <ArticleEditor
            id={selectedArticle.id.toString()}
            readonly
            cover_url={selectedArticle.cover_url}
          />
        )}
      </Modal>
    </div>
  );
}

export default List;
