import BackButton from "@/components/back-button";
import React, { useState, useEffect } from "react";
import { Tree, Typography, Button, Divider } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { getQuestionsByCategory } from "@/request/interview";
import type { CategoryQuestions } from "@/type/request.interview";
import type { DataNode } from "antd/es/tree";
import { DownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const difficultyColors = {
  1: "#52c41a", // 简单 - 绿色
  2: "#faad14", // 中等 - 黄色
  3: "#ff4d4f", // 困难 - 红色
};

export default function Interview() {
  const [categoryQuestions, setCategoryQuestions] = useState<
    CategoryQuestions[]
  >([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestionsByCategory();
        if (res.code === 200) {
          setCategoryQuestions(res.data);
          if (res.data.length > 0 && res.data[0].questions.length > 0) {
            const firstQuestion = res.data[0].questions[0];
            setSelectedQuestion(firstQuestion);
            setShowAnswer(false);
            setDefaultSelectedKeys([`question-${firstQuestion.id}`]);
            setExpandedKeys([`category-${res.data[0].category.id}`]);
          }
        }
      } catch (error) {
        console.error("获取题目列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 转换数据为Tree所需的格式
  const treeData: DataNode[] = categoryQuestions.map((category) => ({
    key: `category-${category.category.id}`,
    title: category.category.name,
    children: category.questions.map((question, questionIndex) => ({
      key: `question-${question.id}`,
      title: `${questionIndex + 1}. ${question.title}`,
      isLeaf: true,
      question: question,
    })),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Tree
          loading={loading}
          treeData={treeData}
          showLine
          switcherIcon={<DownOutlined />}
          defaultSelectedKeys={defaultSelectedKeys}
          expandedKeys={expandedKeys}
          onExpand={(newExpandedKeys) => setExpandedKeys(newExpandedKeys)}
          onSelect={(_, info) => {
            const node = info.node as any;
            if (node.question) {
              setSelectedQuestion(node.question);
              setShowAnswer(false);
            }
          }}
        />
      </div>
      <div className={styles.right}>
        <BackButton />
        <AnimatePresence mode="wait">
          {selectedQuestion ? (
            <motion.div
              key={selectedQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.content}
            >
              <Title level={2}>
                {selectedQuestion.category.name} - {selectedQuestion.title}
              </Title>
              <div className={styles.questionMeta}>
                <Text>
                  难度：
                  <Text
                    style={{
                      color: difficultyColors[selectedQuestion.difficulty],
                    }}
                  >
                    {["简单", "中等", "困难"][selectedQuestion.difficulty - 1]}
                  </Text>
                </Text>
                <Divider type="vertical" />
                {selectedQuestion.tags.length > 0 && (
                  <Text>
                    标签：
                    {selectedQuestion.tags.map((tag, index) => (
                      <React.Fragment key={tag.name}>
                        <Text className={styles.tag}>{tag.name}</Text>
                        {index < selectedQuestion.tags.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </Text>
                )}
              </div>
              <Divider />
              <div className={styles.answerContainer}>
                <div className={styles.answerHeader}>
                  <Text strong>题目内容</Text>
                  <Button
                    type="text"
                    icon={
                      showAnswer ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? "隐藏答案" : "查看答案"}
                  </Button>
                </div>
                <motion.div
                  className={styles.answer}
                  onClick={() => setShowAnswer(true)}
                  style={{ cursor: "pointer" }}
                  animate={{
                    filter: showAnswer ? "blur(0px)" : "blur(5px)",
                    transition: { duration: 0.3 },
                  }}
                >
                  {selectedQuestion.content}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.placeholder}
            >
              <Text type="secondary">👈 请从左侧选择一道面试题</Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
