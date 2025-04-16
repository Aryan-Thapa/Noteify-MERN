// components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import NoteifyUI from "../assets/noteify-ui.png";

const Hero = ({ darkMode }) => {
  return (
    <section className="py-20 px-20 flex flex-col md:flex-row items-center gap-7 lg:gap-2">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2"
      >
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Your Smarter Way to Take Notes 📓
        </h1>
        <p className={`mt-4 ${darkMode ? "text-white/70" : "text-gray-600"}`}>
          Noteify is your go-to note-taking tool with AI-assisted summaries, powerful editing,
          and a clean, responsive UI.
        </p>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 flex justify-center"
      >
        <img
          src={NoteifyUI}
          alt="Noteify UI"
          className="w-[500px] rounded-xl shadow-lg"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
