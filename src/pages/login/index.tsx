import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import styles from "./index.module.scss";
import { COMCOS, request } from "@/request";
import { useRouter } from "next/router";
import { openNotification } from "@/utils/message";
import { useEffect, useState } from "react";
import { CONFIG } from "@/config";

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

export default function Login() {
  const router = useRouter();

  const [captchaId, setCaptchaId] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const getCaptcha = async () => {
    try {
      const res = await request({
        url: COMCOS.BaseURL + "/captcha/get",
        method: "GET",
      });
      if (res.code === 200) {
        const { captcha_id, image_base64 } = res.data;
        setCaptchaId(captcha_id);
        setImageBase64(image_base64);
      }
    } catch (error) {
      console.error("获取验证码失败:", error);
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  const onFinish = async (values: LoginForm) => {
    // 登录
    request({
      url: COMCOS.BaseURL + "/user/login",
      method: "POST",
      data: {
        username: values.username,
        password: values.password,
        captcha_text: values.captcha,
        captcha_id: captchaId,
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
    captcha: "",
  };

  if (CONFIG.isDevelopment) {
    form = {
      username: "admin",
      password: "123456",
      captcha: "",
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
        <Form.Item
          name="captcha"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <Input
              placeholder="验证码"
              style={{
                borderRadius: "5px",
                borderColor: "#1890ff",
                marginBottom: "20px",
              }}
            />
            {imageBase64 && (
              <img
                src={imageBase64}
                alt="验证码"
                onClick={getCaptcha}
                style={{
                  cursor: "pointer",
                  height: "32px",
                }}
              />
            )}
          </div>
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
