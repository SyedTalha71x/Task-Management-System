/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Spin } from 'antd';
import { useStateManage } from '../../Context/StateContext';

const { Option } = Select;

const AssignUsersToManager = () => {
  const {BASE_URL} = useStateManage();
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchManagers();
    fetchUsers();
  }, []);

  const fetchManagers = async () => {
    const token = localStorage.getItem('AuthToken')
    try {
      const response = await fetch(`${BASE_URL}/get-managers-only`, {
        headers: {
            'Authorization':`Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'Success') {
        setManagers(data.message.managers);
      } else {
        message.error('Failed to fetch managers');
      }
    } catch (error) {
      message.error('Error fetching managers');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('AuthToken')
    try {
      const response = await fetch(`${BASE_URL}/get-users-only`,{
        headers: {
            'Authorization':`Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'Success') {
        setUsers(data.message.users);
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      message.error('Error fetching users');
    }
  };

  const handleAssignUsers = async () => {
    const token = localStorage.getItem('AuthToken')
    if (!selectedManager || selectedUsers.length === 0) {
      message.error('Please select a manager and users');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/assign-users-to-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify({
          managerId: selectedManager,
          userIds: selectedUsers,
        }),
      });
      const data = await response.json();
      if (data.status === 'Success') {
        message.success('Users assigned to manager successfully');
      } else {
        message.error(data.message || 'Failed to assign users');
      }
    } catch (error) {
      message.error('Error assigning users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Assign Users to Manager</h2>
      <Form layout="vertical">
        <Form.Item label="Select Manager" required>
          <Select
            placeholder="Select a manager"
            onChange={(value) => setSelectedManager(value)}
          >
            {managers.map((manager) => (
              <Option key={manager._id} value={manager._id}>
                {manager.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Select Users" required>
          <Select
            mode="multiple"
            placeholder="Select users"
            onChange={(value) => setSelectedUsers(value)}
          >
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button
          type="primary"
          onClick={handleAssignUsers}
          loading={loading}
        >
          Assign Users
        </Button>
      </Form>
    </div>
  );
};

export default AssignUsersToManager;
