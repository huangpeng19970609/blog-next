import BackButton from "@/components/back-button";
import React, { useState, useEffect } from "react";
import { Tree, Typography, Button, Divider, Steps, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  TagsOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  RightOutlined,
  NumberOutlined,
  FullscreenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { getQuestionsByCategory } from "@/request/interview";
import type { CategoryQuestions } from "@/type/request.interview";
import type { DataNode } from "antd/es/tree";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import ArticleEditor from "@/components/ArticleEditor";

const { Title, Text } = Typography;

const difficultyColors = {
  1: "#52c41a", // 简单 - 绿色
  2: "#faad14", // 中等 - 黄色
  3: "#ff4d4f", // 困难 - 红色
};

const iconColors = {
  category: "#1890ff", // 蓝色
  question: "#722ed1", // 紫色
  difficulty: "#eb2f96", // 粉色
  tags: "#13c2c2", // 青色
  answer: "#52c41a", // 绿色
};

const plugins = [gfm(), highlight()];

export default function Interview() {
  const [categoryQuestions, setCategoryQuestions] = useState<
    CategoryQuestions[]
  >([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

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
            setSelectedKeys([`question-${firstQuestion.id}`]);
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

  // 获取当前分类的所有题目
  const getCurrentCategoryQuestions = () => {
    if (!selectedQuestion) return [];
    const currentCategory = categoryQuestions.find(
      (cat) => cat.category.id === selectedQuestion.category.id
    );
    return currentCategory?.questions || [];
  };

  // 获取所有题目的扁平列表
  const getAllQuestions = () => {
    return categoryQuestions.flatMap((cat) => cat.questions);
  };

  // 获取当前题目在所有题目中的索引
  const getCurrentGlobalIndex = () => {
    const allQuestions = getAllQuestions();
    return allQuestions.findIndex((q) => q.id === selectedQuestion?.id);
  };

  // 处理下一题
  const handleNextQuestion = () => {
    const currentCategoryQuestions = getCurrentCategoryQuestions();
    const currentQuestionIndex = currentCategoryQuestions.findIndex(
      (q) => q.id === selectedQuestion?.id
    );

    if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
      // 当前分类还有下一题
      const nextQuestion = currentCategoryQuestions[currentQuestionIndex + 1];
      setSelectedQuestion(nextQuestion);
      setSelectedKeys([`question-${nextQuestion.id}`]);
      setShowAnswer(false);
    } else {
      // 需要跳转到下一个分类的第一题
      const currentCategoryIndex = categoryQuestions.findIndex(
        (cat) => cat.category.id === selectedQuestion?.category.id
      );

      if (currentCategoryIndex < categoryQuestions.length - 1) {
        const nextCategory = categoryQuestions[currentCategoryIndex + 1];
        const nextQuestion = nextCategory.questions[0];
        setSelectedQuestion(nextQuestion);
        setSelectedKeys([`question-${nextQuestion.id}`]);
        // 收起当前分类，展开下一个分类
        setExpandedKeys([`category-${nextCategory.category.id}`]);
        setShowAnswer(false);
      }
    }
  };

  // 修改 getLimitedTreeData 函数，移除题目数量限制
  const getTreeData = (): DataNode[] => {
    return categoryQuestions.map((category) => ({
      key: `category-${category.category.id}`,
      title: (
        <span>
          <FolderOutlined style={{ color: iconColors.category }} />{" "}
          {category.category.name}
        </span>
      ),
      children: category.questions.map((question, questionIndex) => ({
        key: `question-${question.id}`,
        title: (
          <span>
            <NumberOutlined
              style={{
                color: iconColors.question,
                backgroundColor: "#f0f5ff",
                padding: "4px",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <Text strong>{questionIndex + 1}.</Text> {question.title}
          </span>
        ),
        isLeaf: true,
        question: question,
      })),
    }));
  };

  // 添加一个新的函数来获取当前要显示的步骤项
  const getCurrentSteps = () => {
    if (!selectedQuestion) return [];

    const currentCategoryQuestions = getCurrentCategoryQuestions();
    const currentIndex = currentCategoryQuestions.findIndex(
      (q) => q.id === selectedQuestion.id
    );

    // 如果题目数量超过10个，使用滑动窗口显示题目
    if (currentCategoryQuestions.length > 10) {
      const windowSize = 10;
      const middlePosition = 4;

      let startIndex = currentIndex - middlePosition;

      if (startIndex < 0) {
        startIndex = 0;
      } else if (startIndex + windowSize > currentCategoryQuestions.length) {
        startIndex = currentCategoryQuestions.length - windowSize;
      }

      // 返回切片的题目，但保留原始索引
      return currentCategoryQuestions
        .slice(startIndex, startIndex + windowSize)
        .map((q) => ({
          ...q,
          // 使用在完整列表中的实际索引
          absoluteIndex:
            currentCategoryQuestions.findIndex((item) => item.id === q.id) + 1,
        }));
    }

    // 对于少于10题的情况，同样添加绝对索引
    return currentCategoryQuestions.map((q, i) => ({
      ...q,
      absoluteIndex: i + 1,
    }));
  };

  // 获取当前题目在显示列表中的索引
  const getCurrentStepIndex = () => {
    const steps = getCurrentSteps();
    return steps.findIndex((q) => q.id === selectedQuestion?.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.backButton}>
          <BackButton />
        </div>
        <Tree
          treeData={getTreeData()}
          showLine
          switcherIcon={<DownOutlined />}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onExpand={(newExpandedKeys) => setExpandedKeys(newExpandedKeys)}
          onSelect={(newSelectedKeys, info) => {
            const node = info.node as any;
            if (node.question) {
              setSelectedQuestion(node.question);
              setSelectedKeys(newSelectedKeys);
              setShowAnswer(false);
            }
          }}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.navigationHeader}>
          <motion.div
            key={selectedQuestion?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Steps
              size="small"
              current={getCurrentStepIndex()}
              items={getCurrentSteps().map((q) => ({
                title: `题 ${q.absoluteIndex}`,
                description: q.category.name,
              }))}
              style={{
                padding: "0 20px",
              }}
              onChange={(current) => {
                const questions = getCurrentSteps();
                if (questions[current]) {
                  setSelectedQuestion(questions[current]);
                  setSelectedKeys([`question-${questions[current].id}`]);
                  setShowAnswer(false);
                }
              }}
            />
          </motion.div>
        </div>

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
                  <DashboardOutlined style={{ color: iconColors.difficulty }} />{" "}
                  难度：
                  <Text
                    style={{
                      color: difficultyColors[selectedQuestion.difficulty],
                      fontWeight: "bold",
                    }}
                  >
                    {["简单", "中等", "困难"][selectedQuestion.difficulty - 1]}
                  </Text>
                </Text>
                <Divider type="vertical" />
                {selectedQuestion.tags.length > 0 && (
                  <Text>
                    <TagsOutlined style={{ color: iconColors.tags }} /> 标签：
                    {selectedQuestion.tags.map((tag, index) => (
                      <React.Fragment key={tag.name}>
                        <Text
                          className={styles.tag}
                          style={{
                            backgroundColor: "#f0f5ff",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            margin: "0 4px",
                            color: "#1890ff",
                          }}
                        >
                          {tag.name}
                        </Text>
                        {index < selectedQuestion.tags.length - 1 && " "}
                      </React.Fragment>
                    ))}
                  </Text>
                )}
              </div>
              <Divider />
              <div className={styles.answerContainer}>
                <div className={styles.answerHeader}>
                  <Text strong>
                    <CheckCircleOutlined style={{ color: iconColors.answer }} />{" "}
                    答：
                  </Text>
                  <div className={styles.answerActions}>
                    <Button
                      type={showAnswer ? "primary" : "default"}
                      icon={
                        showAnswer ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                      onClick={() => setShowAnswer(!showAnswer)}
                      style={{
                        borderRadius: "6px",
                        background: showAnswer ? "#1890ff" : "#fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginRight: "8px",
                      }}
                    >
                      {showAnswer ? "隐藏答案" : "查看答案"}
                    </Button>
                    <Button
                      icon={<FullscreenOutlined />}
                      onClick={() => setIsFullscreenMode(true)}
                      style={{
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      全屏查看
                    </Button>
                  </div>
                </div>
                <motion.div
                  className={styles.answer}
                  onClick={() => setShowAnswer(true)}
                  animate={{
                    filter: showAnswer ? "blur(0px)" : "blur(5px)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <ArticleEditor
                    value={selectedQuestion.content}
                    readonly={true}
                    isHiddenTitle={true}
                  />
                </motion.div>
              </div>

              <div
                className={styles.navigationFooter}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "16px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Button
                  type="primary"
                  onClick={handleNextQuestion}
                  disabled={
                    getCurrentGlobalIndex() === getAllQuestions().length - 1
                  }
                  icon={<RightOutlined />}
                  style={{
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  下一题
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.placeholder}
            >
              <Text type="secondary" style={{ fontSize: "16px" }}>
                <QuestionCircleOutlined
                  style={{ color: iconColors.question, marginRight: "8px" }}
                />
                👈 请从左侧选择一道面试题
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 全屏模态框 */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <QuestionCircleOutlined style={{ color: iconColors.question }} />
            <span>{selectedQuestion?.title}</span>
          </div>
        }
        open={isFullscreenMode}
        onCancel={() => setIsFullscreenMode(false)}
        width="90vw"
        style={{ top: 20 }}
        footer={null}
      >
        <div className={styles.fullscreenContent}>
          <div className={styles.questionMeta} style={{ marginBottom: "24px" }}>
            <Text>
              <DashboardOutlined style={{ color: iconColors.difficulty }} />{" "}
              难度：
              <Text
                style={{
                  color: difficultyColors[selectedQuestion?.difficulty || 1],
                  fontWeight: "bold",
                }}
              >
                {
                  ["简单", "中等", "困难"][
                    selectedQuestion?.difficulty - 1 || 0
                  ]
                }
              </Text>
            </Text>
            <Divider type="vertical" />
            {selectedQuestion?.tags.length > 0 && (
              <Text>
                <TagsOutlined style={{ color: iconColors.tags }} /> 标签：
                {selectedQuestion?.tags.map((tag, index) => (
                  <React.Fragment key={tag.name}>
                    <Text
                      className={styles.tag}
                      style={{
                        backgroundColor: "#f0f5ff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        margin: "0 4px",
                        color: "#1890ff",
                      }}
                    >
                      {tag.name}
                    </Text>
                    {index < selectedQuestion.tags.length - 1 && " "}
                  </React.Fragment>
                ))}
              </Text>
            )}
          </div>

          <Divider orientation="left">
            <Text strong style={{ fontSize: "16px" }}>
              <CheckCircleOutlined style={{ color: iconColors.answer }} />{" "}
              答案详解
            </Text>
          </Divider>

          <div className={styles.fullscreenAnswer}>
            <ArticleEditor
              value={selectedQuestion?.content || ""}
              readonly={true}
              isHiddenTitle={true}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
