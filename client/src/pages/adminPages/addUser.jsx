/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useStateManage } from "../../Context/StateContext";

const { Option } = Select;

const AddUser = () => {
  const {BASE_URL} = useStateManage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const token = localStorage.getItem('AuthToken')
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success("User has been added successfully!"); 
        alert('User has been added')
        form.resetFields();
      } else {
        message.error(data.message || "Something went wrong!"); 
        alert('Failed to add a user')
      }
    } catch (error) {
      message.error("Server error!"); 
    } finally {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  return (
    <div className="p-2">
      <h2 className="text-xl bg-white rounded-md p-4 font-semibold mb-6">
        Add New User
      </h2>
      <Form onFinish={onFinish} layout="vertical" className="space-y-4">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter user email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the user role!" }]}
        >
          <Select placeholder="Select user role">
            <Option value="user">User</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end items-center">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Add User
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddUser;
