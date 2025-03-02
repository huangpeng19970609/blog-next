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
import { Spin } from "antd";
import { useState, useEffect } from "react";

import "@/pages-utils";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div className={styles["bg-color"]}>
      <StyleProvider hashPriority="high">
        <Header />
        <AntdRegistry>
          <div
            style={{
              width: "100%",
              height: "calc(100% - 90px)",
              position: "relative",
            }}
          >
            <Spin
              spinning={loading}
              size="large"
              style={{
                maxHeight: "100%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <RouterProvider Component={Component} pageProps={pageProps} />
            </Spin>
          </div>
        </AntdRegistry>
      </StyleProvider>
    </div>
  );
}
