"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaHeadset, FaUsers } from "react-icons/fa";
import { FiCompass } from "react-icons/fi";

// --- Feature Card ---
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="flex flex-col items-center text-center space-y-6 group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}>
      {/* Icon Circle */}
      <div className="w-20 h-20 rounded-full bg-secondary border-4 border-white/20 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        <Icon className="text-gray-900 text-2xl" />
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-2xl font-inter">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 font-inter text-base leading-relaxed max-w-xs">
        {description}
      </p>
    </motion.div>
  );
};

// --- Services Section ---
const Services = () => {
  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "4rem",
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
    },
  };

  // Feature data
  const features = [
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description:
        "Got questions? Our dedicated support team is here around the clock to help you get answers fast and stay in control.",
    },
    {
      icon: FaUsers,
      title: "Community",
      description:
        "Join a growing network of users building trust, sharing insights, and shaping the future of capital together.",
    },
    {
      icon: FiCompass,
      title: "Explore",
      description:
        "Explore how social finance works. Learn everything from digital savings to smart rewards — free and easy to follow.",
    },
  ];

  return (
    <section className="relative w-full py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="text-white font-medium text-lg font-inter">
            Always By <span className="text-secondary">your</span> side
          </motion.p>

          <div className="flex justify-center">
            <motion.div
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="h-0.5 bg-secondary"
            />
          </div>

          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-inter leading-tight">
            Be among the first to experience{" "}
            <span className="text-secondary">Social Capital</span>!
          </motion.h2>
        </div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="relative">
          <div className="bg-highlight backdrop-blur-sm border border-highlight rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.6 + index * 0.2}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
