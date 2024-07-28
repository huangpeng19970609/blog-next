/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 22:47:14
 * @Description: 这是一个布局文件 目的是保留Header组件在所有子组件存在
 */
import Header from "@/components/Header";
import { AppPropsWithLayout } from "@/next.type.ts";
import "./global.scss";
import styles from "./_app.module.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <div className={styles["bg-color"]}>
      <Header></Header>
      <AntdRegistry>
        <Component></Component>
      </AntdRegistry>
    </div>
  );
}
