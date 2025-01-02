/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Select, DatePicker, Button, message } from "antd";
import { useStateManage } from "../../Context/StateContext";

const { Option } = Select;

const FilterTasks = () => {
  const { BASE_URL } = useStateManage();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: undefined,
    sort: undefined,
    dueDate: undefined,
  });

  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("AuthToken");
    try {
      const { status, sort, dueDate } = filters;
      const query = new URLSearchParams({
        status: status || "",
        sort: sort || "",
        dueDate: dueDate || "",
      }).toString();
  
      const response = await fetch(`${BASE_URL}/filter-tasks?${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }
  
      const data = await response.json();
      if (data?.message?.tasks) {
        setTasks(data.message.tasks);
      } else {
        message.info("No tasks found.");
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch tasks.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, filters]);
  

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("status", value)}
          allowClear
        >
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
          <Option value="in-progress">In Progress</Option>
        </Select>
        <Select
          placeholder="Sort by Due Date"
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("sort", value)}
          allowClear
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
        <DatePicker
          placeholder="Filter by Due Date"
          onChange={(date, dateString) =>
            handleFilterChange("dueDate", dateString)
          }
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={fetchTasks}>
          Search
        </Button>
      </div>
      <Table
        dataSource={tasks.map((task) => ({ ...task, key: task._id }))}
        columns={columns}
        loading={loading}
        bordered
      />
    </div>
  );
};

export default FilterTasks;
