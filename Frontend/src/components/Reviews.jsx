// components/Reviews.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  { name: "Aryan", review: "Clean UI and easy to use. Loved it!" },
  { name: "Sneha", review: "AI summaries save me tons of time." },
  { name: "John", review: "Finally found my favorite note app." },
];

const Reviews = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextReview, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  return (
    <section className="py-16 px-6 text-center">
      <h2
        className={`text-3xl font-semibold mb-10 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        What users say
      </h2>
      <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-6 shadow-md"
          >
            <p
              className={`${
                darkMode ? "text-white" : "text-gray-800"
              } text-lg italic`}
            >
              "{reviews[currentIndex].review}"
            </p>
            <h4 className="mt-4 font-semibold text-orange-300 text-xl">
              – {reviews[currentIndex].name}
            </h4>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Reviews;
