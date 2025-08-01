import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";

export default function Header() {
  const { userData } = useContext(AppContent);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt="Profile"
        className="w-36 h-36 rounded-full mb-6 object-cover"
      />
      
      <h1 className="flex items-center gap-2 text-lg sm:text-xl font-medium">
        Hey {userData?.name || "Developer"}!
        <img
          src={assets.hand_wave}
          alt="👋"
          className="w-6 h-6"
        />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>

      <p className="mb-8 max-w-md text-sm sm:text-base text-gray-600">
        Let’s start with a quick product and we’ll have you up and running in no time!
      </p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all text-sm sm:text-base font-medium">
        Get Started
      </button>
    </div>
  );
}
