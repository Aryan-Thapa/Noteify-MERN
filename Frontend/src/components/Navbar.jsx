// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import NoteifyLogo from "../assets/Logo.png";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <img src={NoteifyLogo} alt="Noteify Logo" className="h-10" />
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-white bg-orange-400 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-white bg-orange-400 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Sign Up
        </Link>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-orange-400 text-white hover:bg-orange-500 transition"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
