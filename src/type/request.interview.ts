// 基础响应接口
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pages: number;
  current_page: number;
}

// 类别相关接口
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

// 标签相关接口
export interface Tag {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export interface BatchCreateTagsRequest {
  tags: CreateTagRequest[];
}

// 题目相关接口
export interface Question {
  id: number;
  title: string;
  content: string;
  category: Category;
  difficulty: 1 | 2 | 3; // 1-简单, 2-中等, 3-困难
  tags: Tag[];
  answer?: string;
  view_count: number;
  like_count: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  category_id: number;
  difficulty?: number;
  answer?: string;
  status?: "draft" | "published";
  tag_ids?: number[];
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  category_id?: number;
  difficulty?: number;
  answer?: string;
  status?: "draft" | "published";
  tag_ids?: number[];
}

// 新增分类题目列表接口
export interface CategoryQuestions {
  category: Category;
  questions: Question[];
}

// 修改 QuestionQueryParams，添加新的可选参数
export interface QuestionQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  difficulty?: number;
  tag_id?: number;
  status?: "draft" | "published";
}
