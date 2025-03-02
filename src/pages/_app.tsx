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
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHomePage = router.pathname === "/home";

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

  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动进度
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles["bg-color"]}>
      <motion.div
        className={styles["scroll-progress"]}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          transformOrigin: "0%",
        }}
        animate={{ scaleX: scrollProgress / 100 }}
      />
      <StyleProvider hashPriority="high">
        <Header />
        <AntdRegistry>
          <div className={isHomePage ? "" : styles["app-container"]}>
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
