import { COMCOS, request } from "@/request";
import { getFolderList, getInitFolder } from "../folder/api";
import { ArticleListRequest, ArticleListResponse } from "@/type/request.type";

// 首页-获取最新
export function getLatestArticle() {
  return request<ArticleListResponse>({
    url: COMCOS.BaseURL + `/article/recent`,
    method: "GET",
  });
}

// 获取文章列表
export function getArticleList(
  params: ArticleListRequest = { page: 1, pageSize: 10 }
) {
  return request<ArticleListResponse>({
    url: COMCOS.BaseURL + `/article/list`,
    method: "GET",
    params,
  });
}

// 创建文章
export function createArticle({
  content,
  title,
  folderId,
}: {
  content: string;
  title: string;
  folderId?: string;
}) {
  return request({
    url: COMCOS.BaseURL + `/article/create`,
    method: "POST",
    data: {
      content,
      title,
      parent_id: folderId,
    },
  });
}

// 删除文章
export function deleteArticle(id: string) {
  return request({
    url: COMCOS.BaseURL + `/article/${id}`,
    method: "DELETE",
  });
}

export function getArticleDetail({ id }: { id: number }) {
  return request({
    url: `${COMCOS.BaseURL}/article/${id}`,
    method: "GET",
  });
}
// 更新文章
export function updateArticle({
  id,
  content,
  title,
  cover_url,
}: {
  id: string;
  content: string;
  title: string;
  cover_url?: string;
}) {
  return request({
    url: COMCOS.BaseURL + `/article/${id}`,
    method: "PUT",
    data: { content, title, cover_url },
  });
}

import { staticRequest } from "@/request";

export function getStaticArticleData(requestUrl: string) {
  return staticRequest({
    url: requestUrl,
    method: "GET",
    responseType: "text",
  }).then((val) => {
    return {
      content: val,
      title: requestUrl.replace(/^md\//, ""),
    };
  });
}
