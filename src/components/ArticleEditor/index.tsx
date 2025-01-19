import { Button, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import Bytemd from "@/components/BytemdComponent";
import { COMCOS, request } from "@/request";
import { createArticle } from "@/request/article/api";
import styles from "./index.module.scss";
import { motion } from "framer-motion";

interface ArticleEditorProps {
  id?: string;
  readonly?: boolean;
  onSuccess?: () => void;
}

export default function ArticleEditor({
  id,
  readonly = false,
  onSuccess,
}: ArticleEditorProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // 获取文章详情
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await request({
          url: `${COMCOS.BaseURL}/article/${id}`,
          method: "get",
        });

        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        message.error("获取文章失败");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 统一的上传处理函数
  const handleUpload = async (file: File | FormData) => {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    return await request({
      url: COMCOS.BaseURL + "/upload/image",
      data: formData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // 提交文章
  const handleSubmit = async () => {
    if (!title.trim()) {
      message.warning("请输入标题");
      return;
    }

    setLoading(true);
    try {
      await createArticle({
        content,
        title,
      });
      message.success("提交成功");
      onSuccess?.();
    } catch (error) {
      message.error("提交失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip="加载中...">
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          value={title}
          placeholder="请输入标题"
          onChange={(e) => setTitle(e.target.value)}
          disabled={readonly}
          className={styles.titleInput}
        />
        <Bytemd
          value={content}
          setValue={setContent}
          onUpload={handleUpload}
          readonly={readonly}
        />
        {!readonly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button type="primary" onClick={handleSubmit}>
              提交文章
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Spin>
  );
}
