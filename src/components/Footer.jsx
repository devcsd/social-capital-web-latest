"use client";

import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaPaperPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiCashapp } from "react-icons/si";
import ContactPopup from "./contact";

const Footer = () => {
  const informationData = [
    { label: "Terms & Conditions", to: "/terms&conditions" },
    { label: "Privacy Policy", to: "/privacypolicy" },
    { label: "Disclosures", to: "/" },
    { label: "Latest News", to: "/" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,12,35,0.98),rgba(8,15,45,1))] px-4 py-10 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl rounded-[32px]   p-6 shadow-[0_20px_80px_rgba(4,10,40,0.22)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <SiCashapp className="h-8 w-8 text-white" />
              <span className="ml-[-5px] font-inter text-lg font-semibold tracking-wide">
                <span className="text-white">ocial</span>
                <span className="text-[#ffc72c]">Capital</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-white transition hover:bg-white/10 hover:text-[#ffc72c]">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/socialcapital.app?igsh=Z3Zqc3pyeGtpZTJi" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-white transition hover:bg-white/10 hover:text-[#ffc72c]">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-white transition hover:bg-white/10 hover:text-[#ffc72c]">
                <FaXTwitter className="h-5 w-5" />
              </a>
            </div>

            <div className="space-y-2">
              <p className="font-inter text-sm text-white/80">{new Date().getFullYear()} Copyright | Social Capital</p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-inter text-lg font-semibold text-white">Information</h3>
            <ul className="space-y-3">
              {informationData.map((info, index) => (
                <li key={index}>
                  <Link to={info.to} className="font-inter text-sm text-white/70 transition hover:text-[#ffc72c]">
                    {info.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="font-inter text-lg font-semibold text-white">Stay Updated</h3>
            <p className="font-inter text-sm leading-7 text-white/70">
              Sign up to receive news, announcements, and insights directly to your email.
            </p>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#ffc72c] focus:outline-none focus:ring-1 focus:ring-[#ffc72c]"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffc72c] transition hover:scale-110">
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-inter text-lg font-semibold text-white">Get in Touch</h3>
            <p className="font-inter text-sm leading-7 text-white/70">
              Whether you have a question or want to collaborate, our team is here to support you.
            </p>
            <ContactPopup />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl text-center">
        <p className="font-inter text-sm text-white/60">
          Designed and Developed by{" "}
          <a href="https://www.cloudspacedesign.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#ffc72c]">
            CloudSpaceDesign.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
