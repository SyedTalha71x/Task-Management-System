/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useStateManage } from "../../Context/StateContext";
import { useNavigate } from "react-router-dom";

const AssignedUsersTable = () => {
    const navigate = useNavigate();
  const { BASE_URL } = useStateManage();
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  const fetchAssignedUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-assigned-users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });

      const data = await response.json();
      if (data.status === "Success") {
        setAssignedUsers(data.message.assignedUsers);
      } else {
        message.info("No users has assigned to you");
      }
    } catch (error) {
      message.error("An error occurred while fetching assigned users.");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const handleRowClick = (record) => {
    navigate(`/manager/dashboard/assign-users-tasks/${record._id}`);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Assigned Users</h2>
      <Table
        columns={columns}
        dataSource={assignedUsers}
        rowKey="_id"
        pagination={false}
        onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
      />
    </div>
  );
};

export default AssignedUsersTable;
