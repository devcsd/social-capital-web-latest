"use client";

import { FaFacebookF, FaInstagram, FaPaperPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiCashapp } from "react-icons/si";
import ContactPopup from "./contact";

const Footer = () => {
  // Links data

  const informationData = [
    "Terms",
    "Disclosures",
    "Disclosures",
    "Latest News",
  ];

  return (
    <footer className="bg-[#0b0e1c] py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Left Column - Branding */}
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <SiCashapp className="text-white h-8 w-8" />
              <span className="ml-[-5px] font-semibold tracking-wide font-inter">
                <span className="text-white">ocial</span>
                <span className="text-secondary">Capital</span>
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition-colors duration-300 p-2 hover:bg-white/10 rounded-full">
                <FaFacebookF className="h-5 w-5" />
              </a>

              <a
                href="https://www.instagram.com/socialcapital.app?igsh=Z3Zqc3pyeGtpZTJi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition-colors duration-300 p-2 hover:bg-white/10 rounded-full">
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition-colors duration-300 p-2 hover:bg-white/10 rounded-full">
                <FaXTwitter className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <p className="text-white font-inter text-sm">
                {new Date().getFullYear()} Copyright | Social Capital
              </p>
              {/* <p className="text-white font-inter text-sm">
                Distributed by ThemeWagon
              </p> */}
            </div>
          </div>

          {/* Column 3 - Information */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg font-inter">
              Information
            </h3>
            <ul className="space-y-3">
              {informationData.map((info, index) => (
                <li key={index}>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-secondary transition-colors duration-300 font-inter text-sm">
                    {info}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Subscribe */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg font-inter">
              Stay Updated
            </h3>
            <p className="text-gray-300 font-inter text-sm leading-relaxed">
              Sign up to receive news, announcements, and insights directly to
              your email.
            </p>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full bg-black/30 border border-gray-600/50 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 font-inter text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:scale-110 transition-transform duration-300">
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Column 5- Contactus */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg font-inter">
              Get in Touch
            </h3>
            <p className="text-gray-300 font-inter text-sm leading-relaxed">
              Whether you have a question or want to collaborate, our team is
              here to support you.
            </p>

            <ContactPopup />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
