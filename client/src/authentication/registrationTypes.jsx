/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
const RegisterPage = () => {
  const handleRegister = (role) => {
    console.log(`Registering as ${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <p className="text-center text-gray-600 mb-8">
          Choose your role to register
        </p>
        <div className="space-y-4 flex flex-col gap-1">
          <Link to={"/register-admin"}>
            <button
              onClick={() => handleRegister("admin")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register as Admin
            </button>
          </Link>
          <Link to={"/register-manager"}>
            <button
              onClick={() => handleRegister("manager")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register as Manager
            </button>
          </Link>
          <Link to={"/register-user"}>
            <button
              onClick={() => handleRegister("user")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register as User
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
