import { request } from "@/request";
import { COMCOS } from "@/request/index";
import { openNotification } from "@/utils/message";
import {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionQueryParams,
  BaseResponse,
  PaginatedResponse,
} from "@/type/request.interview";

// 获取问题列表
export function getQuestionList(params: QuestionQueryParams = {}) {
  return request<BaseResponse<PaginatedResponse<Question>>>({
    url: COMCOS.BaseURL + "/questions/list",
    method: "GET",
    params,
  });
}

// 获取问题详情
export function getQuestionDetail(id: number) {
  return request<BaseResponse<Question>>({
    url: COMCOS.BaseURL + `/questions/${id}`,
    method: "GET",
  });
}

// 创建问题
export function createQuestion(data: CreateQuestionRequest) {
  if (!data.title || !data.content || !data.category_id) {
    openNotification("错误提示", "标题、内容和分类不能为空", "error");
    return;
  }

  return request<BaseResponse<Question>>({
    url: COMCOS.BaseURL + "/questions/create",
    method: "POST",
    data,
  });
}

// 更新问题
export function updateQuestion(id: number, data: UpdateQuestionRequest) {
  return request<BaseResponse<Question>>({
    url: COMCOS.BaseURL + `/questions/${id}`,
    method: "PUT",
    data,
  });
}

// 删除问题
export function deleteQuestion(id: number) {
  return request<BaseResponse<null>>({
    url: COMCOS.BaseURL + `/questions/${id}`,
    method: "DELETE",
  });
}

// 点赞问题
export function likeQuestion(id: number) {
  return request<BaseResponse<{ like_count: number }>>({
    url: COMCOS.BaseURL + `/questions/${id}/like`,
    method: "POST",
  });
}
