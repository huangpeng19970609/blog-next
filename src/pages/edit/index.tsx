/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @Description: 文件上传组件
 */
import { Button, Layout, Table, Modal, Input, List, Menu } from "antd";
import { FolderOutlined, FileTextOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { openNotification } from "@/utils/message";
import { isVerifyToken } from "@/request/user";
import routes from "@/config/routes";
import dynamic from "next/dynamic";

const { Sider, Content } = Layout;

// 懒加载这些组件
const FolderManager = dynamic(() => import("./folder-manager"), {
  loading: () => <div>加载文件夹管理器中...</div>,
});

const Interview = dynamic(() => import("./interview"), {
  loading: () => <div>加载面试题管理器中...</div>,
});

const ArticleEditor = dynamic(() => import("@/components/ArticleEditor"), {
  loading: () => <div>加载编辑器中...</div>,
  ssr: false,
});

export default function TestLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedKey, setSelectedKey] = useState<string>("folder-manager");
  const [loading, setLoading] = useState(false);

  // 验证登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isVerifyToken();
      if (!isAuth) {
        openNotification("未登录或登录已过期", "请重新登录", "error");
        router.push("/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <div className={styles.layout}>
      <Content className={styles.content}>
        {selectedKey === "folder-manager" && <FolderManager />}
        {selectedKey === "interview" && <Interview />}
        {selectedKey === "articles" && (
          // 这里需要添加文章列表组件
          <div>文章列表</div>
        )}
        {selectedKey === "upload" && (
          <ArticleEditor
            cover_url=""
            readonly={false}
            onSuccess={() => {
              openNotification("文章创建成功", "文章创建成功", "success");
              setSelectedKey("articles");
            }}
          />
        )}
      </Content>
    </div>
  );
}
