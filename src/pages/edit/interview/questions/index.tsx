import { Table, Button, Space, Modal } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchForm from "../components/SearchForm";
import { getQuestionList, deleteQuestion } from "@/request/interview";
import { openNotification } from "@/utils/message";
import type { Question } from "@/type/request.interview";

export default function Questions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});

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
          <Button
            onClick={() => router.push(`/edit/interview/detail/${record.id}`)}
          >
            查看
          </Button>
          <Button
            onClick={() => router.push(`/edit/interview/edit/${record.id}`)}
          >
            编辑
          </Button>
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
        <Button
          type="primary"
          onClick={() => router.push("/edit/interview/questions/create")}
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
      />
    </div>
  );
}
