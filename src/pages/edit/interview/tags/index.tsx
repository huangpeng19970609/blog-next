import { Table, Button, Space, Modal, Form, Input } from "antd";
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
  const [shouldInit, setShouldInit] = useState(false);

  const fetchTags = async () => {
    if (!shouldInit) return;

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldInit(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("tags-container");
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      setShouldInit(false);
    };
  }, []);

  useEffect(() => {
    if (shouldInit) {
      fetchTags();
    }
  }, [shouldInit]);

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
      let response;

      if (editingTag) {
        // 更新
        response = await updateTag(editingTag.id, values);
        if (response.code === 200) {
          openNotification("成功", "标签更新成功", "success");
        }
      } else {
        // 创建
        response = await createTag(values);
        if (response.code === 200) {
          openNotification("成功", "标签创建成功", "success");
        }
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  const columns = [
    {
      title: "标签名称",
      dataIndex: "name",
      width: "25%",
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
    <div id="tags-container">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          新建标签
        </Button>
      </div>

      {shouldInit ? (
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading}
        />
      ) : null}

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
