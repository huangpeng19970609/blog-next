import {
  Button,
  Card,
  Table,
  Row,
  Col,
  Modal,
  Input,
  Divider,
  Breadcrumb,
  Space,
  Upload,
} from "antd";
import {
  FolderAddOutlined,
  FileAddOutlined,
  FolderOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
import {
  getInitFolder,
  createDocument,
  getFolderList,
  getCurrentFolderDetail,
  editFolder,
} from "@/request/folder/api";
import { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "@/request/article/api";
import { IArticle, NODE_TYPE } from "@/type/request.type";
import moment from "moment";
import { useRouter } from "next/router";
import ArticleEditor from "@/components/ArticleEditor";
import { deleteFolder } from "@/request/folder/api";
import styles from "./index.module.scss";
import { openNotification } from "@/utils/message";
import { request, COMCOS } from "@/request";

// 添加文件夹接口定义
interface Folder {
  id: number;
  name: string;
  type: string;
  children?: Folder[];
}

export default function FolderManager() {
  // 当前文件夹id
  const [currentFolderId, setCurrentFolderId] = useState<number>();
  // 修改 folders 的类型定义
  const [folders, setFolders] = useState<Folder[]>([]);
  // 创建文件夹的标题的弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 创建文件夹的名称
  const [newFolderName, setNewFolderName] = useState("");
  // 添加面包屑导航路径状态
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { title: string; id: string }[]
  >([{ title: "我的空间", id: "1" }]);

  const [articles, setArticles] = useState<IArticle[]>([]);

  const [previewArticle, setPreviewArticle] = useState<{
    visible: boolean;
    id?: number;
  }>({
    visible: false,
  });

  // 添加编辑状态控制
  const [editingArticle, setEditingArticle] = useState<{
    visible: boolean;
    id?: number;
  }>({
    visible: false,
  });

  // 添加编辑文件夹的状态
  const [editingFolder, setEditingFolder] = useState<{
    visible: boolean;
    id?: number;
    name?: string;
  }>({
    visible: false,
  });

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "修改时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) =>
        moment(created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: IArticle) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setPreviewArticle({ visible: true, id: record.id })}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditArticle(record.id)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteArticle(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const [currentFolderName, setCurrentFolderName] =
    useState<string>("全部文件夹");

  // 添加新的状态
  const [isNewFileModalVisible, setIsNewFileModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const router = useRouter();

  // 添加分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 修改 Table 组件的 pagination 配置
  const tableProps = {
    pagination: {
      ...pagination,
      showTotal: (total) => `共 ${total} 条`,
      onChange: (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
      },
    },
  };

  // 添加状态来存储当前编辑的文章数据
  const [currentArticleData, setCurrentArticleData] = useState<{
    title: string;
    content: string;
    coverUrl?: string;
    coverFile?: File;
  }>({
    title: "",
    content: "",
    coverUrl: "",
  });

  // 创建文件夹
  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      openNotification("文件夹名称不能为空！", "请输入文件夹名称", "error");
      return;
    }

    const response = await createDocument(newFolderName, currentFolderId);

    if (response.code === 200) {
      setFolders([
        ...folders,
        { id: Date.now(), name: newFolderName, type: "folder" },
      ]);
      setNewFolderName("");
      setIsModalVisible(false);
      openNotification("文件夹创建成功", "文件夹创建成功", "success");
      // 重新获取文件夹列表
      init(currentFolderId);
    } else {
      openNotification(response.message || "创建失败", "请稍后再试", "error");
    }
  };

  // 创建文件
  const handleAddFile = async () => {
    if (!newFileName.trim()) {
      openNotification("错误提示", "文件名称不能为空！", "error");
      return;
    }

    if (!currentFolderId) {
      openNotification("错误提示", "请先选择一个文件夹！", "error");
      return;
    }

    try {
      const response = await createArticle({
        content: "",
        title: newFileName,
        folderId: currentFolderId,
      });

      if (response.code === 200) {
        setNewFileName("");
        setIsNewFileModalVisible(false);
        openNotification("创建成功", "文件创建成功", "success");
        // 重新获取文件列表
        init();
      } else {
        openNotification("错误提示", response.message || "创建失败", "error");
      }
    } catch (error) {
      openNotification("错误提示", "创建文件失败，请重试", "error");
    }
  };

  const init = async (folderId?: string) => {
    const res = await getCurrentFolderDetail(folderId);

    if (res) {
      setFolders(res.folder || []);
      setArticles(res.article || []);
      setCurrentFolderId(res.currentFolderId as number);
      // 如果是新的文件夹，重置分页
      if (folderId !== currentFolderId?.toString()) {
        setPagination({ current: 1, pageSize: 10 });
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  // 处理文件夹点击事件
  const handleFolderClick = async (folder: Folder) => {
    const newBreadcrumbItems = [
      ...breadcrumbItems,
      { title: folder.name, id: folder.id.toString() },
    ];
    setBreadcrumbItems(newBreadcrumbItems);
    setCurrentFolderId(folder.id.toString());
    setCurrentFolderName(folder.name);

    // 直接获取新文件夹的内容
    await init(folder.id.toString());
  };

  // 处理面包屑导航点击
  const handleBreadcrumbClick = async (id: string, index: number) => {
    const newBreadcrumbItems = breadcrumbItems.slice(0, index + 1);
    setBreadcrumbItems(newBreadcrumbItems);
    setCurrentFolderId(id);
    setCurrentFolderName(
      newBreadcrumbItems[newBreadcrumbItems.length - 1].title
    );

    // 直接获取对应层级的内容
    await init(id);
  };

  // 修改按钮点击事件
  const handleNewFileClick = () => {
    setIsNewFileModalVisible(true);
  };

  // 添加删除文件夹的处理函数
  const handleDeleteFolder = async (folderId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个文件夹吗？删除后将无法恢复。",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          const res = await deleteFolder(folderId);
          if (res.code === 200) {
            openNotification("删除成功", "文件夹已成功删除", "success");
            init(currentFolderId);
          }
        } catch (error) {
          openNotification("错误提示", "删除失败", "error");
        }
      },
    });
  };

  // 添加删除文章的处理函数
  const handleDeleteArticle = (articleId: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这篇文章吗？删除后将无法恢复。",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          const res = await deleteArticle(articleId);
          if (res.code === 200) {
            openNotification("删除成功", "文章已成功删除", "success");
            init(currentFolderId);
          }
        } catch (error) {
          openNotification("错误提示", "删除失败", "error");
        }
      },
    });
  };

  // 修改编辑文章的处理函数
  const handleEditArticle = (articleId: number) => {
    setEditingArticle({
      visible: true,
      id: articleId,
    });
  };

  // 修改返回列表处理函数
  const handleBackToList = async () => {
    setEditingArticle({
      visible: false,
    });
    // 返回时重新获取当前文件夹的内容，并保持分页状态
    await init(currentFolderId?.toString());
  };

  // 添加编辑文件夹的处理函数
  const handleEditFolder = async () => {
    if (!editingFolder.name?.trim()) {
      openNotification("错误提示", "文件夹名称不能为空！", "error");
      return;
    }

    try {
      const response = await editFolder(
        editingFolder.id!.toString(),
        editingFolder.name
      );
      if (response.code === 200) {
        openNotification("修改成功", "文件夹修改成功", "success");
        setEditingFolder({ visible: false });
        // 重新获取文件夹列表
        init(currentFolderId?.toString());
      } else {
        openNotification("错误提示", response.message || "修改失败", "error");
      }
    } catch (error) {
      openNotification("错误提示", "修改文件夹失败，请重试", "error");
    }
  };

  const containerStyle: CSSProperties = {
    marginBottom: 24,
    opacity: 1,
    transition: "all 0.3s ease-in-out",
  };

  // 修改处理封面图片选择的函数
  const handleCoverSelect = async (file: File) => {
    if (!file) return false;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      openNotification("错误提示", "请上传图片文件", "error");
      return false;
    }

    // 使用 FileReader 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentArticleData((prev) => ({
        ...prev,
        coverUrl: e.target?.result as string,
        coverFile: file, // 保存文件对象以供后续上传
      }));
    };
    reader.readAsDataURL(file);

    return false;
  };

  // 修改提交处理函数
  const handleArticleSubmit = async () => {
    if (!currentArticleData.title.trim()) {
      openNotification("错误提示", "标题不能为空", "error");
      return;
    }

    try {
      let coverUrl = currentArticleData.coverUrl;

      // 如果有新的封面文件，先上传
      if (currentArticleData.coverFile) {
        const formData = new FormData();
        formData.append("file", currentArticleData.coverFile);

        const uploadResponse = await request({
          url: COMCOS.BaseURL + "/upload/image",
          data: formData,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.code === 200) {
          coverUrl = uploadResponse.data.url;
        } else {
          openNotification(
            "封面上传失败",
            uploadResponse.message || "请稍后重试",
            "error"
          );
          return;
        }
      }

      // 更新文章
      if (editingArticle.id) {
        await updateArticle({
          id: editingArticle.id.toString(),
          content: currentArticleData.content,
          title: currentArticleData.title,
          cover_url: coverUrl,
        });
      }

      openNotification("提交成功", "文章已保存", "success");
      handleBackToList();
    } catch (error) {
      openNotification("提交失败", "请稍后重试", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ padding: "0px", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Breadcrumb>
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={item.id}>
                <a onClick={() => handleBreadcrumbClick(item.id, index)}>
                  {item.title}
                </a>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {!editingArticle.visible && (
            <div>
              <Button
                type="primary"
                icon={<FolderAddOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ marginRight: 8 }}
              >
                新建文件夹
              </Button>
              <Button
                type="primary"
                icon={<FileAddOutlined />}
                onClick={handleNewFileClick}
              >
                新建文件
              </Button>
            </div>
          )}
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {editingArticle.visible ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                onClick={handleBackToList}
              >
                返回列表
              </Button>
              <div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleCoverSelect}
                  style={{ marginRight: 16 }}
                >
                  <Button icon={<PlusOutlined />}>
                    {currentArticleData.coverUrl ? "更换封面" : "上传封面"}
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={() => handleArticleSubmit()}
                  style={{ marginLeft: 8 }}
                >
                  提交文章
                </Button>
              </div>
            </div>
            {currentArticleData.coverUrl && (
              <div style={{ marginBottom: 16 }}>
                <img
                  src={currentArticleData.coverUrl}
                  alt="封面预览"
                  style={{
                    height: "100px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <ArticleEditor
              id={editingArticle.id?.toString()}
              readonly={false}
              onChange={(data) => {
                setCurrentArticleData((prev) => ({
                  ...prev,
                  title: data.title,
                  content: data.content,
                }));
              }}
            />
          </div>
        ) : (
          <>
            <motion.div
              style={containerStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                {currentFolderName}下的文件夹
              </h3>
              <Row gutter={[16, 16]}>
                {folders.map((folder) => (
                  <Col span={4} key={folder.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        hoverable
                        className={styles.card}
                        style={{
                          textAlign: "center",
                          borderRadius: "8px",
                          transition: "all 0.3s",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onClick={() => handleFolderClick(folder)}
                      >
                        <Space className={styles.folderIcons}>
                          <EditOutlined
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolder({
                                visible: true,
                                id: folder.id,
                                name: folder.name,
                              });
                            }}
                          />
                          <CloseCircleOutlined
                            onClick={(e) => handleDeleteFolder(folder.id, e)}
                          />
                        </Space>

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
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>

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
                {...tableProps}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                }}
                scroll={{ y: 300 }}
                columns={columns}
                dataSource={articles}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        title="新建文件夹"
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
            当前位置: {currentFolderName}
          </div>
        </div>
      </Modal>

      {/* 添加新建文件的 Modal */}
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
            新建文件
          </div>
        }
        open={isNewFileModalVisible}
        onOk={handleAddFile}
        onCancel={() => {
          setNewFileName("");
          setIsNewFileModalVisible(false);
        }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: "24px 0" }}>
          <Input
            placeholder="请输入文件名称"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            style={{ borderRadius: "4px" }}
          />
          <div style={{ marginTop: "8px", color: "#999" }}>
            当前位置: {currentFolderName}
          </div>
        </div>
      </Modal>

      {/* 添加预览文章的Modal */}
      <Modal
        title="文章预览"
        open={previewArticle.visible}
        footer={null}
        onCancel={() => setPreviewArticle({ visible: false })}
        width={800}
      >
        {previewArticle.id && (
          <ArticleEditor
            id={previewArticle.id.toString()}
            readonly
            cover_url={
              articles.find((article) => article.id === previewArticle.id)
                ?.cover_url
            }
          />
        )}
      </Modal>

      {/* 添加编辑文件夹的 Modal */}
      <Modal
        title="编辑文件夹"
        open={editingFolder.visible}
        onOk={handleEditFolder}
        onCancel={() => setEditingFolder({ visible: false })}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: "24px 0" }}>
          <Input
            placeholder="请输入文件夹名称"
            value={editingFolder.name}
            onChange={(e) =>
              setEditingFolder((prev) => ({ ...prev, name: e.target.value }))
            }
            style={{ borderRadius: "4px" }}
          />
          <div style={{ marginTop: "8px", color: "#999" }}>
            当前位置: {currentFolderName}
          </div>
        </div>
      </Modal>
    </div>
  );
}
