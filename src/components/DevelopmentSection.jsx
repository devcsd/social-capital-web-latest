"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { phoneScreens, leftSteps, rightSteps } from "../data/Development";

const DevelopmentSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % phoneScreens.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const swipeVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.6, ease: "easeIn" },
    }),
  };

  return (
    <section className="relative w-full bg-primary py-24 px-6 sm:px-8 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-16 relative z-20 px-4">
        <h2 className="text-2xl lg:text-3xl font-bold font-inter text-white">
          Your Fund's Journey –{" "}
          <span className="text-secondary">From Idea to Impact</span>
        </h2>
        <p className="text-white text-base sm:text-lg lg:text-xl mt-4 max-w-2xl mx-auto font-inter">
          We’re here for every step of your journey—whether you need full-cycle
          support or just a hand along the way.
        </p>
      </div>

      {/* Background radar rings */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 pointer-events-none z-0">
        <div className="w-[800px] h-[800px] border border-secondary/5 rounded-full"></div>
        <div className="w-[600px] h-[600px] border border-secondary/8 rounded-full absolute top-[100px] left-[100px]"></div>
        <div className="w-[400px] h-[400px] border border-secondary/12 rounded-full absolute top-[200px] left-[200px]"></div>
        <div className="w-[200px] h-[200px] border border-secondary/15 rounded-full absolute top-[300px] left-[300px]"></div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-center relative z-10">
        {/* Left Timeline */}
        <div className="flex flex-col gap-12 sm:gap-16 text-right items-end order-2 lg:order-1">
          {leftSteps.map(({ title, desc, icon }) => (
            <div key={title} className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <h4 className="text-white font-semibold text-lg font-inter">
                  {title}
                </h4>
                <p className="text-gray-300 text-sm sm:text-base font-inter max-w-[220px]">
                  {desc}
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary border-2 border-secondary/30 flex items-center justify-center">
                <span className="text-secondary text-xl sm:text-2xl">
                  {icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Phone Animation */}
        <div className="flex justify-center order-1 relative -top-5 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.4 }}
            className="relative z-10 w-[190px] sm:w-[230px] md:w-[270px] 
       h-[380px] sm:h-[460px] md:h-[560px] flex items-center justify-center">
            {/* Left Volume Buttons */}
            <div className="absolute -left-1.5 top-[20%] flex flex-col gap-2 z-20">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-full shadow-md"></div>
              <div className="w-1.5 h-5 bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-full shadow-md"></div>
            </div>

            {/* Right Power Button */}
            <div className="absolute -right-2 top-[35%] w-2 h-12 bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-full shadow-md z-20"></div>

            {/* iPhone Frame */}
            <div className="relative w-full h-full bg-gradient-to-tr from-[#1a1a1a] to-[#111111] rounded-[3rem] shadow-[0_12px_25px_rgba(0,0,0,0.5)] border-[4px] border-gray-800 overflow-hidden">
              {/* Reflective Edge */}
              <div className="absolute inset-0 rounded-[3rem] border-[1px] border-white/10 pointer-events-none"></div>

              {/* Multi-layer Animated Reflections */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i + "-" + index} // reset on screen change
                  initial={{ x: -60 + i * 20, y: -30 + i * 10, opacity: 0 }}
                  animate={{
                    x: 60 - i * 20,
                    y: 30 - i * 10,
                    opacity: 0.15 + i * 0.05,
                  }}
                  transition={{
                    duration: 1.5 + i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 left-0 w-full h-full rounded-[2.8rem] pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/5 mix-blend-overlay"></motion.div>
              ))}

              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-3xl shadow-inner z-20"></div>

              {/* Auto-swiping Screens */}
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={index}
                  src={phoneScreens[index]}
                  alt={`App screen ${index + 1}`}
                  custom={direction}
                  variants={swipeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-[2.8rem] shadow-inner"
                />
              </AnimatePresence>
            </div>

            {/* Extra Highlight Overlay for Curved Glass Edge */}
            <div className="absolute inset-0 pointer-events-none rounded-[3rem]">
              <div className="absolute top-0 left-0 w-full h-full rounded-[3rem] bg-gradient-to-br from-white/5 via-transparent to-white/10 mix-blend-overlay"></div>
            </div>
          </motion.div>
        </div>

        {/* Right Timeline */}
        <div className="flex flex-col gap-12 sm:gap-16 text-left order-3">
          {rightSteps.map(({ title, desc, icon }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary border-2 border-secondary/30 flex items-center justify-center">
                <span className="text-secondary text-xl sm:text-2xl">
                  {icon}
                </span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg font-inter">
                  {title}
                </h4>
                <p className="text-gray-300 text-sm sm:text-base font-inter max-w-[220px]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopmentSection;
