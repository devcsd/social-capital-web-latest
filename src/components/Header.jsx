"use client";

import { useState, useEffect } from "react";
import { SiCashapp } from "react-icons/si";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import JoinPlatformPopup from "../components/JoinPlatform";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <SiCashapp className="h-10 w-10 text-white" />
          <span className="text-xl font-semibold tracking-wide text-white font-inter">
            ocial
            <span className="text-secondary">Capital</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-gray-300 hover:text-secondary transition-colors duration-300"
          >
            How it works
          </a>

          <a
            href="#community"
            className="text-gray-300 hover:text-secondary transition-colors duration-300"
          >
            Community
          </a>

          <a
            href="#trust"
            className="text-gray-300 hover:text-secondary transition-colors duration-300"
          >
            Trust & safety
          </a>
        </nav>

        {/* App Buttons */}
        {/* <div className="hidden lg:flex items-center gap-4">
          <StoreButton
            icon={<FaApple className="text-2xl" />}
            label="App Store"
            bg="bg-black"
            hover="hover:bg-white hover:text-black"
            text="text-white"
          />
          <StoreButton
            icon={<FaGooglePlay className="text-2xl" />}
            label="Google Play"
            bg="bg-secondary"
            hover="hover:bg-white hover:text-black"
            text="text-black"
          />
        </div> */}

        {/* <JoinPlatformPopup  buttonName="Join Platform"/> */}
        <></>
      </div>
    </header>
  );
};

/** Reusable Store Button */
const StoreButton = ({ icon, label, bg, text, hover }) => (
  <button
    className={`group flex items-center px-6 py-2 rounded-[15px] font-inter font-semibold transition-all ${bg} ${text} ${hover}`}
  >
    <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
      {icon}
    </span>
    {label}
  </button>
);

export default Header;
