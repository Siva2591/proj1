import React, { useState } from "react";
import { Form, Button, Input, Radio, message } from "antd";
import * as Yup from "yup";
import { server } from "../constants";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  host: Yup.string().required("Required"),
  portNo: Yup.number().required("Required"),
});

function EmailServer() {
  const [tls, setTls] = useState(true);

  const onFinish = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      // Make API call
      const response = await fetch(`${server}/api/parse-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: values.email,
          password: values.password,
          host: values.host,
          port: values.portNo,
          tls: values.tls,
        }),
      });

      if (response.ok) {
        // Reset the form if the API call is successful
        document.getElementById("emailserver").reset();
        message.success("Emails parsed successfully!");
      } else {
        const errorData = await response.json();
        message.error(errorData.error || "Something went wrong!");
      }
    } catch (errors) {
      errors.inner.forEach((error) => {
        message.error(error.message);
      });
    }
  };

  return (
    <div>
      <h1>Email Server Credentials</h1>
      <Form
        name="emailserver"
        labelCol={{ span: 2, offset: 5 }}
        wrapperCol={{ span: 10, offset: 0 }}
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.Item
          label="Email Id"
          name="email"
          rules={[
            
            { required: true, message: "Please enter your Email ID", 
              validator: (_, value) => {
                try {
                  validationSchema.validateSyncAt("email", { email: value });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(error.message);
                }
              },
            },
          ]}
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
          label="Host"
          name="host"
          rules={[{ required: true, message: "Please enter the host" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Port No"
          name="portNo"
          rules={[{ required: true, message: "Please enter the port number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Tls" name="tls"
        rules={[{ required: true, message: "Please select TLS true or false" }]}>
          <Radio.Group>
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EmailServer;
