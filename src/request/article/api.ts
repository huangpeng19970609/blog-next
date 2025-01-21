import { COMCOS, request } from "@/request";
import { getFolderList, getInitFolder } from "../folder/api";

export function createArticle({
  content,
  title,
  folderId,
}: {
  content: string;
  title: string;
  folderId?: string;
}) {
  // const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

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

export function deleteArticle(id: string) {
  return request({
    url: COMCOS.BaseURL + `/article/${id}`,
    method: "DELETE",
  });
}

export function getArticleDetail({ id }: { id: string }) {
  return request({
    url: COMCOS.BaseURL + `/article/detail?id=${id}`,
    method: "GET",
  });
}

export function updateArticle({
  id,
  content,
  title,
}: {
  id: string;
  content: string;
  title: string;
}) {
  return request({
    url: COMCOS.BaseURL + `/article/${id}`,
    method: "PUT",
    data: { content, title },
  });
}
