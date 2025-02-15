enum NODE_TYPE {
  FOLDER = "FOLDER",
  ARTICLE = "FILE",
}

interface IResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface IFolder {
  children: (IFolder | IArticle)[];
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
  type: NODE_TYPE.FOLDER;
}

interface IArticle {
  id: number;
  name: string;
  type: NODE_TYPE.ARTICLE;
  content: string;
  // "2025-01-19T08:27:06"
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
}

export interface ArticleListResponse {
  code: number;
  current_page: number;
  data: Article[];
  pages: number;
  total: number;
}

export interface ArticleListRequest {
  page?: number;
  pageSize?: number;
}

export type { IResponse, IFolder, IArticle };

export { NODE_TYPE };
