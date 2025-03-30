import React, { useState, useEffect } from "react";
import { Input, Card, Alert, Typography, Spin, Button, Divider } from "antd";
import styles from "./json-page.module.scss";

const { TextArea } = Input;
const { Text, Title } = Typography;

export default function JsonPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [formattedJson, setFormattedJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 格式化JSON
  const formatJson = (input: string) => {
    if (!input.trim()) {
      setFormattedJson(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsed = JSON.parse(input);
      setFormattedJson(parsed);
      setError(null);
    } catch (err) {
      setFormattedJson(null);
      setError("JSON格式错误，请检查输入");
      console.error("JSON解析错误:", err);
    } finally {
      setLoading(false);
    }
  };

  // 当输入变化时处理
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
  };

  // 格式化按钮点击处理
  const handleFormat = () => {
    formatJson(jsonInput);
  };

  // 清空按钮点击处理
  const handleClear = () => {
    setJsonInput("");
    setFormattedJson(null);
    setError(null);
  };

  // 示例数据
  const loadExampleData = () => {
    const example = JSON.stringify(
      {
        name: "示例用户",
        age: 28,
        isActive: true,
        interests: ["编程", "阅读", "旅行"],
        contact: {
          email: "example@domain.com",
          phone: "123-456-7890",
        },
      },
      null,
      2
    );

    setJsonInput(example);
    formatJson(example);
  };

  // 递归渲染JSON对象
  const renderJsonValue = (value: any): React.ReactNode => {
    if (value === null) return <Text type="secondary">null</Text>;
    if (value === undefined) return <Text type="secondary">undefined</Text>;

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <div className={styles.jsonArray}>
            <Text className={styles.jsonBracket}>[</Text>
            <div className={styles.jsonArrayItems}>
              {value.map((item, index) => (
                <div key={index} className={styles.jsonArrayItem}>
                  {renderJsonValue(item)}
                  {index < value.length - 1 && (
                    <Text className={styles.jsonComma}>,</Text>
                  )}
                </div>
              ))}
            </div>
            <Text className={styles.jsonBracket}>]</Text>
          </div>
        );
      } else {
        return (
          <div className={styles.jsonObject}>
            <Text className={styles.jsonBracket}>{`{`}</Text>
            <div className={styles.jsonProperties}>
              {Object.entries(value).map(([key, val], index, array) => (
                <div key={key} className={styles.jsonProperty}>
                  <Text className={styles.jsonKey}>{`"${key}"`}</Text>
                  <Text className={styles.jsonColon}>: </Text>
                  {renderJsonValue(val)}
                  {index < array.length - 1 && (
                    <Text className={styles.jsonComma}>,</Text>
                  )}
                </div>
              ))}
            </div>
            <Text className={styles.jsonBracket}>{`}`}</Text>
          </div>
        );
      }
    } else if (typeof value === "string") {
      return <Text className={styles.jsonString}>{`"${value}"`}</Text>;
    } else if (typeof value === "number") {
      return <Text className={styles.jsonNumber}>{value}</Text>;
    } else if (typeof value === "boolean") {
      return <Text className={styles.jsonBoolean}>{value.toString()}</Text>;
    }

    return <Text>{value}</Text>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3}>JSON格式化与可视化工具</Title>
        <div className={styles.actions}>
          <Button onClick={loadExampleData}>加载示例</Button>
          <Button type="primary" onClick={handleFormat}>
            格式化
          </Button>
          <Button danger onClick={handleClear}>
            清空
          </Button>
        </div>
      </div>

      <Divider />

      <div className={styles.content}>
        <div className={styles.inputSection}>
          <Card title="JSON输入" bordered={false} className={styles.card}>
            <TextArea
              value={jsonInput}
              onChange={handleInputChange}
              placeholder="请在此处输入JSON字符串..."
              autoSize={{ minRows: 20, maxRows: 30 }}
              className={styles.textarea}
            />
          </Card>
        </div>

        <div className={styles.outputSection}>
          <Card title="格式化结果" bordered={false} className={styles.card}>
            {loading ? (
              <div className={styles.center}>
                <Spin tip="正在解析..." />
              </div>
            ) : error ? (
              <Alert message="错误" description={error} type="error" showIcon />
            ) : formattedJson ? (
              <div className={styles.jsonViewer}>
                {renderJsonValue(formattedJson)}
              </div>
            ) : (
              <div className={styles.placeholder}>
                <Text type="secondary">等待输入JSON...</Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
