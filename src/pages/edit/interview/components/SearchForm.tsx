import { Form, Input, Select, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/request/interview";
import { getAllTags } from "@/request/interview";
import type { Category, Tag } from "@/type/request.interview";

interface SearchFormProps {
  onSearch: (values: any) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    // 获取所有分类和标签
    const fetchData = async () => {
      const [categoriesRes, tagsRes] = await Promise.all([
        getAllCategories(),
        getAllTags(),
      ]);
      if (categoriesRes.code === 200) {
        setCategories(categoriesRes.data);
      }
      if (tagsRes.code === 200) {
        setTags(tagsRes.data);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item name="keyword">
        <Input placeholder="搜索题目标题" />
      </Form.Item>
      <Form.Item name="category_id">
        <Select
          placeholder="选择分类"
          style={{ width: 120 }}
          allowClear
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
        />
      </Form.Item>
      <Form.Item name="tag_id">
        <Select
          placeholder="选择标签"
          style={{ width: 120 }}
          allowClear
          mode="multiple"
          options={tags.map((t) => ({ label: t.name, value: t.id }))}
        />
      </Form.Item>
      <Form.Item name="difficulty">
        <Select
          placeholder="难度"
          style={{ width: 100 }}
          allowClear
          options={[
            { label: "简单", value: 1 },
            { label: "中等", value: 2 },
            { label: "困难", value: 3 },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
