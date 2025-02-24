import { useEffect, useState } from "react";
import { request } from "@/request";
import { Spin } from "antd";
import { useRouter } from "next/router";
import ArticleEditor from "@/components/ArticleEditor";
import { getArticleDetail } from "@/request/article/api";

interface ArticleDetailProps {
  id: number;
}

export default function ArticleDetail({ id }: ArticleDetailProps) {
  const router = useRouter();
  const { id: idQuery } = router.query;
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("");

  const [cover_url, setCoverUrl] = useState<string>("");

  useEffect(() => {
    if (idQuery || id) {
      fetchArticleDetail();
    }
  }, [idQuery, id]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      const response = await getArticleDetail({ id: id || idQuery });
      setContent(response.data?.content || "");
      setTitle(response.data?.title || "");
      setCoverUrl(response.data?.cover_url || "");
    } catch (error) {
      console.error("获取文章详情失败:", error);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <ArticleEditor
      title={title}
      value={content}
      cover_url={cover_url}
      readonly={true}
    />
  );
}
