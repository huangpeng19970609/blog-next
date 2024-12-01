import { message } from 'antd';
import getConfig from "next/config";

const baseUrl = getConfig().publicRuntimeConfig.BASE_URL;

/**
 * API 配置常量
 */
export const API_CONFIG = {
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
};

/**
 * HTTP 请求相关的提示信息
 */
const HTTP_MESSAGES = {
  TIMEOUT: (time: number) => `请求超时: ${time}ms`,
  UNKNOWN_ERROR: '发生未知错误',
  REQUEST_ERROR: '请求发生错误',
  REQUEST_FAILED: (status: number, statusText: string) => 
    `请求失败: ${status} ${statusText}`,
};

/**
 * HTTP 请求方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 请求配置接口，扩展自 RequestInit
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string>;  // URL 查询参数
  timeout?: number;                 // 超时时间
  responseType?: 'json' | 'text' | 'blob';  // 响应类型
}

/**
 * API 响应接口
 */
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * 自定义 HTTP 错误类
 */
class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * 原有的 commonFetch 函数
 */
export async function commonFetch<T>(url: string, options: RequestInit = {}) {
  url = baseUrl + url;

  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  };

  const fetchOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

/**
 * 新的请求函数
 */
async function request<T = any>(
  url: string,
  method: HttpMethod = 'GET',
  config: RequestConfig = {}
): Promise<T | null> {
  const {
    params,
    timeout = API_CONFIG.TIMEOUT,
    headers = {},
    responseType = 'json',
    ...restConfig
  } = config;

  const queryParams = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  const fullUrl = `${url}${queryParams}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      signal: controller.signal,
      ...restConfig,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = HTTP_MESSAGES.REQUEST_FAILED(
        response.status,
        response.statusText
      );
      message.error(errorMessage);
      return null;
    }

    let result: T;
    switch (responseType) {
      case 'text':
        result = await response.text() as T;
        break;
      case 'blob':
        result = await response.blob() as T;
        break;
      case 'json':
      default:
        result = await response.json();
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      message.error(error.message);
    } else if (error instanceof Error) {
      if (error.name === 'AbortError') {
        message.error(HTTP_MESSAGES.TIMEOUT(timeout));
      } else {
        message.error(error.message || HTTP_MESSAGES.REQUEST_ERROR);
      }
    } else {
      message.error(HTTP_MESSAGES.UNKNOWN_ERROR);
    }
    return null;
  }
}

/**
 * 导出便捷方法
 */
export const http = {
  get: <T>(url: string, config?: RequestConfig) => request<T>(url, 'GET', config),
  post: <T>(url: string, config?: RequestConfig) => request<T>(url, 'POST', config),
  put: <T>(url: string, config?: RequestConfig) => request<T>(url, 'PUT', config),
  delete: <T>(url: string, config?: RequestConfig) => request<T>(url, 'DELETE', config),
  patch: <T>(url: string, config?: RequestConfig) => request<T>(url, 'PATCH', config),
};
