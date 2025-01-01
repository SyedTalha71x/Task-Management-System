/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import RegistrationTypes from "./authentication/registrationTypes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterAdmin from "./authentication/registerAdmin";
import RegisterManager from "./authentication/registerManager";
import RegisterUser from "./authentication/registerUser";
import LoginPage from "./authentication/login";
import AdminDashboard from "./dashboard/adminDashboard";
import ManagerDashboard from "./dashboard/managerDashboard";
import UserDashboard from "./dashboard/userDashboard";

// admin pages
import AddUser from "./pages/adminPages/addUser";
import Users from "./pages/adminPages/users";
import AssignUsersToManager from "./pages/adminPages/AssignUsersToManager";
import Tasks from "./pages/adminPages/tasks";

// User pages
import CreateTask from "./pages/userPages/createTask";
import TaskManagement from "./pages/userPages/TaskManagement";


// Manager pages 
import ManagerCreateTask from './pages/managerPages/createTask'
import ManagerTaskManagement from './pages/managerPages/Tasks'
import AsignedUsers from "./pages/managerPages/assignedUsers";
import AssignedUsersTasks from "./pages/managerPages/assignedUsersTasks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<RegistrationTypes />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-manager" element={<RegisterManager />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards Redirection based on users roles  */}
        {/* Admin Routes  */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="add-user" element={<AddUser />} />
          <Route path="users" element={<Users />} />
          <Route
            path="assign-user-to-manager"
            element={<AssignUsersToManager />}
          />
          <Route path="tasks/:id" element={<Tasks />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />}>
        <Route path="create-a-task" element={<ManagerCreateTask />} />
        <Route path="manager-tasks" element={<ManagerTaskManagement />} />
        <Route path="assign-users" element={<AsignedUsers />} />
        <Route path="assign-users-tasks/:id" element={<AssignedUsersTasks />} />

        </Route>

        {/* User Routes  */}
        <Route path="/user/dashboard" element={<UserDashboard />}>
          <Route path="create-task" element={<CreateTask />} />
          <Route path="tasks" element={<TaskManagement />} />
        </Route>


        {/* Default Routes  */}
        <Route path="/" element={<RegistrationTypes />} />
      </Routes>
    </Router>
  );
}

export default App;
