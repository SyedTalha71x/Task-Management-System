/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [userId, setuserId] = useState('')
  const BASE_URL = import.meta.env.VITE_PRODUCTION_API_URL 
  console.log("PRODUCTION_API_URL:", import.meta.env.VITE_PRODUCTION_API_URL);
  console.log("BASE_URL:", BASE_URL);

  return (
    <StateContext.Provider value={{ BASE_URL, userId, setuserId }}>
      {children}
    </StateContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useStateManage = () => useContext(StateContext);