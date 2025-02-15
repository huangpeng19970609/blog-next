// 第三次封装 - 业务污染
import { Button, Input, Spin, Divider } from "antd";
import { useEffect, useState } from "react";
import BytemdBaseCmp from "./base/index";
import { COMCOS, request } from "@/request";
import { createArticle, updateArticle } from "@/request/article/api";
import styles from "./index.module.scss";
import { motion } from "framer-motion";
import { openNotification } from "@/utils/message";

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
        openNotification("获取文章失败", "请稍后再试", "error");
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
      openNotification("请输入标题", "请输入标题", "error");
      return;
    }

    setLoading(true);

    let res;
    // 更新文章
    if (id) {
      res = await updateArticle({
        id: id.toString(),
        content: value,
        title,
      });
    }
    // 新建
    else {
      res = await createArticle({
        content: value,
        title,
      });
    }

    openNotification("提交成功", "提交成功", "success");
    onSuccess?.();

    setLoading(false);

    return res;
  };

  return (
    <Spin spinning={loading} tip="加载中..." style={{ width: "100%" }}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {readonly && <h3 className={styles.readonlyTitle}>{title}</h3>}

        {!readonly && (
          <Input
            value={title}
            placeholder="请输入标题"
            onChange={(e) => {
              const newTitle = e.target.value;
              setTitle(newTitle);
            }}
            className={styles.titleInput}
          />
        )}

        <Divider />
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
        <BytemdBaseCmp
          value={value}
          onUpload={handleUpload}
          readonly={readonly}
          isReadonly={readonly}
          onChange={(value: string) => setValue(value)}
        />
      </motion.div>
    </Spin>
  );
}
