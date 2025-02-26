import { Table, Button, Space, Modal, Form, Input } from "antd";
import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/request/interview";
import { openNotification } from "@/utils/message";
import type { Category } from "@/type/request.interview";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 获取所有类别
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      if (res.code === 200) {
        setCategories(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 打开编辑模态框
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  // 打开新建模态框
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 删除类别
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "删除类别可能会影响相关题目,是否继续?",
      onOk: async () => {
        try {
          const res = await deleteCategory(id);
          if (res.code === 200) {
            openNotification("成功", "类别删除成功", "success");
            fetchCategories();
          }
        } catch (error) {
          openNotification(
            "错误",
            "删除失败,请确保没有题目使用此类别",
            "error"
          );
        }
      },
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        // 更新
        const res = await updateCategory(editingCategory.id, values);
        if (res.code === 200) {
          openNotification("成功", "类别更新成功", "success");
        }
      } else {
        // 创建
        const res = await createCategory(values);
        if (res.code === 200) {
          openNotification("成功", "类别创建成功", "success");
        }
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      width: "30%",
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
      render: (_: any, record: Category) => (
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
          新建类别
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? "编辑类别" : "新建类别"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="类别名称"
            rules={[{ required: true, message: "请输入类别名称" }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
          <Form.Item name="description" label="类别描述">
            <Input placeholder="请输入类别描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
