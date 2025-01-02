/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Page = () => {
    const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [welcomeText, setWelcomeText] = useState(""); 

  useEffect(() => {
    const userRole = localStorage.getItem("role"); 

    if (userRole) {
      setRole(userRole);
      if (userRole === "admin") {
        setWelcomeText("Welcome to Admin Dashboard");
      } else if (userRole === "manager") {
        setWelcomeText("Welcome to Manager Dashboard");
      } else {
        setWelcomeText("Welcome to User Dashboard");
      }
    }
  }, []);

  const logout = () =>{
    localStorage.removeItem('AuthToken')
    localStorage.removeItem('role')
    setTimeout(() => {
        navigate('/')
    }, 2000);
  }

  return (
    <header className="bg-gray-200 shadow-2xl p-2">
      <div className="">
        <div className="flex justify-between gap-2 items-center p-2">
          <div className="lg:text-xl md:text-xl sm:text-sm text-sm font-bold text-gray-800">
            {welcomeText} 
          </div>

          <div className="flex items-center gap-1.5 mr-2">
         
              <button onClick={logout} className="py-2 px-6 rounded-md bg-purple-600 text-white font-bold">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Page;
