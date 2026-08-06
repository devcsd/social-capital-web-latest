"use client";

import { FaApple } from "react-icons/fa6";
import { FaGooglePlay } from "react-icons/fa";
import screen from "../images/screens.png";
import EarlyAccessPopup from "../components/EarlyAcess";

const Platform = () => {
  return (
    <section className="relative w-full py-10 px-6 sm:py-20 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Dark translucent card */}
        <div className="bg-highlight backdrop-blur-sm border border-highlight rounded-3xl p-6 sm:p-10 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left side content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Main heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-inter mb-4 sm:mb-6">
                Powered by the Social
                <span className="text-secondary"> Capital</span> App
              </h2>

              {/* Subtitle */}
              <p className="text-gray-300 text-base sm:text-lg md:text-xl font-inter leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-4 sm:mb-6">
                Our platform helps communities save, grow, and access money
                through trusted, transparent group funding.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <button className="group flex items-center justify-center sm:justify-start px-3 py-2 bg-black rounded-[15px] text-white hover:bg-white hover:text-black transition-all font-inter w-full sm:w-auto">
                  <FaApple className="text-2xl mr-2 group-hover:text-black transition-all" />
                  App Store
                </button>

                <button className="group flex items-center justify-center sm:justify-start px-6 py-2 bg-secondary text-black hover:bg-white hover:text-black rounded-[15px] font-inter font-semibold w-full sm:w-auto">
                  <FaGooglePlay className="text-2xl mr-2 group-hover:text-black transition-all" />
                  Google Play
                </button>

                {/* <EarlyAccessPopup /> */}
              </div>
            </div>

            {/* Right-side image */}
            <div className="flex-1 hidden lg:flex justify-center lg:justify-end">
              <img
                src={screen}
                alt="App Screenshot"
                className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platform;
