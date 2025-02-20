import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "@/config/routes";
import { matchPath } from "@/utils/router";
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

  useEffect(() => {
    const currentRoute = routes.find((route) =>
      matchPath(router.pathname, route)
    );
  }, [router.pathname]);

  return (
    <div className={styles.container}>
      <Component {...pageProps} />
    </div>
  );
}
