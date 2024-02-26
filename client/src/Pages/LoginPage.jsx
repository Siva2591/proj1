import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // Custom validation for a specific username and password
    const expectedUsername = "tail@gmail.com";
    const expectedPassword = "1234567890";

    if (
      values.username === expectedUsername &&
      values.password === expectedPassword
    ) {
      // Successful login, navigate to another component

      localStorage.setItem("isLogin",JSON.stringify(expectedUsername))
      navigate("/home"); 
    } else {
      // Invalid credentials, show an error message
      setError("Invalid username or password");
    }
  };

  return (
    <Row justify="space-around" align="middle" style={{ height: "100vh" }}>
      <Col span={8} style={{ padding: "50px" }}>
        <Title level={2}>Login</Title>
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ width: "400px" }}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Profile"
            name="Profile"
            rules={[{ required: true, message: "Please enter your profile" }]}
          >
            <Input />
          </Form.Item>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Form.Item>
            <a href="#" style={{ color: "blue", marginBottom: "10px" }}>
              Forgot Password?
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "11px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>

      <Col span={8} style={{ padding: "30px" }}>
        <img
          src="https://thinkailabs.com/wp-content/uploads/2021/11/logo-1.png"
          alt="AI Labs Logo"
          style={{ height: "150px", width: "100%", marginTop: "0%" }}
        />
      </Col>
    </Row>
  );
};

export default LoginPage;