/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from '../partials/navbar';
import Sidebar from "../partials/sidebar";
import { Outlet } from "react-router-dom";

const Page = () => {

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 outlet-css bg-gray-100 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Page;