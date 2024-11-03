import getConfig from "next/config";

const baseUrl = getConfig().publicRuntimeConfig.BASE_URL;

// 创建一个fetch封装函数
export async function commonFetch<T>(url: string, options: RequestInit = {}) {
  url = baseUrl + url;

  const defaultOptions: RequestInit = {
    method: "GET", // 默认请求方法
    headers: {
      "Content-Type": "application/json", // 默认请求头，假设我们总是发送和接收JSON
      Accept: "application/json", // 告诉服务器我们期望接收JSON响应
    },
    credentials: "include", // 发送cookie等凭证信息
  };

  // 合并默认选项和传入选项
  const fetchOptions = { ...defaultOptions, ...options };

  try {
    // 发送fetch请求
    const response = await fetch(url, fetchOptions);

    // 检查响应状态码，如果不是2xx，则抛出错误
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`
      );
    }

    // 假设服务器返回的是JSON数据，我们将其解析为T类型的对象
    return response;
  } catch (error) {
    // 捕获并处理错误（例如，网络错误或HTTP错误）
    console.error("Fetch error:", error);
    throw error; // 重新抛出错误以便上层调用者可以处理
  }
}

// customFetch<any>("http://localhost:your-server-port/api/user", {
//   method: "POST",
//   body: newUser, // 这里我们不需要再次JSON.stringify，因为封装函数已经处理了
// });
