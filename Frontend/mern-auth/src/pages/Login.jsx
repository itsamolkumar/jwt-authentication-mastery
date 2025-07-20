import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useEffect, useContext } from "react";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData, isLoggedIn } = useContext(AppContent);

  // ✅ Fetch user data after login (if already logged in)
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     (async () => {
  //       await getUserData();
  //     })();
  //   }
  // }, [isLoggedIn]);

  // ✅ Submit Handler for Sign Up or Login
  const submitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
           getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); // ✅ Very important to get userData for header
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create your account" : "Login to your account!"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign Up" ? "Create your account" : "Login to your account!"}
        </p>

        <form onSubmit={submitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-none w-full"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none w-full"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none w-full"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{' '}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{' '}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
