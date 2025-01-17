import {
  Button,
  Card,
  Table,
  Row,
  Col,
  Modal,
  Input,
  message,
  Divider,
} from "antd";
import {
  FolderAddOutlined,
  FileAddOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
import { getInitFolder, createDocument } from "@/request/folder/api";

let allFolderContent = {};

// 添加文件夹接口定义
interface Folder {
  id: number;
  name: string;
  type: string;
}

export default function FolderManager() {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  // 修改 folders 的类型定义
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 文档列表数据结构
  interface Document {
    key: string;
    name: string;
    modifiedTime: string;
  }

  const [documents] = useState<Document[]>([]);

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "修改时间",
      dataIndex: "modifiedTime",
      key: "modifiedTime",
    },
    {
      title: "操作",
      key: "action",
      render: () => <Button type="link">编辑</Button>,
    },
  ];

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      message.error("文件夹名称不能为空！");
      return;
    }

    try {
      const response = await createDocument(newFolderName, currentFolderId);

      if (response.success) {
        setFolders([
          ...folders,
          { id: Date.now(), name: newFolderName, type: "folder" },
        ]);
        setNewFolderName("");
        setIsModalVisible(false);
        message.success("文件夹创建成功");
        // 重新获取文件夹列表
        init();
      } else {
        message.error(response.message || "创建失败");
      }
    } catch (error) {
      message.error("创建文件夹失败，请重试");
    }
  };

  const init = () => {
    getInitFolder().then((res) => {
      allFolderContent = res.data;
      // 直接设置返回的 children 数组
      setFolders(res.data.children);
      setCurrentFolderId(res.data.id);
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            我的空间
          </h2>
          <div>
            <Button
              type="primary"
              icon={<FolderAddOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ marginRight: 8 }}
            >
              新建文件夹
            </Button>
            <Button type="primary" icon={<FileAddOutlined />}>
              新建文件
            </Button>
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FolderOutlined style={{ marginRight: 8 }} />
            全部文件夹
          </h3>
          <Row gutter={[16, 16]}>
            {folders &&
              folders.map((folder, index) => (
                <Col span={4} key={folder.id}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "8px",
                      transition: "all 0.3s",
                    }}
                    bodyStyle={{ padding: "16px" }}
                  >
                    <FolderOutlined
                      style={{
                        fontSize: 40,
                        color: "#1890ff",
                        marginBottom: 12,
                        transition: "all 0.3s",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {folder.name}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>

        <Divider style={{ margin: "24px 0" }} />

        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            文档列表
          </h3>
          <Table
            columns={columns}
            dataSource={documents}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条`,
            }}
            style={{
              background: "#fff",
              borderRadius: "8px",
            }}
          />
        </div>
      </Card>

      <Modal
        title={
          <div
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 24px",
              marginLeft: -24,
              marginRight: -24,
              marginTop: -20,
            }}
          >
            新建文件夹
          </div>
        }
        open={isModalVisible}
        onOk={handleAddFolder}
        onCancel={() => {
          setNewFolderName("");
          setIsModalVisible(false);
        }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: "24px 0" }}>
          <Input
            placeholder="请输入文件夹名称"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            style={{ borderRadius: "4px" }}
          />
          <div style={{ marginTop: "8px", color: "#999" }}>
            当前位置: {allFolderContent[currentFolderId]?.name || "根目录"}
          </div>
        </div>
      </Modal>
    </div>
  );
}
