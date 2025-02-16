// 通用的 cookie 操作函数
const COOKIE_KEYS = {
  LAST_ARTICLE: 'last_article'
} as const;

const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// 特定的文章位置存取函数
export const setLastArticle = (articlePath: string) => {
  setCookie(COOKIE_KEYS.LAST_ARTICLE, articlePath);
};

export const getLastArticle = (): string | null => {
  return getCookie(COOKIE_KEYS.LAST_ARTICLE);
};
