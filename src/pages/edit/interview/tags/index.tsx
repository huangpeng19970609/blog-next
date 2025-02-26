import { Table, Button, Space, Modal, Form, Input, Tag as AntTag } from "antd";
import { useState, useEffect } from "react";
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} from "@/request/interview";
import { openNotification } from "@/utils/message";
import type { Tag } from "@/type/request.interview";

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  // 获取所有标签
  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await getAllTags();
      if (res.code === 200) {
        setTags(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // 打开编辑模态框
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setModalVisible(true);
  };

  // 打开新建模态框
  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 删除标签
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "删除标签将会解除与所有题目的关联,是否继续?",
      onOk: async () => {
        try {
          const res = await deleteTag(id);
          if (res.code === 200) {
            openNotification("成功", "标签删除成功", "success");
            fetchTags();
          }
        } catch (error) {
          openNotification("错误", "删除失败", "error");
        }
      },
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTag) {
        // 更新
        const res = await updateTag(editingTag.id, values);
        if (res.code === 200) {
          openNotification("成功", "标签更新成功", "success");
        }
      } else {
        // 创建
        const res = await createTag(values);
        if (res.code === 200) {
          openNotification("成功", "标签创建成功", "success");
        }
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const columns = [
    {
      title: "标签名称",
      dataIndex: "name",
      width: "25%",
      render: (text: string) => (
        <AntTag color={getRandomColor()}>{text}</AntTag>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: "20%",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "操作",
      width: "20%",
      render: (_: any, record: Tag) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          新建标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingTag ? "编辑标签" : "新建标签"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: "请输入标签名称" }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item name="description" label="标签描述">
            <Input.TextArea placeholder="请输入标签描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
