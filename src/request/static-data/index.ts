import axios from "axios";
import { COMCOS } from "..";

// 基础概览数据接口
export interface IOverview {
  user_count: number;
  article_count: number;
  published_article_count: number;
  folder_count: number;
  question_count: number;
  new_user_count_week: number;
  new_article_count_week: number;
}

// 文章数据接口
export interface IArticleStatusDistribution {
  [key: string]: number;
}

export interface IArticleItem {
  id: number | string;
  title: string;
  view_count: number;
  created_at: string;
  status?: string;
}

export interface IArticles {
  status_distribution: IArticleStatusDistribution;
  top_articles: IArticleItem[];
  recent_articles: IArticleItem[];
}

// 文件夹数据接口
export interface IFolderItem {
  id: number | string;
  name: string;
  article_count: number;
}

export interface IFolders {
  top_folders: IFolderItem[];
}

// 用户数据接口
export interface IUserItem {
  id: number | string;
  username: string;
  article_count: number;
}

export interface IUsers {
  top_active_users: IUserItem[];
}

// 面试题相关统计接口
export interface IDifficultyDistribution {
  简单: number;
  中等: number;
  困难: number;
}

export interface ICategoryDistribution {
  [key: string]: number;
}

export interface IQuestionItem {
  id: number | string;
  title: string;
  view_count: number;
  like_count: number;
}

export interface IQuestions {
  difficulty_distribution: IDifficultyDistribution;
  category_distribution: ICategoryDistribution;
  top_questions: IQuestionItem[];
}

// 完整的汇总统计数据接口
export interface ISummaryStatistics {
  overview: IOverview;
  articles: IArticles;
  folders: IFolders;
  users: IUsers;
  questions: IQuestions | null;
}

// API响应接口
export interface IApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

// 获取汇总统计数据的方法
export const getSummaryStatistics = async (): Promise<
  IApiResponse<ISummaryStatistics>
> => {
  try {
    const response = await axios.get(COMCOS.BaseURL + "/static-data/summary");
    return response.data;
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return {
      code: 500,
      message: "获取统计数据失败",
      data: null,
    };
  }
};
