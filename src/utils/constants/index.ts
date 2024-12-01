export const API_CONFIG = {
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
};

export const HTTP_MESSAGES = {
  TIMEOUT: (time: number) => `请求超时: ${time}ms`,
  UNKNOWN_ERROR: '发生未知错误',
  REQUEST_ERROR: '请求发生错误',
  REQUEST_FAILED: (status: number, statusText: string) => 
    `请求失败: ${status} ${statusText}`,
}; 