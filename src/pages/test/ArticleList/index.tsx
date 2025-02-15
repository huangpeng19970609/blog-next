import { Table, TableProps } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Article } from "@/type/request.type";
import { getArticleList } from "@/request/article/api";

// 动态导入文章详情组件
const ArticleDetail = dynamic(() => import("../article-detail/[id]"), {
  ssr: false,
});

export interface ArticleListProps {
  loading?: boolean;
  onArticleClick?: (article: Article) => void;
  extraColumns?: any[]; // 允许外部添加额外的列
  tableProps?: Partial<TableProps<Article>>; // 允许传入其他 Table 属性
  extra?: ReactNode; // 额外的渲染内容
}

export default function ArticleList({
  loading,
  extraColumns = [],
  tableProps = {},
  extra,
}: ArticleListProps) {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const defaultColumns = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_: any, __: any, index: number) => {
        // 计算实际序号，考虑分页
        return (currentPage - 1) * 10 + index + 1;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
  ];

  const actionColumn = [
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Article) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setSelectedArticleId(record.id);
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      const response = await getArticleList({
        page: currentPage,
        pageSize: 10,
      });
      setArticles(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  const columns = [...defaultColumns, ...extraColumns, ...actionColumn];

  return (
    <div>
      {selectedArticleId ? (
        <div>
          <a onClick={() => setSelectedArticleId(null)}>返回列表</a>
          <ArticleDetail id={selectedArticleId} />
        </div>
      ) : (
        <>
          {extra}
          <Table
            columns={columns}
            dataSource={articles}
            pagination={{
              current: currentPage,
              total: total,
              onChange: (page) => setCurrentPage(page),
            }}
            rowKey="id"
            loading={loading}
            onRow={(record) => ({
              onClick: () => {
                setSelectedArticleId(record.id);
              },
            })}
            {...tableProps}
          />
        </>
      )}
    </div>
  );
}
