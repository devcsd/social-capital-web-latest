"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaApple,
  FaGooglePlay,
  FaWallet,
  FaMoneyBillWave,
} from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import Map from "../images/Map.svg";
import { FundPurpose } from "../data/FundPurpose";

// --- Fund Card Component ---
const FundCard = ({ fund }) => {
  const Icon = fund.icon;
  return (
    <div className="bg-highlight backdrop-blur-sm rounded-2xl p-4 w-[230px] sm:w-[240px] flex-shrink-0 border border-highlight hover:border-secondary/30 transition-all duration-300 hover:scale-105 snap-start">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full ${fund.iconBg} flex items-center justify-center text-white`}>
          <Icon className="text-lg" />
        </div>
        <h3 className="text-white font-semibold text-xl font-inter">
          {fund.name}
        </h3>
      </div>
      <p className="text-gray-400 text-sm font-inter leading-relaxed">
        {fund.description}
      </p>
    </div>
  );
};

/** Reusable Store Button */
const StoreButton = ({ icon, label, bg, text, hover }) => (
  <button
    className={`group flex items-center px-6 py-2 rounded-[15px] font-inter font-semibold transition-all ${bg} ${text} ${hover}`}>
    <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
      {icon}
    </span>
    {label}
  </button>
);

// --- Hero Section ---
const HeroSection = () => {
  const scrollRef = useRef(null);
  const currentIndexRef = useRef(0);
  const [activeCountry, setActiveCountry] = useState(0);

  const countries = [
    {
      id: 1,
      name: "India",
      members: "4,200+ Members",
      currency: "₹ INR",
      top: "70%",
      left: "80%",
      color: "bg-orange-400",
    },
    {
      id: 2,
      name: "USA",
      members: "3,100+ Members",
      currency: "$ USD",
      top: "70%",
      left: "20%",
      color: "bg-blue-400",
    },
    {
      id: 3,
      name: "China",
      members: "2,000+ Members",
      currency: "¥ CNY",
      top: "40%",
      left: "74%",
      color: "bg-red-500",
    },
    {
      id: 4,
      name: "Australia",
      members: "1,500+ Members",
      currency: "$ AUD",
      top: "100%",
      left: "85%",
      color: "bg-green-400",
    },
    {
      id: 5,
      name: "UK",
      members: "1,600+ Members",
      currency: "£ GBP",
      top: "40%",
      left: "40%",
      color: "bg-purple-400",
    },
  ];

  useEffect(() => {
    // Stop auto loop if only one country
    if (countries.length <= 1) return;

    const interval = setInterval(() => {
      setActiveCountry((prev) => (prev + 1) % countries.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [countries.length]);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = 250 + 16;
    const totalCards = FundPurpose.length;

    const scrollNext = () => {
      currentIndexRef.current = (currentIndexRef.current + 1) % totalCards;
      container.scrollTo({
        left: currentIndexRef.current * cardWidth,
        behavior: "smooth",
      });
    };

    const interval = setInterval(scrollNext, 2000); // slower for smooth UX
    return () => clearInterval(interval);
  }, []);

  const members = [
    {
      id: 1,
      name: "John",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 2,
      name: "Sophia",
      image: "https://i.pravatar.cc/100?img=32",
    },
    {
      id: 3,
      name: "David",
      image: "https://i.pravatar.cc/100?img=18",
    },
    {
      id: 4,
      name: "Emma",
      image: "https://i.pravatar.cc/100?img=45",
    },
  ];

  return (
    <section className="bg-primary pt-24 pb-16 lg:min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* --- Left Column --- */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300">
              {/* Floating Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/30 blur-xl rounded-full"></div>

                <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-yellow-400 shadow-lg py-0 px-2">
                  <p className="text-black text-sm"> New</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <h2 className="text-md md:text-md font-semibold text-white">
                  Built with your community, by design
                </h2>
              </div>
            </div>

            <h1 className="text-6xl md:text-5xl xl:text-8xl font-bold text-white font-inter">
              Save together. <br />
              Take turns.
              <br />
              <span className="text-secondary">Move faster.</span>
            </h1>
            <p className="text-2xl text-[#C1CEF6] font-inter text-justify">
              Social Capital is a modern app for group savings with the people
              you trust. Form a circle, contribute each cycle, and one member
              receives the full pool — settle however your group prefers, from
              UPI to Zelle to cash.
            </p>

            {/* App Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
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
            </div>
          </div>

          {/* --- Right Column --- */}
          <div className="relative flex justify-center">
            {/* Map Image + Overlays */}
            <div className="relative">
              {/* Map */}
              <img
                src={Map}
                alt="Global Community Map"
                className="h-80 sm:h-96 lg:h-[480px] w-auto z-10 rounded-xl"
              />

              {/* Country Dots */}
              {/* Country Dots */}
              {countries.map((country, index) => (
                <div
                  key={country.id}
                  className="absolute"
                  style={{
                    top: country.top,
                    left: country.left,
                  }}>
                  {/* Ping Animation */}
                  {/* <span
                    className={`absolute inline-flex h-5 w-5 rounded-full ${country.color} opacity-40 animate-ping`}></span> */}

                  {/* Dot */}
                  {/* <div
                    className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg ${country.color}`}></div> */}

                  {/* Auto Changing Tooltip */}
                  {activeCountry === index && (
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-500">
                      <div className="bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl min-w-[170px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${country.color}`}></div>

                          <h4 className="text-white font-semibold text-sm">
                            {country.name}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-white/70">
                            <HiOutlineUsers className="text-sm text-white" />
                            <span>{country.members}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-secondary font-medium">
                            <FaMoneyBillWave className="text-sm" />
                            <span>{country.currency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Growth Tag */}
              <div className="absolute top-4 right-4 z-30 bg-primary/90 backdrop-blur-md rounded-xl p-3 border border-secondary/20 hover:scale-105 transition-transform shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white font-inter">
                    ACTIVE GROUPS
                  </span>

                  <span className="bg-secondary ml-1 text-gray-900 text-xs font-bold rounded-full px-2 py-0.5 font-inter">
                    1,240
                  </span>
                </div>

                <div>+184 this month</div>
              </div>

              {/* Social Capital Card */}
              {/* <div className="absolute bottom-8 left-4 z-30 bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-md rounded-xl p-4 border border-secondary/20 hover:scale-105 transition-transform shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 -ml-1"></div>
                  </div>

                  <div className="w-3.5 h-3.5 rounded-full bg-white/80"></div>
                </div>

                <div className="text-center mb-3">
                  <p className="text-sm text-white font-semibold font-inter tracking-wide">
                    Social Capital Pass
                  </p>

                  <p className="text-xs text-secondary font-inter">
                    Platinum Tier
                  </p>
                </div>

                <div className="flex justify-between text-xs text-white font-inter">
                  <span>James Williams</span>
                  <span>Valid: 12/25</span>
                </div>
              </div> */}

              {/* Floating Money Bag Bubble */}
              <div className="absolute -bottom-8 left-8 z-20">
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full border border-secondary/30 bg-primary/80 backdrop-blur-sm flex flex-col items-center justify-center hover:scale-105 transition-transform text-white text-xs text-center font-inter">
                  <p>Explore and grow</p>
                  <p>together with</p>
                  <p>Social Capital</p>
                  <TbMoneybag className="h-4 w-4 mt-1 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          {/* Avatar Stack */}
          <div className="flex -space-x-4">
            {members.map((member) => (
              <img
                key={member.id}
                src={member.image}
                alt={member.name}
                className="w-12 h-12 rounded-full border-4 border-[#1E40FF] object-cover shadow-lg hover:-translate-y-1 transition-all duration-300"
              />
            ))}

            {/* Extra Count */}
            <div className="w-12 h-12 rounded-full border-4 border-[#1E40FF] bg-gradient-to-br from-secondary to-yellow-400 flex items-center justify-center text-xs font-bold text-black shadow-lg">
              +9K
            </div>
          </div>

          {/* Text */}
          <p className="text-white text-lg md:text-xl font-semibold">
            12,400+ members{" "}
            <span className="text-white/70 font-medium">
              across India, USA, China, Australia & UK
            </span>
          </p>
        </div>
        {/* --- Fund Purpose Cards --- */}
        {/* <div className="mt-14">
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex gap-4 min-w-full">
              {FundPurpose.map((fund, i) => (
                <FundCard key={i} fund={fund} />
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
