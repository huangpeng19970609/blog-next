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
import { LoginOutlined, SettingOutlined } from "@ant-design/icons";
import routes from "@/config/routes";
import { useState, useEffect } from "react";
import { request } from "@/request";
import SettingPage from "@/page-components/setting-page";
import { getUseCustomTheme, getThemeSettings } from "@/utils/cookie";
import { ColorUtils } from "@/utils/css";

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [finnalyRoutes, setFinnalyRoutes] = useState([]);
  const [lastActivePath, setLastActivePath] = useState("");
  const [settingVisible, setSettingVisible] = useState(false);

  const isActive = (path: string) => {
    if (router.pathname === path) {
      if (lastActivePath !== path) {
        setLastActivePath(path);
      }
      return styles.active;
    }

    if (
      path === lastActivePath &&
      !finnalyRoutes.some((route) => route.path === router.pathname)
    ) {
      return styles.active;
    }

    return "";
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    try {
      user && setUser(JSON.parse(user));
    } catch (error) {
      setUser(null);
    }

    const finnalyRoutes = routes.filter((route) => {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      return (
        route.title &&
        (!route.hidden || (route.hidden && parsedUser?.username === "admin"))
      );
    });
    setFinnalyRoutes(finnalyRoutes);
  }, []);

  useEffect(() => {
    const matchedRoute = finnalyRoutes.find(
      (route) => route.path === router.pathname
    );
    if (matchedRoute) {
      setLastActivePath(matchedRoute.path);
    } else if (lastActivePath === "" && finnalyRoutes.length > 0) {
      setLastActivePath(finnalyRoutes[0].path);
    }
  }, [router.pathname, finnalyRoutes]);

  useEffect(() => {
    // 在组件加载时检查是否有自定义主题设置
    const useCustomTheme = getUseCustomTheme();
    if (useCustomTheme) {
      const themeSettings = getThemeSettings();
      if (themeSettings) {
        // 应用保存的主题设置
        if (themeSettings.fontColor) {
          ColorUtils.changeFontColor(themeSettings.fontColor);
        }
        if (themeSettings.bgColor) {
          ColorUtils.changeMainColor(themeSettings.bgColor);
        }
        if (themeSettings.paddingColor) {
          ColorUtils.changePaddingColor(themeSettings.paddingColor);
        }
        if (themeSettings.titleColor) {
          ColorUtils.changeTitleColor(themeSettings.titleColor);
        }
        if (themeSettings.buttonColor) {
          document.documentElement.style.setProperty(
            "--button-color",
            themeSettings.buttonColor
          );
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
    setUser(null);
  };

  const handleTest = () => {
    request({
      url: "/api" + "/captcha/test_redis/",
      method: "GET",
    });
  };

  const handleOpenSetting = () => {
    setSettingVisible(true);
  };

  const handleCloseSetting = () => {
    setSettingVisible(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftMenu}>
        {finnalyRoutes.map((route) => (
          <div
            key={route.path}
            className={`${styles["font-style"]} ${isActive(
              route.path
            )} global-hover-color`}
          >
            <Link href={route.path} replace={true}>
              {route.title}
            </Link>
          </div>
        ))}
      </div>
      <div className={styles.rightMenu}>
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleOpenSetting}
          className={styles.settingBtn}
        >
          设置
        </Button>
        <SettingPage visible={settingVisible} onClose={handleCloseSetting} />
        {/* {user ? (
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
        )} */}
      </div>
    </div>
  );
}
