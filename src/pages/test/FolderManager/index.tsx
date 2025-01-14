import { Button, List, Modal, Input, message } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function FolderManager() {
  const [folders, setFolders] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName]);
      setNewFolderName("");
      setIsModalVisible(false);
      message.success("文件夹创建成功");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Button
        type="primary"
        icon={<FolderAddOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "16px" }}
      >
        新建文件夹
      </Button>

      <List
        bordered
        dataSource={folders}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />

      <Modal
        title="新建文件夹"
        open={isModalVisible}
        onOk={handleAddFolder}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="请输入文件夹名称"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
