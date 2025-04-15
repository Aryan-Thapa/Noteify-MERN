import React, { useState } from "react";
import { Link } from "react-router-dom";
import NoteifyLogo from "../assets/NoteifyLogo.png";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Landing = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#1f1c2c] to-[#928dab]"
          : "bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]"
      }`}
    >
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-orange-400 text-white hover:bg-orange-500 transition"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-10 w-full max-w-lg shadow-xl text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={NoteifyLogo} alt="Noteify Logo" className="h-24" />
        </div>

        {/* Welcome Text */}
        <h1
          className={`text-3xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome to Noteify
        </h1>
        <p
          className={`mb-6 ${
            darkMode ? "text-white/80" : "text-gray-600"
          } text-sm`}
        >
          Your smart and simple notes app powered by AI ✨
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-semibold transition duration-300">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-6 py-2 border border-orange-400 text-orange-400 hover:bg-orange-100 rounded-lg font-semibold transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
