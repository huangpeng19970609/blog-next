// 通用的 cookie 操作函数
const COOKIE_KEYS = {
  LAST_ARTICLE: "last_article",
  THEME_SETTINGS: "theme_settings",
  USE_CUSTOM_THEME: "use_custom_theme",
} as const;

const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
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

// 主题设置相关函数
export interface ThemeSettings {
  fontColor?: string;
  bgColor?: string;
  paddingColor?: string;
  titleColor?: string;
  buttonColor?: string;
}

export const setThemeSettings = (settings: ThemeSettings) => {
  setCookie(COOKIE_KEYS.THEME_SETTINGS, JSON.stringify(settings));
};

export const getThemeSettings = (): ThemeSettings | null => {
  const settings = getCookie(COOKIE_KEYS.THEME_SETTINGS);
  return settings ? JSON.parse(settings) : null;
};

export const setUseCustomTheme = (use: boolean) => {
  setCookie(COOKIE_KEYS.USE_CUSTOM_THEME, use ? "1" : "0");
};

export const getUseCustomTheme = (): boolean => {
  return getCookie(COOKIE_KEYS.USE_CUSTOM_THEME) === "1";
};
