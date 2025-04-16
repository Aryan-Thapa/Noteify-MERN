import React, { useState } from "react";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import NoteifyLogo from "../assets/NoteifyLogo.png";
import { useDarkMode } from "../context/DarkModeContext";

import {
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      dispatch(setCredentials(res.data));
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-[#1f1c2c] to-[#928dab]"
          : "bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]"
      } min-h-screen flex items-center justify-center transition-all duration-300`}
    >
      <div
        className={`backdrop-blur-md ${
          darkMode
            ? "bg-white/10 border-white/20"
            : "bg-black/10 border-black/10"
        } border rounded-xl p-8 w-full max-w-md shadow-xl`}
      >
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
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

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={NoteifyLogo} alt="Noteify Logo" className="h-20" />
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-semibold text-center mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome to Noteify
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm mb-1 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-white/20 text-white placeholder-white/70 border-white/30"
                  : "bg-gray-100 text-black border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm mb-1 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg pr-10 ${
                  darkMode
                    ? "bg-white/20 text-white placeholder-white/70 border-white/30"
                    : "bg-gray-100 text-black border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-orange-300 hover:text-orange-400"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition duration-300"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-orange-300 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
