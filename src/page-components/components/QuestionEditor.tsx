export const config = {
  unstable_excludeFiles: true,
};

import { Form, Input, Select, Radio, Row, Col, Button, Space } from "antd";
import { useState, useEffect } from "react";
import ArticleEditor from "@/components/ArticleEditor";
import { createQuestion, updateQuestion } from "@/request/interview";
import { openNotification } from "@/utils/message";
import type { Question, Category, Tag } from "@/type/request.interview";

interface QuestionEditorProps {
  mode: "create" | "edit" | "view";
  initialData: Question | null;
  categories: Category[];
  tags: Tag[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function QuestionEditor({
  mode,
  initialData,
  categories,
  tags,
  onCancel,
  onSuccess,
}: QuestionEditorProps) {
  const [form] = Form.useForm();
  const [content, setContent] = useState(initialData?.content || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || "");
    }

    if (mode === "create" && !initialData) {
      try {
        const savedValues = localStorage.getItem("lastQuestionFormValues");
        if (savedValues) {
          const parsedValues = JSON.parse(savedValues);
          form.setFieldsValue({
            categoryId: parsedValues.categoryId,
            tag_ids: parsedValues.tag_ids,
            difficulty: parsedValues.difficulty,
          });
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
  }, [initialData, mode, form]);

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

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        content: content,
        category_id: values.categoryId,
        status: values.status || "published",
      };

      if (mode === "create") {
        saveFormValues(values);
      }

      let res;
      if (mode === "edit" && initialData) {
        res = await updateQuestion(initialData.id, data);
      } else {
        res = await createQuestion(data);
      }

      if (res?.code === 200) {
        openNotification(
          "成功",
          `${mode === "edit" ? "更新" : "创建"}成功`,
          "success"
        );
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "450px" }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onCancel}>返回</Button>
        {mode !== "view" && (
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
          >
            {mode === "edit" ? "更新" : "提交"}
          </Button>
        )}
      </Space>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        disabled={mode === "view" || loading}
        initialValues={
          initialData
            ? {
                title: initialData.title,
                categoryId: initialData.category.id,
                tag_ids: initialData.tags.map((t) => t.id),
                difficulty: initialData.difficulty,
                status: initialData.status,
              }
            : {
                status: "published",
                difficulty: 1,
                categoryId: categories[0]?.id,
              }
        }
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

        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value="draft">草稿</Radio>
            <Radio value="published">发布</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      <div style={{ height: "400px" }}>
        <ArticleEditor
          isHiddenTitle={true}
          value={content}
          onChange={(value: { content: string }) => setContent(value.content)}
          readonly={mode === "view"}
          showActions={false}
        />
      </div>
    </div>
  );
}
