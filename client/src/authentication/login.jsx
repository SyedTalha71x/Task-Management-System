/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { useStateManage } from "../Context/StateContext";

const Login = () => {
  const { BASE_URL } = useStateManage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role) {
        redirectToDashboard(decoded.role);
      }
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === "admin") {
        navigate("/admin/dashboard/add-user");
    } else if (role === "manager") {
        navigate("/manager/dashboard/manager-tasks");
    } else {
        navigate("/user/dashboard/create-task");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data);
      
  
      if (response.ok) {
        localStorage.setItem("AuthToken", data.message.data.token);
        localStorage.setItem("role", data.message.data.role);
        const decoded = jwtDecode(data.message.data.token);
        console.log(decoded.role);
  
        setAlert({ message: "Login successful", type: "success" });
        redirectToDashboard(decoded.role);
      } else {
        setAlert({
          message: data.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log the error
      setAlert({ message: "Internal Server Error", type: "error" });
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h1>
        {alert.message && (
          <div
            className={`mb-4 text-center text-sm p-2 ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {alert.message}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
