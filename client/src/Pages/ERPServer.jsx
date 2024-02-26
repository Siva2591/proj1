import React from "react";
import { Form, Input, Button } from 'antd';
import *as Yup from "yup"

const validationSchema= Yup.object().shape({
  type: Yup.string().required("Required"),
  ApplicationHost:Yup.string().required("Required"),
  SystemNumber:Yup.string().required("Required"),
  SystemId:Yup.string().required("Required"),
  client:Yup.string().required("Required"),
  UserId:Yup.string().required("Required"),
  Password:Yup.string().required("Required")
})

function ERTSerever() {
  
  return (
    <div>
        <h1>ERP Server Credentials</h1>
      <Form
      
        name="ertsServerForm"
        labelCol={{ span:3,offset:5  }}
        wrapperCol={{ span: 10,offset:0 }}
        labelAlign="left"
      >
        <Form.Item label="Type" name="type" 
        rules={[{ required: true, message: "Please enter your Type" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Application Host" name="ApplicationHost"
        rules={[{ required: true, message: "Please enter your ApplicationHost" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="System Number" name="SystemNumber"
        rules={[{ required: true, message: "Please enter your System Number" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="System Id" name="SystemId"
        rules={[{ required: true, message: "Please enter your Type" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Client" name="client"
        rules={[{ required: true, message: "Please enter your Client" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="User Id" name="UserId"
        rules={[{ required: true, message: "Please enter your User Id" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="Password"
        rules={[{ required: true, message: "Please enter your Password" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8}}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ERTSerever;
