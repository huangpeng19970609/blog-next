// 第三次封装 - 业务污染
import { Button, Input, Spin, Divider, Upload, message } from "antd";
import { useEffect, useState } from "react";
import BytemdBaseCmp from "./base/index";
import { COMCOS, request } from "@/request";
import { createArticle, updateArticle } from "@/request/article/api";
import styles from "./index.module.scss";
import { motion } from "framer-motion";
import { openNotification } from "@/utils/message";
import { PlusOutlined } from "@ant-design/icons";

interface ArticleEditorProps {
  id?: string; // 文章ID，用于编辑模式
  readonly?: boolean; // 是否为只读模式
  title?: string; // 文章标题
  value?: string; // 文章内容
  onChange?: (value: {
    title: string;
    content: string;
    coverUrl?: string;
  }) => void; // 修改回调，包含封面URL
  onSuccess?: () => void; // 提交成功回调
  cover_url?: string; // 封面图片URL
  isHiddenTitle?: boolean; // 新增属性
  // 新增属性用于控制是否显示操作按钮
  showActions?: boolean;
}

export default function ArticleEditor({
  id,
  readonly = true,
  title: propsTitle,
  value: propsValue,
  height,
  onChange,
  cover_url,
  isHiddenTitle = false, // 设置默认值
  showActions = true, // 默认显示操作按钮
}: ArticleEditorProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>(propsTitle || "");
  const [value, setValue] = useState<string>(propsValue || "");
  const [coverUrl, setCoverUrl] = useState<string>(
    cover_url || "/images/home/1.png"
  );
  const [tempFile, setTempFile] = useState<File | null>(null);

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
        setCoverUrl(response.data.cover_url);
      } catch (error) {
        openNotification("获取文章失败", "请稍后再试", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 移除提交文章的逻辑，只保留图片上传的通用功能
  const handleUpload = async (formData: FormData) => {
    return request({
      url: COMCOS.BaseURL + "/upload/image",
      data: formData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <Spin spinning={loading} tip="加载中...">
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* 只在不隐藏标题时显示标题容器 */}
        {!isHiddenTitle && (
          <>
            <div className={styles.titleContainer}>
              <div
                className={styles.titleBackground}
                style={{
                  backgroundImage: `url(${coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className={styles.titleContent}>
                {readonly ? (
                  <h3 className={styles.readonlyTitle}>{title || "无标题"}</h3>
                ) : (
                  <Input
                    value={title}
                    placeholder="请输入标题"
                    onChange={(e) => {
                      setTitle(e.target.value);
                      onChange?.({
                        title: e.target.value,
                        content: value,
                        coverUrl,
                      });
                    }}
                    className={styles.titleInput}
                  />
                )}
              </div>
            </div>
            <Divider />
          </>
        )}
        {/* 编辑模式操作按钮 - 只显示更换封面的功能 */}
        {!readonly && showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
          >
            {/* 移除 Upload 和封面预览相关代码 */}
          </motion.div>
        )}

        {/* Markdown 编辑器组件 */}
        <BytemdBaseCmp
          value={value}
          onUpload={handleUpload}
          readonly={readonly}
          onChange={(newValue: string) => {
            setValue(newValue);
            onChange?.({ title, content: newValue, coverUrl });
          }}
        />
      </motion.div>
    </Spin>
  );
}
