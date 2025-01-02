/* eslint-disable no-unused-vars */
import React from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import moment from "moment";
import { useStateManage } from "../../Context/StateContext";

const { Option } = Select;

const CreateTask = () => {
  const { BASE_URL } = useStateManage();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("AuthToken");
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      status: values.status,
    };

    try {
      const response = await fetch(`${BASE_URL}/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "Success") {
        message.success("Task created successfully!");
        form.resetFields();
      } else {
        message.error(data.message || "Failed to create task.");
      }
    } catch (error) {
      message.error("An error occurred while creating the task.");
    }
  };

  return (
    <div className="p-4 ">
      <h2 className="text-xl bg-white rounded-md p-4 font-semibold mb-6">
        Create a Task for Admin
      </h2>{" "}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          dueDate: moment(),
          status: "pending",
        }}
      >
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: "Please input the task title!" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Task Description"
          rules={[
            { required: true, message: "Please input the task description!" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter task description" />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: "Please select the due date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[
            { required: true, message: "Please select the task status!" },
          ]}
        >
          <Select>
            <Option value="pending">Pending</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>
        <div className="flex justify-end items-center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Task
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CreateTask;
