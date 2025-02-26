export * from "./question";
export * from "./category";
export * from "./tag";

// 统一的类型定义
export type DifficultyLevel = 1 | 2 | 3; // 1-简单, 2-中等, 3-困难
export type QuestionStatus = "draft" | "published";

// 统一的错误处理
export const handleRequestError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "操作失败,请稍后重试";
};
