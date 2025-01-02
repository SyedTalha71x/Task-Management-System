/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useStateManage } from '../../Context/StateContext';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Users = () => {
  const navigate = useNavigate();
  const { BASE_URL } = useStateManage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('AuthToken');
    try {
      const response = await fetch(`${BASE_URL}/view-all-users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'Success') {
        setUsers(data.message.users);
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      message.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('AuthToken');
    try {
      const response = await fetch(`${BASE_URL}/delete-user/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'Success') {
        message.success('User deleted successfully');
        fetchUsers();
        setIsDeleteModalVisible(false);
      } else {
        message.error('Failed to delete user');
      }
    } catch (error) {
      message.error('Error deleting user');
    }
  };

  const handleUpdate = async (values) => {
    const token = localStorage.getItem('AuthToken');
    try {
      const response = await fetch(`${BASE_URL}/edit-user/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.status === 'Success') {
        message.success('User updated successfully');
        fetchUsers();
        setIsModalVisible(false);
      } else {
        message.error('Failed to update user');
      }
    } catch (error) {
      message.error('Error updating user');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click from triggering navigation
              handleEdit(record);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button> */}
          <Button
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation(); 
              handleDelete(record);
            }}
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleRowClick = (record) => {
    navigate(`/admin/dashboard/tasks/${record._id}`);
  };

  return (
    <div className="p-2">
      <h2 className="text-xl bg-white rounded-md p-4 font-semibold mb-6">Users</h2>
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        style={{ cursor: 'pointer' }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            name: currentUser?.name,
            email: currentUser?.email,
            role: currentUser?.role,
          }}
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger onClick={handleConfirmDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default Users;
