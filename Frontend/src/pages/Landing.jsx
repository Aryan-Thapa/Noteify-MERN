// pages/Landing.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import { useDarkMode } from "../context/DarkModeContext";

const Landing = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#1f1c2c] to-[#928dab]"
          : "bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Hero darkMode={darkMode} />
      <Reviews darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Landing;
