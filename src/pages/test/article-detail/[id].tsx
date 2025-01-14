import { useEffect, useState } from "react";
import Bytemd from "@/components/BytemdComponent";
import { request } from "@/request";
import { Spin } from "antd";
import { useRouter } from "next/router";
import Content from "@/pages/blog/content";

interface ArticleDetailProps {
  id: number;
}

export default function ArticleDetail({ id }: ArticleDetailProps) {
  const router = useRouter();
  const { id: idQuery } = router.query;
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (idQuery || id) {
      fetchArticleDetail();
    }
  }, [idQuery, id]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/api/article/${id || idQuery}`);
      setContent(response.data?.content || "");
      setTitle(response.data?.title || "");
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

  return <Content title={title} value={content} isReadonly={true} />;
}
