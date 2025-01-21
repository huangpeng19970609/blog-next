/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-29 22:56:44
 * @Description: 导航栏菜单
 */
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import routes from "@/config/routes";

export default function Header() {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path ? styles.active : "";
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftMenu}>
        {routes
          .filter((route) => route.title) // 只显示没有子路由的主路由
          .map((route) => (
            <div
              key={route.path}
              className={`${styles["font-style"]} ${isActive(route.path)}`}
            >
              <Link href={route.path} replace={true}>
                {route.title}
              </Link>
            </div>
          ))}
      </div>
      <div className={styles.rightMenu}>
        <Button type="primary" icon={<LoginOutlined />} onClick={handleLogin}>
          登录
        </Button>
      </div>
    </div>
  );
}
