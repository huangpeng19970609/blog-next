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
  onChange?: (value: { title: string; content: string }) => void; // 内容变更回调
  onSuccess?: () => void; // 提交成功回调
  cover_url?: string; // 封面图片URL
}

export default function ArticleEditor({
  id,
  readonly = true,
  title: propsTitle,
  value: propsValue,
  onChange,
  onSuccess,
  cover_url,
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

  // 处理 Bytemd 编辑器的图片上传
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

  // 处理封面图片选择
  const handleCoverSelect = (file: File) => {
    if (!file) return false;

    // 验证文件类型
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("请上传图片文件");
      return false;
    }

    setTempFile(file);
    setCoverUrl(URL.createObjectURL(file));
    return false; // 阻止 Upload 组件自动上传
  };

  // 提交文章
  const handleSubmit = async () => {
    if (!title.trim()) {
      openNotification("请输入标题", "请输入标题", "error");
      return;
    }

    setLoading(true);
    try {
      let finalCoverUrl = coverUrl;

      // 如果有新选择的图片，先上传图片
      if (tempFile) {
        const formData = new FormData();
        formData.append("file", tempFile);

        const uploadResponse = await request({
          url: COMCOS.BaseURL + "/upload/image",
          data: formData,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // 使用返回的 filename 作为 cover_url
        finalCoverUrl = uploadResponse.data.url;
      }

      // 更新文章
      if (id) {
        await updateArticle({
          id: id.toString(),
          content: value,
          title,
          cover_url: finalCoverUrl,
        });
      }
      // 新建
      else {
        await createArticle({
          content: value,
          title,
        });
      }

      openNotification("提交成功", "提交成功", "success");
      onSuccess?.();
    } catch (error) {
      openNotification("提交失败", "请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip="加载中..." style={{ width: "100%" }}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* 统一的标题容器 */}
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
                onChange={(e) => setTitle(e.target.value)}
                className={styles.titleInput}
              />
            )}
          </div>
        </div>
        <Divider />
        {/* 编辑模式操作按钮 */}
        {!readonly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleCoverSelect}
            >
              <Button icon={<PlusOutlined />}>
                {coverUrl ? "更换封面" : "上传封面"}
              </Button>
            </Upload>
            {coverUrl && (
              <img
                src={coverUrl}
                alt="封面预览"
                style={{
                  marginLeft: "16px",
                  height: "32px",
                  borderRadius: "4px",
                }}
              />
            )}
            <Button type="primary" onClick={handleSubmit}>
              提交文章
            </Button>
          </motion.div>
        )}

        {/* Markdown 编辑器组件 */}
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
