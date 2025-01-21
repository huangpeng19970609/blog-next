import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "@/config/routes";
import { matchPath } from "@/utils/router";

interface RouterProviderProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function RouterProvider({
  Component,
  pageProps,
}: RouterProviderProps) {
  const router = useRouter();

  useEffect(() => {
    const currentRoute = routes.find((route) =>
      matchPath(router.pathname, route)
    );

    // 只用于导航高亮和权限控制，不影响实际路由
    if (currentRoute?.auth) {
      // 处理需要登录的路由
      const isLoggedIn = false; // 根据你的登录状态判断
      if (!isLoggedIn) {
        router.push("/login");
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
