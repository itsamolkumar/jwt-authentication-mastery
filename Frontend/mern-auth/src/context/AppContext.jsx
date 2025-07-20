import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // ✅ Correct import
import { useEffect } from "react";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false); 
    axios.defaults.withCredentials = true;

    const getAuthState = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true); // ✅ make sure backend sends this
        getUserData;
      
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong in context");
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-data");
      if (data.success) {
        setUserData(data.userData); // ✅ make sure backend sends this
        console.log("data set in appContext=",data.userData)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};
