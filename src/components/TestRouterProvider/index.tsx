import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import dynamic from "next/dynamic";
import styles from "./style.module.scss";
import routes from "@/config/routes";

const { Content } = Layout;

// 获取编辑页面的菜单配置
const editRoutes =
  routes.find((route) => route.path === "/edit")?.children || [];
const menuConfig = editRoutes.map((route) => ({
  key: route.path.replace("/", ""),
  label: route.title,
  path: `/edit${route.path}`,
}));

interface TestRouterProviderProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function TestRouterProvider({
  Component,
  pageProps,
}: TestRouterProviderProps) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("folder-manager");

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const currentMenu = menuConfig.find((item) =>
      router.pathname.includes(item.key)
    );
    if (currentMenu) {
      setSelectedKey(currentMenu.key);
    }
  }, [router.pathname]);

  // 处理菜单点击
  const handleMenuClick = async (key: string) => {
    const menuItem = menuConfig.find((item) => item.key === key);
    if (menuItem) {
      setSelectedKey(key);
      await router.push(menuItem.path);
    }
  };

  // 如果不是 /test 路径下的页面，直接渲染原始组件
  if (!router.pathname.startsWith("/edit")) {
    return <Component {...pageProps} />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.sider}>
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={menuConfig.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.key),
          }))}
        />
      </div>
      <Content className={styles.content}>
        <Component {...pageProps} />
      </Content>
    </div>
  );
}
