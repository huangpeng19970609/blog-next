import { Table, TableProps } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { request } from "@/request";
import dynamic from "next/dynamic";

// 动态导入文章详情组件
const ArticleDetail = dynamic(() => import("../article-detail/[id]"), {
  ssr: false,
});

export interface Article {
  id: number;
  title: string;
  content?: string;
  [key: string]: any; // 允许其他属性
}

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

  const defaultColumns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
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
  }, []);

  const fetchArticles = async () => {
    const response = await request.get("/api/article/list");
    setArticles(response.data);
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
            pagination={false}
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
