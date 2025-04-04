/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-10-29 00:00:26
 * @Description: 这是一个布局文件 目的是保留Header组件在所有子组件存在
 */
import React from "react";
// 修复导入，使用标准导入方式
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import { AppPropsWithLayout } from "@/type/next.type.ts";
// 只保留关键样式立即加载
import "./global.scss";
import styles from "./_app.module.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import RouterProvider from "@/components/RouterProvider";
import { StyleProvider } from "@ant-design/cssinjs";
import { useRouter } from "next/router";
import { message, Spin } from "antd";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// 禁用 SSR 的动态导入
const ScrollProgressBar = dynamic(
  () => import("@/components/ScrollProgressBar"),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHomePage =
    router.pathname === "/home" ||
    router.pathname === "/" ||
    router.pathname === "/index";
  const [isClient, setIsClient] = useState(false);

  // 检测客户端环境并加载非关键样式
  useEffect(() => {
    setIsClient(true);

    // 动态加载非关键样式
    if (typeof window !== "undefined") {
      import("./normal.css");
      import("./animation.scss");
      import("@/plugin/mouse-style/global.scss");
    }

    // 预取可能的下一级页面
    if (isHomePage) {
      router.prefetch("/blog");
      router.prefetch("/about");
    }
  }, [isHomePage, router]);

  // 路由监听
  useEffect(() => {
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

    // 注册事件监听器
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // 组件卸载时清除监听器
    return cleanupListeners;
  }, [router]);

  // 优化的滚动进度条逻辑
  useEffect(() => {
    // 使用防抖来减少滚动事件频率
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // 使用requestAnimationFrame减少更新频率
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            const totalHeight =
              document.documentElement.scrollHeight -
              document.documentElement.clientHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / totalHeight) * 100;

            // 只有当进度差异大于1%时才更新状态
            if (Math.abs(progress - scrollProgress) > 1) {
              setScrollProgress(progress);
            }
            scrollTimeout = null;
          });
        }, 50); // 50ms 防抖
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollProgress]);

  return (
    <>
      <div className={styles["bg-color"]}>
        {/* 只在客户端渲染滚动进度条 */}
        {isClient && <ScrollProgressBar progress={scrollProgress} />}

        {/* 由于 antd 是必要的 UI 库，保留在所有页面 */}
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
                {/* 使用 Suspense 包裹可能需要异步加载的组件 */}
                <Suspense fallback={<div>页面加载中...</div>}>
                  <RouterProvider Component={Component} pageProps={pageProps} />
                </Suspense>
              </Spin>
            </div>
          </AntdRegistry>
        </StyleProvider>
      </div>
    </>
  );
}
