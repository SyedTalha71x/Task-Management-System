/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useStateManage } from '../../Context/StateContext';

const { Option } = Select;

const TaskManagement = () => {
  const {BASE_URL} = useStateManage();
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('AuthToken')
    try {
      const response = await fetch(`${BASE_URL}/get-all-tasks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await response.json();
      if (data.status === 'Success') {
        setTasks(data.message.findTasks);
      } else {
        message.info('No Tasks found for this user');
      }
    } catch (error) {
      message.error('An error occurred while fetching tasks.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete-task/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
        },
      });

      const data = await response.json();
      if (data.status === 'Success') {
        message.success('Task deleted successfully');
        fetchTasks(); 
      } else {
        message.error(data.message || 'Failed to delete task');
      }
    } catch (error) {
      message.error('An error occurred while deleting the task.');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      dueDate: moment(task.dueDate),
      status: task.status,
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleModalSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      status: values.status,
    };

    try {
      const response = await fetch(`${BASE_URL}/update-task/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === 'Success') {
        message.success('Task updated successfully');
        fetchTasks(); 
        handleModalCancel();
      } else {
        message.error(data.message || 'Failed to update task');
      }
    } catch (error) {
      message.error('An error occurred while updating the task.');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={status === 'completed' ? 'text-green-500' : 'text-yellow-500'}>
          {status}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Task Management</h2>
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        title="Edit Task"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please input the task title!' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Task Description"
            rules={[{ required: true, message: 'Please input the task description!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter task description" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select the due date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the task status!' }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
