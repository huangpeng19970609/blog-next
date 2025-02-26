import { useRouter } from "next/router";
import TestRouterProvider from "../TestRouterProvider";
import styles from "./style.module.scss";

interface RouterProviderProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function RouterProvider({
  Component,
  pageProps,
}: RouterProviderProps) {
  const router = useRouter();

  // 如果是 /test 路径，使用 TestRouterProvider
  if (router.pathname.startsWith("/edit")) {
    return <TestRouterProvider Component={Component} pageProps={pageProps} />;
  }

  // 其他路径直接渲染组件
  return <Component {...pageProps} />;
}
