// 第三次封装 - 业务污染
import { Button, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import BytemdCmp from "./base/index";
import { COMCOS, request } from "@/request";
import { createArticle } from "@/request/article/api";
import styles from "./index.module.scss";
import { motion } from "framer-motion";

interface ArticleEditorProps {
  id?: string;
  readonly?: boolean;
  title?: string;
  value?: string;
  onChange?: (value: { title: string; content: string }) => void;
  onSuccess?: () => void;
}

export default function ArticleEditor({
  id,
  readonly = false,
  title: propsTitle,
  value: propsValue,
  onChange,
  onSuccess,
}: ArticleEditorProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>(propsTitle || "");
  const [value, setValue] = useState<string>(propsValue || "");

  // 合并两个useEffect为一个，并且监听整个value对象
  useEffect(() => {
    debugger;

    if (propsTitle) {
      setTitle(propsTitle);
    }
    if (propsValue) {
      setValue(propsValue);
    }
  }, [propsTitle, propsValue]);

  // 获取文章详情 (  若是传递了id 则代表搜索 )
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
        setValue(response.data.content);
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
          onChange={(e) => {
            const newTitle = e.target.value;
            setTitle(newTitle);
          }}
          disabled={readonly}
          className={styles.titleInput}
        />
        <BytemdCmp
          value={value}
          onUpload={handleUpload}
          readonly={readonly}
          isReadonly={readonly}
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
