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
        <div className={`${styles["font-style"]} ${isActive("/home")}`}>
          <Link href={"/home"} replace={true}>
            首页
          </Link>
        </div>
        <div className={`${styles["font-style"]} ${isActive("/blog")}`}>
          <Link href={"/blog"} replace={true}>
            博客
          </Link>
        </div>
        <div className={`${styles["font-style"]} ${isActive("/test")}`}>
          <Link href={"/test"} replace={true}>
            测试的上传文章
          </Link>
        </div>
      </div>
      <div className={styles.rightMenu}>
        <Button type="primary" icon={<LoginOutlined />} onClick={handleLogin}>
          登录
        </Button>
      </div>
    </div>
  );
}
