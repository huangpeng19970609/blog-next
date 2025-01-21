import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { message } from "antd";
import {
  IArticle,
  IFolder,
  IResponse,
  NODE_TYPE,
} from "../../type/request.type";

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

export function deleteFolder(id: string) {
  return request({
    url: COMCOS.BaseURL + `/folder/${id}`,
    method: "DELETE",
  });
}

export function getCurrentFolderDetail(id?: string) {
  const init = async (folderId?: string) => {
    try {
      let res;

      if (!folderId) {
        res = await getInitFolder();
      } else {
        res = await getFolderList({ id: folderId });
      }

      if (res.code === 200) {
        const data = res.data;

        const folder = data.children.filter(
          (item) => item.type === NODE_TYPE.FOLDER
        );

        const article = data.children.filter(
          (item) => item.type === NODE_TYPE.ARTICLE
        );

        return {
          folder: folder || [],
          article: article || [],
          currentFolderId: res?.data.id as number,
          data: res.data,
        };
      }
    } catch (error) {}
  };
  return init(id);
}

// 编辑文件夹
export function editFolder(id: string, name: string) {
  return request({
    url: COMCOS.BaseURL + `/folder/${id}`,
    method: "PUT",
    data: {
      name,
    },
  });
}
