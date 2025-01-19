import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import styles from "./index.module.scss";
import { COMCOS, request } from "@/request";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
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
        message.success("登录成功");
      }
    });
  };

  // 测试方法
  const onTestClick = () => {
    request({
      url: COMCOS.BaseURL + "/user/add",
      method: "get",
    });
  };

  return (
    <div className={styles.loginContainer}>
      <Form
        name="login"
        className={styles.loginForm}
        onFinish={onFinish}
        initialValues={{
          username: "admin",
          password: "huangpengpeng1215656702",
        }}
      >
        <h2>管理员登录</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={onTestClick}>测试</Button>
    </div>
  );
}
