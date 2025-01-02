/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import { useStateManage } from "../../Context/StateContext";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;

const AssignedUsersTasks = () => {
  const { BASE_URL } = useStateManage();
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("AuthToken");
    try {
      const response = await fetch(`${BASE_URL}/get-task-for-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "Success") {
        setTasks(data.message.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("AuthToken");
    console.log(selectedTask._id,"---------------");
    
    try {
      const response = await fetch(
        `${BASE_URL}/delete-task-for-user/${selectedTask._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        //   body: JSON.stringify({userId: id})
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status === "Success") {
        message.success("Task deleted successfully");
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== selectedTask._id)
        );
      } else {
        message.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleteModalVisible(false);
      setSelectedTask(null);
    }
  };

  const handleUpdateTask = async (values) => {
    const token = localStorage.getItem("AuthToken");
    try {
      const response = await fetch(
        `${BASE_URL}/update-task-for-user/${selectedTask._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({...values, userId: id}),
        }
      );
      
      const data = await response.json();
      if (data.status === "Success") {
        message.success("Task updated successfully");
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id ? { ...task, ...values } : task
          )
        );
      } else {
        message.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdateModalVisible(false);
      setSelectedTask(null);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setSelectedTask(record);
              form.setFieldsValue({
                title: record.title,
                description: record.description,
                dueDate: dayjs(record.dueDate),
                status: record.status,
              });
              setIsUpdateModalVisible(true);
            }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => {
              setSelectedTask(record);
              setIsDeleteModalVisible(true);
            }}
          ></Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Assigned User Tasks</h2>
      <Table
        dataSource={tasks}
        scroll={{x: 1000}}

        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Update Task"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleUpdateTask(values)}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select a due date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>

            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Task"
        open={isDeleteModalVisible}
        onOk={handleDeleteTask}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default AssignedUsersTasks;
