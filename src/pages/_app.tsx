/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-10-29 00:00:26
 * @Description: 这是一个布局文件 目的是保留Header组件在所有子组件存在
 */
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import { AppPropsWithLayout } from "@/type/next.type.ts";
import "./global.scss";
import "./normal.css";
import "./animation.scss";
import "@/plugin/mouse-style/global.scss";
import styles from "./_app.module.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import RouterProvider from "@/components/RouterProvider";
import { StyleProvider } from "@ant-design/cssinjs";
import { useRouter } from "next/router";
import { message, Spin } from "antd";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import "@/pages-utils";

// 禁用 SSR 的动态导入
const ScrollProgressBar = dynamic(
  () => import("@/components/ScrollProgressBar"),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHomePage = router.pathname === "/home";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 设置页面滚动行为

    // 清除之前可能存在的所有事件监听器
    const cleanupListeners = () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };

    // 定义事件处理函数
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      console.log(
        `[${new Date().toISOString()}] Route change complete: ${
          router.pathname
        }`
      );
      setLoading(false);
    };

    // 先清除所有监听器，然后重新注册
    cleanupListeners();

    // 注册事件监听器 - 即使在首页也注册，但可能不显示loading
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // 组件卸载时清除监听器
    return cleanupListeners;
  }, [router, isHomePage]);

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
    <>
      <div className={styles["bg-color"]}>
        {isClient && <ScrollProgressBar progress={scrollProgress} />}
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
    </>
  );
}
