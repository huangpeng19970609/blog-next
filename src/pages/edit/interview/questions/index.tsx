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
  Spin,
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
import dynamic from "next/dynamic";

// 懒加载问题编辑器组件
const QuestionEditor = dynamic(
  () => import("@/page-components/components/QuestionEditor"),
  {
    loading: () => (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin tip="加载编辑器中..." />
      </div>
    ),
    ssr: false,
  }
);

export default function Questions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [content, setContent] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [shouldInit, setShouldInit] = useState(false);

  const fetchQuestions = async (params = {}) => {
    if (!shouldInit) return;

    setLoading(true);
    try {
      const res = await getQuestionList({
        ...params,
        page: pagination.current,
        per_page: pagination.pageSize,
      });
      if (res.code === 200) {
        setQuestions(res.data.items);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total,
        }));
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

    const element = document.getElementById("questions-container");
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
      fetchQuestions(searchParams);
    }
  }, [shouldInit, searchParams, pagination.current, pagination.pageSize]);

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
  }, []);

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

  const getLastFormValues = () => {
    try {
      const stored = localStorage.getItem("lastQuestionFormValues");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  };

  const saveFormValues = (values: any) => {
    try {
      const toSave = {
        categoryId: values.categoryId,
        tag_ids: values.tag_ids,
        difficulty: values.difficulty,
      };
      localStorage.setItem("lastQuestionFormValues", JSON.stringify(toSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleOpenModal = async (
    mode: "create" | "edit" | "view",
    question?: Question
  ) => {
    setModalMode(mode);
    setShowEditor(true);
    if (question) {
      setCurrentQuestion(question);
    } else {
      setCurrentQuestion(null);
      const lastValues = getLastFormValues();
      if (lastValues && mode === "create") {
        form.setFields([
          { name: "categoryId", value: lastValues.categoryId },
          { name: "tag_ids", value: lastValues.tag_ids },
          { name: "difficulty", value: lastValues.difficulty },
        ]);
      } else if (categories.length > 0) {
        form.setFieldValue("categoryId", categories[0].id);
      }
    }
  };

  const handleCloseModal = () => {
    setShowEditor(false);
    setContent("");
    form.resetFields();
    setCurrentQuestion(null);
    setModalMode("create");
    fetchQuestions(searchParams);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
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
    <div id="questions-container">
      {shouldInit && !showEditor ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => handleOpenModal("create")}
              disabled={loading}
            >
              新建题目
            </Button>
          </div>
          <SearchForm onSearch={setSearchParams} />
          <Table
            columns={columns}
            dataSource={questions}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }}
            scroll={{ y: "calc(100vh - 400px)", x: "100%" }}
            onChange={handleTableChange}
          />
        </>
      ) : showEditor ? (
        <QuestionEditor
          mode={modalMode}
          initialData={currentQuestion}
          categories={categories}
          tags={tags}
          onCancel={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
          }}
        />
      ) : null}
    </div>
  );
}
