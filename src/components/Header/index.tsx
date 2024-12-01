/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-29 22:56:44
 * @Description: 导航栏菜单
 */
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path ? styles.active : '';
  };

  return (
    <div className={styles.header}>
      <div className={`${styles["font-style"]} ${isActive('/home')}`}>
        <Link href={"/home"} replace={true}>
          首页
        </Link>
      </div>
      <div className={`${styles["font-style"]} ${isActive('/blog')}`}>
        <Link href={"/blog"} replace={true}>
          博客
        </Link>
      </div>
      <div className={`${styles["font-style"]} ${isActive('/test')}`}>
        <Link href={"/test"} replace={true}>
          Test
        </Link>
      </div>
      <div></div>
    </div>
  );
}
