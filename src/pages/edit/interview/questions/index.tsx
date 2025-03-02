import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
} from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchForm from "../components/SearchForm";
import {
  getQuestionList,
  deleteQuestion,
  createQuestion,
  updateQuestion,
} from "@/request/interview";
import { getAllCategories } from "@/request/interview/category";
import { getAllTags } from "@/request/interview/tag";
import { openNotification } from "@/utils/message";
import type { Question, Category, Tag } from "@/type/request.interview";
import BytemdBaseCmp from "@/components/ArticleEditor/base";

export default function Questions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [content, setContent] = useState("");

  const fetchQuestions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getQuestionList(params);
      if (res.code === 200) {
        setQuestions(res.data.items);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(searchParams);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          getAllCategories(),
          getAllTags(),
        ]);
        if (categoriesRes.code === 200) {
          setCategories(categoriesRes.data);
          if (categoriesRes.data.length > 0) {
            form.setFieldValue("categoryId", categoriesRes.data[0].id);
          }
        }
        if (tagsRes.code === 200) {
          setTags(tagsRes.data);
        }
      } catch (error) {
        console.error("获取分类或标签失败:", error);
      }
    };
    fetchData();
  }, [form]);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "删除后不可恢复,是否继续?",
      onOk: async () => {
        const res = await deleteQuestion(id);
        if (res.code === 200) {
          openNotification("成功", "删除成功", "success");
          fetchQuestions(searchParams);
        }
      },
    });
  };

  const handleOpenModal = async (
    mode: "create" | "edit" | "view",
    question?: Question
  ) => {
    setModalMode(mode);
    setIsModalOpen(true);

    if (question) {
      setCurrentQuestion(question);
      setContent(question.content);
      form.setFieldsValue({
        title: question.title,
        categoryId: question.category.id,
        tag_ids: question.tags.map((t) => t.id),
        difficulty: question.difficulty,
        status: question.status,
      });
    } else {
      setCurrentQuestion(null);
      setContent("");
      form.resetFields();
      if (categories.length > 0) {
        form.setFieldValue("categoryId", categories[0].id);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        content,
        category_id: values.categoryId,
        status: values.status || "draft",
      };

      let res;
      if (modalMode === "edit" && currentQuestion) {
        res = await updateQuestion(currentQuestion.id, data);
      } else {
        res = await createQuestion(data);
      }

      if (res?.code === 200) {
        openNotification(
          "成功",
          `${modalMode === "edit" ? "更新" : "创建"}成功`,
          "success"
        );
        handleCloseModal();
        fetchQuestions(searchParams);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContent("");
    form.resetFields();
    if (categories.length > 0) {
      form.setFieldValue("categoryId", categories[0].id);
    }
  };

  const columns = [
    { title: "标题", dataIndex: "title" },
    { title: "分类", dataIndex: ["category", "name"] },
    {
      title: "标签",
      dataIndex: "tags",
      render: (tags: any[]) => tags.map((t) => t.name).join(", "),
    },
    {
      title: "难度",
      dataIndex: "difficulty",
      render: (d: number) => ["简单", "中等", "困难"][d - 1],
    },
    {
      title: "操作",
      render: (_: any, record: Question) => (
        <Space>
          <Button onClick={() => handleOpenModal("view", record)}>查看</Button>
          <Button onClick={() => handleOpenModal("edit", record)}>编辑</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => handleOpenModal("create")}>
          新建题目
        </Button>
      </div>
      <SearchForm onSearch={setSearchParams} />
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={`${
          modalMode === "create"
            ? "新建"
            : modalMode === "edit"
            ? "编辑"
            : "查看"
        }题目`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        maskClosable={false}
        width={800}
        footer={
          modalMode !== "view" ? (
            <Button type="primary" onClick={() => form.submit()}>
              {modalMode === "edit" ? "更新" : "提交"}
            </Button>
          ) : null
        }
        bodyStyle={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          paddingRight: 16,
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          disabled={modalMode === "view"}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="categoryId" label="分类">
                <Select>
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tag_ids" label="标签">
                <Select mode="multiple" placeholder="请选择标签">
                  {tags.map((tag) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="difficulty" label="难度">
                <Select>
                  <Select.Option value={1}>简单</Select.Option>
                  <Select.Option value={2}>中等</Select.Option>
                  <Select.Option value={3}>困难</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="status" label="状态" initialValue="draft">
            <Radio.Group>
              <Radio value="draft">草稿</Radio>
              <Radio value="published">发布</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="内容" required>
            <BytemdBaseCmp
              value={content}
              onChange={(value) => setContent(value)}
              readonly={modalMode === "view"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
