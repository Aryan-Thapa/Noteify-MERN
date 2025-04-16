// components/Footer.jsx
import React from "react";

const Footer = ({ darkMode }) => {
  return (
    <footer className="text-center py-6 mt-10 border-t border-white/20">
      <div className={`text-sm ${darkMode ? "text-white/70" : "text-gray-700"}`}>
        Follow us:
        <span className="ml-2 text-orange-400">Instagram</span> ·
        <span className="ml-2 text-orange-400">Twitter</span> ·
        <span className="ml-2 text-orange-400">LinkedIn</span>
      </div>
      <div className={`mt-2 text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>
        © Noteify 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
