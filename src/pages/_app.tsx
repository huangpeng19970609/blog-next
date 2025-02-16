/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-10-29 00:00:26
 * @Description: 这是一个布局文件 目的是保留Header组件在所有子组件存在
 */
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import { AppPropsWithLayout } from "@/type/next.type.ts";
import "./global.scss";
import "./normal.css";
import styles from "./_app.module.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import RouterProvider from "@/components/RouterProvider";
import { StyleProvider } from "@ant-design/cssinjs";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  return (
    <div className={styles["bg-color"]}>
      <StyleProvider hashPriority="high">
        <Header />
        <AntdRegistry>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, x: -10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.98 }}
              transition={{
                duration: 0.35,
                ease: [0.32, 0.72, 0, 1],
                opacity: { duration: 0.4 },
                scale: { duration: 0.35 },
              }}
            >
              <RouterProvider Component={Component} pageProps={pageProps} />
            </motion.div>
          </AnimatePresence>
        </AntdRegistry>
      </StyleProvider>
    </div>
  );
}
