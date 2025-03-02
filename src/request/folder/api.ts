import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { openNotification } from "@/utils/message";
import {
  IArticle,
  IFolder,
  IResponse,
  NODE_TYPE,
} from "../../type/request.type";

// 获得初始化文件夹结构数据
export function getInitFolder(): Promise<IResponse<IFolder>> {
  return request({
    url: COMCOS.BaseURL + "/folder/1",
    method: "GET",
  });
}

// 获得指定文件夹的结构数据
export function getFolderList({
  id,
}: {
  id: string;
}): Promise<IResponse<IFolder>> {
  return request({
    url: COMCOS.BaseURL + `/folder/${id}`,
    method: "GET",
  });
}

// 创建文档
export function createDocument(name: string, folderId: string) {
  if (!name) {
    openNotification("错误提示", "请输入文档名称", "error");
    return;
  }

  return request({
    url: COMCOS.BaseURL + "/folder/create",
    method: "POST",
    data: {
      name,
      parent_id: folderId,
    },
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
