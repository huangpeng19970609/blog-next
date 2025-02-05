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
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const isActive = (path: string) => {
    return router.pathname === path ? styles.active : "";
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    try {
      user && setUser(JSON.parse(user));
    } catch (error) {
      setUser(null);
    }
  }, []);

  const handleLogin = () => {
    if (router.pathname === "/login") {
      return;
    }
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
    setUser(null);
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftMenu}>
        {routes
          .filter((route) => route.title && !route.hidden) // 添加 hidden 判断
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
        {user ? (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleLogout}
          >
            退出
          </Button>
        ) : (
          <Button type="primary" icon={<LoginOutlined />} onClick={handleLogin}>
            登录
          </Button>
        )}
      </div>
    </div>
  );
}
