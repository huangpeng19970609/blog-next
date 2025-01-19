import { COMCOS, request } from "@/request";

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
