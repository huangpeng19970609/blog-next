import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import styles from "./index.module.scss";
import { COMCOS, request } from "@/request";
import { useRouter } from "next/router";
import { openNotification } from "@/utils/message";
import { useEffect } from "react";
import { CONFIG } from "@/config";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: LoginForm) => {
    // 登录
    request({
      url: COMCOS.BaseURL + "/user/login",
      method: "POST",
      data: {
        username: values.username,
        password: values.password,
      },
    }).then((res) => {
      if (res.code === 200) {
        const { token, user } = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        // 刷新
        openNotification("登录成功", "欢迎回来", "success");

        router.push("/home");
      } else {
        openNotification("登录失败", res.message, "error");
      }
    });
  };

  let form = {
    username: "",
    password: "",
  };

  if (CONFIG.isDevelopment) {
    form = {
      username: "admin",
      password: "123456",
    };
  }

  return (
    <div className={styles.loginContainer}>
      <Form
        name="login"
        className={styles.loginForm}
        onFinish={onFinish}
        initialValues={form}
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>登录</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            style={{
              borderRadius: "5px",
              borderColor: "#1890ff",
              marginBottom: "15px",
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            style={{
              borderRadius: "5px",
              borderColor: "#1890ff",
              marginBottom: "20px",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
