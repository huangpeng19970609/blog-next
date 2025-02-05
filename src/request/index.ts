import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { openNotification } from "@/utils/message";

enum COMCOS {
  BaseURL = "/api",
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: "", // API 基础路径
  timeout: 15000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      // 只有在 Content-Type 没有被指定时才设置默认值
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
  (response: AxiosResponse) => {
    // 假设后端返回的数据结构为 { code: number, data: any, message: string }
    const res = response.data;
    if (res.code === 200) {
      return res;
    }
    // 处理业务错误
    return res;
  },
  (error) => {
    // 统一错误处理
    let errorMessage = "网络错误，请稍后重试";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "未登录或登录已过期";
          // 可以在这里添加跳转到登录页的逻辑
          window.location.href = "/login";
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

export { instance as request, COMCOS };
