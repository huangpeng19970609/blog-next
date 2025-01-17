import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { message } from "antd";

// 获得初始化文件夹结构数据
export function getInitFolder() {
  return request.get(COMCOS.BaseURL + "/folder/1");
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
