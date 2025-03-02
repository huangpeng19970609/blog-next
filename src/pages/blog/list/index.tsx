import { useEffect, useState, memo, useCallback, useMemo, useRef } from "react";
import { List as AntList, Tag, Button, Modal } from "antd";
import { UpOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { IFolder } from "@/utils/node";
import { staticRequest } from "@/request";
import dayjs from "dayjs";
import { throttle } from "lodash-es";
import { getStaticArticleData } from "@/request/article/api";
import "bytemd/dist/index.css";
import ArticleEditor from "@/components/ArticleEditor";

interface ListProps {
  menuItems: IFolder[];
}

interface ArticleItem {
  title: string;
  path: string;
  date: string;
  tags: string[];
}

interface ArticleDetail {
  content: string;
  title: string;
}

let activeIndex = 0;

// 预设一些 Ant Design 支持的颜色
const PRESET_COLORS = [
  "blue",
  "cyan",
  "geekblue",
  "gold",
  "green",
  "lime",
  "magenta",
  "orange",
  "purple",
  "red",
  "volcano",
] as const;

// 使用 memo 缓存列表组件，并添加比较函数
const ArticleList = memo(
  ({
    articles,
    tagColorMap,
    onArticleClick,
  }: {
    articles: ArticleItem[];
    tagColorMap: Record<string, string>;
    onArticleClick: (path: string) => void;
  }) => {
    return (
      <AntList
        dataSource={articles}
        renderItem={(item, index) => (
          <div
            className={styles.listItem}
            hp-name={index}
            onClick={() => {
              onArticleClick(item.path);
            }}
          >
            <div className={styles.article}>
              <div className={styles.header}>
                <div className={styles.circle} hp-name-circle={index}>
                  {index + 1}
                </div>
                <h2 className={styles.title}>
                  {item.title}
                  <UpOutlined className={styles.arrow} size={20} />
                </h2>
                <span className={styles.date}>{item.date}</span>
              </div>
              <div className={styles.tags}>
                {item.tags?.map((tag, tagIndex) => (
                  <Tag
                    key={tagIndex}
                    color={tagColorMap[tag]}
                    style={{ marginRight: 8 }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      />
    );
  },
  (prevProps, nextProps) => {
    // 深度比较 props，只有在真正需要更新时才重新渲染
    return (
      JSON.stringify(prevProps.articles) ===
        JSON.stringify(nextProps.articles) &&
      JSON.stringify(prevProps.tagColorMap) ===
        JSON.stringify(nextProps.tagColorMap)
    );
  }
);

function List({ menuItems }: ListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [tagColorMap, setTagColorMap] = useState<Record<string, string>>({});
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const extractMdFiles = (
    folders: IFolder[]
  ): Array<{ path: string; tags: string[] }> => {
    let files: Array<{ path: string; tags: string[] }> = [];

    const traverse = (item: IFolder, parentTags: string[] = []) => {
      const currentTags = item.name ? [...parentTags, item.name] : parentTags;

      if (item.children) {
        item.children.forEach((child) => traverse(child, currentTags));
      } else {
        if (item.path.endsWith(".md") || item.path.endsWith(".js")) {
          const path = item.path.replace(/^public\//, "");
          files.push({
            path,
            tags: currentTags.slice(0, -1),
          });
        }
      }
    };

    folders.forEach((folder) => traverse(folder));
    return files;
  };

  const loadArticles = async (
    pathsWithTags: Array<{ path: string; tags: string[] }>
  ) => {
    // 收集所有唯一的标签
    const uniqueTags = Array.from(
      new Set(pathsWithTags.flatMap(({ tags }) => tags))
    );

    // 为每个唯一的标签分配一个颜色
    const newTagColorMap = uniqueTags.reduce((acc, tag, index) => {
      acc[tag] = PRESET_COLORS[index % PRESET_COLORS.length];
      return acc;
    }, {} as Record<string, string>);

    setTagColorMap(newTagColorMap);

    const articles = pathsWithTags.map(({ path, tags }) => {
      const title =
        path.split("/").pop()?.replace(".md", "")?.replace(/-/g, " ") || "";
      return {
        title,
        path,
        tags,
        date: dayjs().format("YYYY-MM-DD"),
      };
    });

    setArticles(
      articles.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const throttledHandleMouseMove = throttle((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const listItem = target.closest(`[hp-name]`);

    if (listItem) {
      const index = parseInt(listItem.getAttribute("hp-name") || "-1");

      if (activeIndex !== index) {
        const prevCircle = document.querySelector(
          `[hp-name-circle="${activeIndex}"]`
        );
        const currentCircle = document.querySelector(
          `[hp-name-circle="${index}"]`
        );

        if (prevCircle && currentCircle) {
          let animCircle = document.querySelector(`.${styles.animCircle}`);
          if (!animCircle) {
            animCircle = document.createElement("div");
            animCircle.className = `${styles.animCircle} ${styles.circle}`;
            document.body.appendChild(animCircle);
          }

          const prevRect = prevCircle.getBoundingClientRect();
          const currentRect = currentCircle.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;

          animCircle.setAttribute(
            "style",
            `
            position: absolute;
            top: ${prevRect.top + scrollTop}px;
            left: ${prevRect.left + scrollLeft}px;
            width: ${prevRect.width}px;
            height: ${prevRect.height}px;
            display: flex;
            align-items: center;
            justify-content: center;
          `
          );

          animCircle.textContent = `${activeIndex + 1}`;

          requestAnimationFrame(() => {
            (animCircle as HTMLElement).style.transform = `translate(
              ${currentRect.left - prevRect.left}px,
              ${currentRect.top - prevRect.top}px
            )`;
          });

          animCircle.addEventListener(
            "transitionend",
            () => {
              animCircle?.remove();
            },
            { once: true }
          );
        }

        const previousActive = document.querySelector(
          `[hp-name="${activeIndex}"]`
        );
        previousActive?.classList.remove("hp-blog-list-active");
        listItem?.classList.add("hp-blog-list-active");
        activeIndex = index;
      }
    }
  }, 300);

  useEffect(() => {
    document.addEventListener("mousemove", throttledHandleMouseMove);
    return () => {
      document.removeEventListener("mousemove", throttledHandleMouseMove);
      throttledHandleMouseMove.cancel();
      document.querySelector(`.${styles.animCircle}`)?.remove();
    };
  }, []);

  useEffect(() => {
    const mdFiles = extractMdFiles(menuItems);
    loadArticles(mdFiles);
  }, [menuItems]);

  const handleArticleClick = useCallback((path: string) => {
    const requestUrl = path.startsWith("/") ? path : `/${path}`;

    getStaticArticleData(requestUrl).then((val) => {
      debugger;

      if (val) {
        setArticleDetail(val);
        setIsModalOpen(true);
      }
    });
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setArticleDetail(null);
  }, []);

  // 使用 useMemo 缓存文章列表
  const memoizedArticleList = useMemo(
    () => (
      <ArticleList
        articles={articles}
        tagColorMap={tagColorMap}
        onArticleClick={handleArticleClick}
      />
    ),
    [articles, tagColorMap, handleArticleClick]
  );

  return (
    <div className={styles.container}>
      <div ref={listContainerRef} className={styles.listContainer}>
        <ArticleList
          articles={articles}
          tagColorMap={tagColorMap}
          onArticleClick={handleArticleClick}
        />
      </div>

      <Modal
        title={articleDetail?.title}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        modalRender={(modal) => (
          <div style={{ maxHeight: "100vh" }}>{modal}</div>
        )}
      >
        {articleDetail && (
          <ArticleEditor
            title={articleDetail.title}
            value={articleDetail.content}
            readonly={true}
            cover_url={""}
          />
        )}
      </Modal>
    </div>
  );
}

export default List;
