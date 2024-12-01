import { message } from 'antd';

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
}

/**
 * 通用请求配置接口，扩展自 RequestConfig
 */
interface CommonFetchConfig extends RequestConfig {
  responseType?: 'json' | 'text' | 'blob';  // 响应类型
  data?: any;  // 添加 data 字段用于请求体
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


// 修改 request 函数支持不同的响应类型
async function request<T = any>(
  url: string,
  method: HttpMethod = 'GET',
  config: CommonFetchConfig = {}
): Promise<T | null> {
  const {
    params,
    timeout = API_CONFIG.TIMEOUT,
    headers = {},
    responseType = 'json',
    data,  // 获取请求体数据
    ...restConfig
  } = config;

  // 处理查询参数
  const queryParams = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  const fullUrl = `${url}${queryParams}`; // 移除 API_CONFIG.BASE_URL 前缀，因为 commonFetch 用于直接访问文件

  // 设置默认 headers，根据 data 类型调整 Content-Type
  const defaultHeaders = {
    'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
    ...headers,
  };

  // 如果不是 FormData，则设置默认的 Content-Type
  if (!(data instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // 处理请求体
  let body = data;
  if (data && !(data instanceof FormData) && typeof data === 'object') {
    body = JSON.stringify(data);
  }

  // 创建 AbortController 用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      signal: controller.signal,
      body,  // 添加请求体
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

    // 根据 responseType 处理响应
    let data: T;
    switch (responseType) {
      case 'text':
        data = await response.text() as T;
        break;
      case 'blob':
        data = await response.blob() as T;
        break;
      case 'json':
      default:
        data = await response.json();
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      message.error(error.message);
      return null;
    }
    
    if (error instanceof Error) {
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


// 修改 http 导出对象以支持请求体
export const http = {
  get: <T>(url: string, config?: CommonFetchConfig) => 
    request<T>(url, 'GET', config),
  post: <T>(url: string, data?: any, config?: CommonFetchConfig) => 
    request<T>(url, 'POST', { ...config, data }),
  put: <T>(url: string, data?: any, config?: CommonFetchConfig) => 
    request<T>(url, 'PUT', { ...config, data }),
  delete: <T>(url: string, config?: CommonFetchConfig) => 
    request<T>(url, 'DELETE', config),
  patch: <T>(url: string, data?: any, config?: CommonFetchConfig) => 
    request<T>(url, 'PATCH', { ...config, data }),
};
