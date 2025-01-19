import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { message } from "antd";
import { IArticle, IFolder, IResponse } from "../type";

// 获得初始化文件夹结构数据
export function getInitFolder(): Promise<IResponse<IFolder>> {
  return request.get(COMCOS.BaseURL + "/folder/1");
}

// 获得指定文件夹的结构数据
export function getFolderList({
  id,
}: {
  id: string;
}): Promise<IResponse<IFolder>> {
  return request.get(COMCOS.BaseURL + `/folder/${id}`);
}

// 创建文档
export function createDocument(name: string, folderId: string) {
  if (!name) {
    message.error("请输入文档名称");
    return;
  }

  return request.post(COMCOS.BaseURL + "/folder/create", {
    name,
    parent_id: folderId,
  });
}

export function deleteFolder({ id }: { id: string }) {
  return request({
    url: COMCOS.BaseURL + `/folder/delete?id=${id}`,
    method: "DELETE",
  });
}
