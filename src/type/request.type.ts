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

export type { IResponse, IFolder, IArticle };

export { NODE_TYPE };
