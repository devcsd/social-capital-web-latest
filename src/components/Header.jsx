"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { SiCashapp } from "react-icons/si";
import JoinPlatformPopup from "../components/JoinPlatform";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-500`}
    >
      <div className="w-full">
        <div
          className={`
            flex items-center justify-around            
            border border-white/10
            bg-primary
            backdrop-blur-xl
            shadow-sc-card
            transition-all duration-500
            px-6 lg:px-8 w-full
            ${isScrolled ? "h-[72px] w-100%" : "h-[78px] w-100%"}
          `}
        >
          {/* ---------------- Logo ---------------- */}

          <a href="#" className="flex items-center gap-1 shrink-0">
            <SiCashapp className="h-8 w-8 text-white" />

            <div className="leading-none">
              <div
                className="
                  font-display
                  text-[22px]
                  font-semibold
                  tracking-tight
                  text-white
                "
              >ocial <span className="text-sc-gold-500">Capital</span>
              </div>
            </div>
          </a>

          {/* ---------------- Navigation ---------------- */}

          <nav
            className="
              hidden
              min-[900px]:flex
              items-center
              gap-10
            "
          >
            <a
              href="#how-it-works"
              className="
                text-[15px]
                font-medium
                text-white/80
                transition-all
                duration-300
                hover:text-sc-gold-500
              "
            >
              How it works
            </a>

            <a
              href="#community"
              className="
                text-[15px]
                font-medium
                text-white/80
                transition-all
                duration-300
                hover:text-sc-gold-500
              "
            >
              Community
            </a>

            <a
              href="#trust"
              className="
                text-[15px]
                font-medium
                text-white/80
                transition-all
                duration-300
                hover:text-sc-gold-500
              "
            >
              Trust & Safety
            </a>
          </nav>

          {/* ---------------- CTA ---------------- */}

          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition text-sm sm:text-base group"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <JoinPlatformPopup open={showModal} setOpen={setShowModal} />
      
    </header>
  );
};

export default Header;