/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @Description: 文件上传组件
 */
import { Button, Layout, Table, Modal, Input, List, Menu } from "antd";
import { FolderOutlined, FileTextOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import ArticleEditor from "@/components/ArticleEditor";
import ArticleList from "@/pages/test/ArticleList";
import FolderManager from "@/pages/test/FolderManager";
import { useRouter, useSearchParams } from "next/navigation";
import { openNotification } from "@/utils/message";

const { Sider, Content } = Layout;

export default function FileUpload() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 保留必要的状态
  const [folders, setFolders] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("articles");

  useEffect(() => {
    const key = searchParams.get("key");
    if (key) {
      setSelectedKey(key);
    }
  }, [searchParams]);

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    router.push(`/test?key=${key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} theme="light" style={{ padding: "20px" }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: "upload",
              icon: <FolderOutlined />,
              label: "新建文章",
              onClick: () => handleMenuClick("upload"),
            },
            {
              key: "folders",
              icon: <FolderOutlined />,
              label: "文件夹管理",
              onClick: () => handleMenuClick("folders"),
            },
            {
              key: "articles",
              icon: <FileTextOutlined />,
              label: "文章列表",
              onClick: () => handleMenuClick("articles"),
            },
          ]}
        />
      </Sider>

      <Content style={{ padding: "20px" }}>
        {selectedKey === "folders" && (
          <FolderManager
            folders={folders}
            onAddFolder={() => setIsModalVisible(true)}
          />
        )}
        {selectedKey === "articles" && <ArticleList />}
        {selectedKey === "upload" && (
          <ArticleEditor
            onSuccess={() => {
              openNotification("文章创建成功", "文章创建成功", "success");
              handleMenuClick("articles");
            }}
          />
        )}
      </Content>
    </Layout>
  );
}
