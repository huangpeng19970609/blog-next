import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { openNotification } from "@/utils/message";
import {
  Tag,
  CreateTagRequest,
  BatchCreateTagsRequest,
  BaseResponse,
} from "@/type/request.interview";

// 获取所有标签
export function getAllTags() {
  return request<BaseResponse<Tag[]>>({
    url: COMCOS.BaseURL + "/tags/list",
    method: "GET",
  });
}

// 创建单个标签
export function createTag(data: CreateTagRequest) {
  if (!data.name) {
    openNotification("错误提示", "标签名称不能为空", "error");
    return;
  }

  return request<BaseResponse<Tag>>({
    url: COMCOS.BaseURL + "/tags/create",
    method: "POST",
    data,
  });
}

// 批量创建标签
export function batchCreateTags(data: BatchCreateTagsRequest) {
  if (!data.tags?.length) {
    openNotification("错误提示", "标签列表不能为空", "error");
    return;
  }

  return request<BaseResponse<Tag[]>>({
    url: COMCOS.BaseURL + "/tags/batch-create",
    method: "POST",
    data,
  });
}

// 更新标签
export function updateTag(id: number, data: Partial<CreateTagRequest>) {
  return request<BaseResponse<Tag>>({
    url: COMCOS.BaseURL + `/tags/${id}`,
    method: "PUT",
    data,
  });
}

// 删除标签
export function deleteTag(id: number) {
  return request<BaseResponse<null>>({
    url: COMCOS.BaseURL + `/tags/${id}`,
    method: "DELETE",
  });
}
