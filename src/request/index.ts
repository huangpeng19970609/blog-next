import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { openNotification } from "@/utils/message";
import { CONFIG } from "@/config";

const COMCOS = {
  BaseURL: "/api",
  UploadImagePrefix: "",
};

// 定义成功响应数据的接口
interface SuccessResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  // BaseURL 放于外部
  baseURL: "",
  timeout: 15000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      const originalContentType =
        config.headers?.["Content-Type"] || "application/json";

      config.headers = {
        Authorization: `Bearer ${token}`,
        ...config.headers, // 先合并已有头信息
        "Content-Type":
          originalContentType !== "multipart/form-data"
            ? originalContentType
            : undefined, // 如果是 multipart/form-data，则不设置 Content-Type
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  <T>(response: AxiosResponse<SuccessResponse<T>>) => {
    // 忽略前端的封装
    if (response.data.code === 200) {
      // 使用后端的返回封装
      return response.data as T; // 直接返回 data 并且断言类型为 T
    }
    return Promise.reject(response);
  },
  (error) => {
    let errorMessage = "网络错误，请稍后重试";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "未登录或登录已过期";
          break;
        case 403:
          errorMessage = "没有权限访问";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器错误";
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    }

    openNotification("错误提示", errorMessage, "error");
    return Promise.reject(error);
  }
);

// 封装 request 方法以支持泛型
function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return instance(config);
}

// 创建一个新的 axios 实例专门用于静态资源
const staticInstance: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 15000,
});

// 封装静态资源请求方法
async function staticRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  const res = await staticInstance(config);

  if (res.status === 200) {
    return res.data as T;
  }

  return Promise.reject(res);
}

export { request, staticRequest, COMCOS };
