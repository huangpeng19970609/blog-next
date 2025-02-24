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
import "@/plugin/mouse-style/global.scss";
import styles from "./_app.module.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import RouterProvider from "@/components/RouterProvider";
import { StyleProvider } from "@ant-design/cssinjs";
import { useRouter } from "next/router";

import "@/pages-utils";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  return (
    <div className={styles["bg-color"]}>
      <StyleProvider hashPriority="high">
        <Header />
        <AntdRegistry>
          <AnimatePresence>
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <RouterProvider Component={Component} pageProps={pageProps} />
            </motion.div>
          </AnimatePresence>
        </AntdRegistry>
      </StyleProvider>
    </div>
  );
}
