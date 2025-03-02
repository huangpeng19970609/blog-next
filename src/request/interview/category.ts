import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { openNotification } from "@/utils/message";
import {
  Category,
  CreateCategoryRequest,
  BaseResponse,
} from "@/type/request.interview";

// 获取所有分类
export function getAllCategories() {
  return request<BaseResponse<Category[]>>({
    url: COMCOS.BaseURL + COMCOS.InterViewPre + "/categories/list",
    method: "GET",
  });
}

// 创建分类
export function createCategory(data: CreateCategoryRequest) {
  if (!data.name) {
    openNotification("错误提示", "分类名称不能为空", "error");
    return;
  }

  return request<BaseResponse<Category>>({
    url: COMCOS.BaseURL + COMCOS.InterViewPre + "/categories/create",
    method: "POST",
    data,
  });
}

// 更新分类
export function updateCategory(
  id: number,
  data: Partial<CreateCategoryRequest>
) {
  return request<BaseResponse<Category>>({
    url: COMCOS.BaseURL + COMCOS.InterViewPre + `/categories/${id}`,
    method: "PUT",
    data,
  });
}

// 删除分类
export function deleteCategory(id: number) {
  return request<BaseResponse<null>>({
    url: COMCOS.BaseURL + COMCOS.InterViewPre + `/categories/${id}`,
    method: "DELETE",
  });
}
