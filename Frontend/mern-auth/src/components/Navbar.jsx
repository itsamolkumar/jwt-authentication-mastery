import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar(){
    const navigate=useNavigate();
    const {backendUrl,isLoggedin,setIsLoggedIn,userData,setUserData}=useContext(AppContent);
                axios.defaults.withCredentials = true;

    const verifyAccountHandler=async()=>{
        try{
            const {data}=await axios.post(backendUrl+"/api/auth/send-verify-otp");
            if(data.success){
                navigate("/email-verify");
                toast.success(data.message);
            } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    }
    const LogoutHandler=async()=>{
        try{
                  const { data } = await axios.post(backendUrl + "/api/auth/logout")
                  if(data.success){
                    navigate("/");
                    setIsLoggedIn(false);
                    setUserData(false);
                    console.log(isLoggedin);
                  }
                  else{toast.error(data.message)}

        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }
    return (
        <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img src={assets.logo} alt="" className="w-28 sm:w-32"></img>
        {userData?<div className="rounded-full bg-black text-white w-8 h-8 justify-center items-center flex relative group">{userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 text-black rounded pt-10 z-10">
                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                    {!(userData.isAccountVerified) && <li onClick={verifyAccountHandler} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
                    <li onClick={LogoutHandler} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                </ul>
            </div>
        </div>:

        <button onClick={()=>navigate('/login')} className="flex items-center gap-2 border border-gray-500 rounded-full p-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login<img scr={assets.arrow_icon} alt=""></img></button>}
        </div>
    )
}
