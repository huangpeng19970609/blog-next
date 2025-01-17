/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @Description: 文件上传组件
 */
import {
  Upload,
  message,
  Button,
  Layout,
  Table,
  Modal,
  Input,
  List,
  Menu,
} from "antd";
import {
  InboxOutlined,
  FolderAddOutlined,
  FileTextOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef, useState, useEffect } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import Bytemd from "@/components/BytemdComponent";
import { COMCOS, request } from "@/request";
import ArticleList from "@/pages/test/ArticleList";
import FolderManager from "@/pages/test/FolderManager";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const { Dragger } = Upload;
const { Sider, Content } = Layout;

export default function FileUpload() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [value, setValue] = useState<string>("");

  // 新增状态
  const [folders, setFolders] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const key = searchParams.get("key");
    if (key) {
      setSelectedKey(key);
    }
  }, [searchParams]);

  // 表格列定义
  const columns = [
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

  // 新建文件夹
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName]);
      setNewFolderName("");
      setIsModalVisible(false);
    }
  };

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

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      try {
        const response = await handleUpload(file as File);
        onSuccess?.(response, file as any);
      } catch (error) {
        onError?.(error as any);
      }
    },
    onChange(info) {
      const { status } = info.file;

      // 更新文件列表
      setFileList(info.fileList);

      if (status === "done") {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log("拖拽文件:", e.dataTransfer.files);
    },
  };

  // 添加下载处理函数
  const handleDownload = async (filename: string) => {
    const textContent = "";

    setValue(textContent as string);

    // 创建 Blob 对象
    // const blob = new Blob([response.data]);

    // 创建下载链接
    // const downloadUrl = window.URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = downloadUrl;
    // link.download = filename; // 设置下载文件名

    // // 触发下载
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // // 清理 URL 对象
    // window.URL.revokeObjectURL(downloadUrl);
  };

  const [title, setTitle] = useState<string>("默认标题");

  const commit = async () => {
    const response = await request({
      url: COMCOS.BaseURL + `/article`,
      method: "POST",
      data: {
        content: value,
        title,
      },
    });
  };

  // 添加菜单项点击处理
  const [selectedKey, setSelectedKey] = useState<string>("articles");

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    // 记录当前缓存数据
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
              label: "上传文件功能",
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
          <div className={styles.uploadContainer}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传，严禁上传公司数据或其他违禁文件
              </p>
            </Dragger>

            <Input
              value={title}
              placeholder="标题"
              onChange={(e) => setTitle(e.target.value)}
            />

            <Bytemd value={value} setValue={setValue} onUpload={handleUpload} />

            <Button type="primary" onClick={() => commit()}>
              提交至云端
            </Button>
          </div>
        )}
      </Content>
    </Layout>
  );
}
