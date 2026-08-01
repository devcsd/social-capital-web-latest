/* =========================================================
   LIFESTYLE HERO — React + Tailwind version
   (Ported from custom-CSS Hero; visuals preserved 1:1)
   ========================================================= */

import { useState, useEffect } from "react";
import screenshot from "../screenshots/DashboardEmpty.jpeg";
import JoinPlatformPopup from "../components/JoinPlatform";

const HIcon = {
  group: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M22 19v-1a4 4 0 0 0-3-3.8" />
      <path d="M16 3.2A4 4 0 0 1 16 11" />
    </svg>
  ),
  shield: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  trend: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </svg>
  ),
  target: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
  rocket: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13c-1.5 1-2 5-2 5s4-.5 5-2" />
      <path d="M14 4c4 1 6 4 6 9-2 2-5 4-8 4-1-2-2-3-4-4 0-3 2-6 4-8 .7-.7 1.3-1 2-1Z" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </svg>
  ),
  arrow: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  lock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  eye: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  education: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9L12 4L22 9L12 14L2 9Z" />
      <path d="M6 11V16C6 17.5 8.7 19 12 19C15.3 19 18 17.5 18 16V11" />
      <path d="M22 9V15" />
    </svg>
  ),
  medical: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M9 6V4H15V6" />
      <path d="M12 10V16" />
      <path d="M9 13H15" />
    </svg>
  ),
  home: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10L12 3L21 10" />
      <path d="M5 10V20H19V10" />
      <path d="M10 20V14H14V20" />
    </svg>
  ),
  travel: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  ),
  business: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" />
      <path d="M3 12H21" />
    </svg>
  ),
};

/* =========================================================
   PHONE MOCKUP — centered product hero
   (Tailwind version — screen shows a single image, no mock UI)
   ========================================================= */

const Phone = () => {
  return (
    <div className="w-[300px] relative">
      <div
        className="relative w-[300px] h-[618px] bg-[#05091f] rounded-[44px] p-[10px]"
        style={{
          boxShadow:
            "0 40px 90px -30px rgba(2,6,28,0.8), 0 0 0 2px rgba(255,255,255,0.06), 0 0 0 11px #0a0f2e",
        }}
      >
        {/* dynamic island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[92px] h-[26px] bg-[#05091f] rounded-full z-[5]" />

        {/* screen */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden">
          <img
            id="phone-screen-image"
            src={screenshot}
            placeholder="App screen"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          ></img>
        </div>
      </div>
    </div>
  );
};
// Orbiting diverse avatars (fill with real photos)
const ORBIT = [
  {
    id: "orbit-african",
    top: 5,
    left: 33,
    cap: "African man",
    src: "/Mockimage1.webp",
  },
  {
    id: "orbit-sindian",
    top: 3,
    left: 61,
    cap: "South Indian woman",
    src: "/Mockimage2.webp",
  },
  {
    id: "orbit-mideast",
    top: 13,
    left: 87,
    cap: "Middle Eastern man",
    src: "/Mockimage3.webp",
  },
  {
    id: "orbit-asian",
    top: 37,
    left: 95,
    cap: "East Asian woman",
    src: "/Mockimage4.webp",
  },
  {
    id: "orbit-latina",
    top: 28,
    left: 4,
    cap: "Latina woman",
    src: "/Mockimage5.webp",
  },
];
const PHONE_HUB = { x: 50, y: 56 };

// gradient variants (kept as plain CSS strings, applied via inline style
// since Tailwind's JIT can't reliably pick up dynamically-built class names)
const GRADIENTS = {
  aurora:
    "linear-gradient(118deg, #0a1f6b 0%, #1e4fe5 28%, #6d3bd4 56%, #c23a86 77%, #ff8a3d 100%)",
  cool: "linear-gradient(118deg, #081a57 0%, #1230a6 40%, #1e4fe5 72%, #4f46e5 100%)",
  warm: "linear-gradient(118deg, #1a1340 0%, #5b2bb0 38%, #b5439a 70%, #ff8a3d 100%)",
};

const Hero = ({ gradient = "aurora" }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <section
      className="relative overflow-hidden isolate pt-7 pb-14 "
      style={{ background: GRADIENTS[gradient] || GRADIENTS.aurora }}
    >
      {/* local keyframes (Tailwind has no built-in "floaty" animation) */}
      <style>{`
        @keyframes lhero-floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* wash */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 80% 0%, rgba(255,199,44,0.18), transparent 60%), radial-gradient(700px 500px at 8% 12%, rgba(64,114,255,0.25), transparent 60%)",
        }}
      />
      {/* bottom fade (was ::after) */}
      <div
        className="absolute left-0 right-0 bottom-0 h-40 -z-10 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, #1e4fe5)" }}
      />

      <div className="elative z-10 mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-2 items-center pt-6 pb-2 lg:grid-cols-[1fr_1.05fr] lg:gap-9">
          {/* ---------- COPY ---------- */}
          <div className="max-w-[560px] mx-auto text-center lg:mx-0 lg:text-left">
            <h1 className="[font-family:var(--ff-display)] font-bold leading-[0.9] tracking-[-0.04em] m-0 flex flex-col items-center lg:items-start">
              <span className="text-white text-[clamp(52px,16vw,80px)] sm:text-[clamp(64px,9vw,132px)]">
                Social
              </span>
              <span
                className="text-[clamp(52px,16vw,80px)] sm:text-[clamp(64px,9vw,132px)] bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(96deg, #4072ff 0%, #a78bfa 38%, #f472b6 64%, #ffc72c 100%)",
                }}
              >
                Capital
              </span>
            </h1>

            <div className="[font-family:var(--ff-display)] font-semibold text-[clamp(30px,2.6vw,42px)] tracking-[-0.02em] text-white mt-[18px] leading-none">
              Build money together
              <span className="block text-[#ffc72c]">
                with people you trust.
              </span>
            </div>

            <p className="text-lg leading-[1.55] text-white/[0.86] mt-4 max-w-[460px] mx-auto lg:mx-0 [text-wrap:pretty]">
              Create groups, track savings, and reach your goals faster with
              your people.
            </p>

            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-3 mt-3">
              <span className="rounded-full bg-[#FFC72C] px-4 py-1 text-[14px] font-semibold text-[#121212]">
                Trust
              </span>

              <span className="ml-2 text-[14px] font-medium text-white/85">
                No lender. No EMI. No debt left behind.
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-7 max-w-[460px] mx-auto lg:mx-0">
              <div className="flex items-center gap-3.5 bg-white/[0.08] border border-white/[0.14] backdrop-blur-[10px] rounded-2xl px-4 py-3 text-left">
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 text-white [&>svg]:w-[22px] [&>svg]:h-[22px]"
                  style={{
                    background: "linear-gradient(135deg, #2f6bff, #1e4fe5)",
                    boxShadow: "0 8px 20px -8px rgba(30,79,229,0.8)",
                  }}
                >
                  <HIcon.group />
                </div>
                <div>
                  <div className="[font-family:var(--ff-display)] font-semibold text-base text-white">
                    Private Groups
                  </div>
                  <div className="text-[13px] text-white mt-px">
                    Only the people you invite can join.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/[0.08] border border-white/[0.14] backdrop-blur-[10px] rounded-2xl px-4 py-3 text-left">
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 text-white [&>svg]:w-[22px] [&>svg]:h-[22px]"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #6d3bd4)",
                    boxShadow: "0 8px 20px -8px rgba(124,58,212,0.8)",
                  }}
                >
                  <HIcon.eye />
                </div>
                <div>
                  <div className="[font-family:var(--ff-display)] font-semibold text-base text-white">
                    Transparency
                  </div>
                  <div className="text-[13px] text-white mt-px">
                    See every contribution clearly, in one place.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/[0.08] border border-white/[0.14] backdrop-blur-[10px] rounded-2xl px-4 py-3 text-left">
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 text-[#2a1c02] [&>svg]:w-[22px] [&>svg]:h-[22px]"
                  style={{
                    background: "linear-gradient(135deg, #ffb13c, #e8870b)",
                    boxShadow: "0 8px 20px -8px rgba(232,135,11,0.8)",
                  }}
                >
                  <HIcon.shield />
                </div>
                <div>
                  <div className="[font-family:var(--ff-display)] font-semibold text-base text-white">
                    Built on Trust
                  </div>
                  <div className="text-[13px] text-white mt-px">
                    Stronger bonds. Stronger groups.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-wrap mt-[30px] justify-center lg:justify-start">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl [font-family:var(--ff-display)] font-semibold text-base text-[#2a1c02] transition-transform transition-shadow duration-200 hover:-translate-y-0.5 [&>svg]:w-[18px] [&>svg]:h-[18px]"
                style={{
                  background: "linear-gradient(135deg, #ffd152, #ff9b3d)",
                  boxShadow: "0 14px 34px -12px rgba(255,155,61,0.9)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 18px 40px -12px rgba(255,155,61,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 14px 34px -12px rgba(255,155,61,0.9)")
                }
              >
                Get Started Free <HIcon.arrow />
              </button>
              <div className="inline-flex items-center gap-2 text-[13px] text-white/[0.82] [font-family:var(--ff-display)] font-medium [&>svg]:w-[15px] [&>svg]:h-[15px] [&>svg]:text-[#9fe3c0]">
                <HIcon.lock /> Secure. Trusted. Community Driven.
              </div>
            </div>
          </div>
          <JoinPlatformPopup open={showModal} setOpen={setShowModal} />
          {/* ---------- VISUAL STAGE ---------- */}
          <div className="relative min-h-[560px] mt-3 lg:min-h-[660px] lg:mt-0">
            <svg
              className="absolute inset-0 w-full h-full z-[1]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {ORBIT.map((o, i) => (
                <line
                  key={i}
                  x1={o.left}
                  y1={o.top}
                  x2={PHONE_HUB.x}
                  y2={PHONE_HUB.y}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="0.25"
                  strokeDasharray="0.9 0.7"
                />
              ))}
            </svg>

            {/* floating glow icons */}
            <div
              className="absolute top-[15%] left-[15%] w-11 h-11 lg:w-[54px] lg:h-[54px] rounded-2xl grid place-items-center text-white z-[6] backdrop-blur-[8px] [&>svg]:w-5 [&>svg]:h-5 lg:[&>svg]:w-[26px] lg:[&>svg]:h-[26px]"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6d3bd4)",
                boxShadow: "0 12px 30px -8px rgba(124,58,212,0.9)",
                animation: "lhero-floaty 5s ease-in-out infinite",
              }}
            >
              <HIcon.shield />
            </div>
            <div
              className="absolute top-[45%] left-0 w-11 h-11 lg:w-[54px] lg:h-[54px] rounded-2xl grid place-items-center text-white z-[6] backdrop-blur-[8px] [&>svg]:w-5 [&>svg]:h-5 lg:[&>svg]:w-[26px] lg:[&>svg]:h-[26px]"
              style={{
                background: "linear-gradient(135deg, #2f6bff, #1e4fe5)",
                boxShadow: "0 12px 30px -8px rgba(30,79,229,0.9)",
                animation: "lhero-floaty 5s ease-in-out infinite",
                animationDelay: "-1.6s",
              }}
            >
              <HIcon.group />
            </div>
            <div
              className="absolute top-[24%] right-[5%] w-11 h-11 lg:w-[54px] lg:h-[54px] rounded-2xl grid place-items-center text-[#2a1c02] z-[6] backdrop-blur-[8px] [&>svg]:w-5 [&>svg]:h-5 lg:[&>svg]:w-[26px] lg:[&>svg]:h-[26px]"
              style={{
                background: "linear-gradient(135deg, #ffb13c, #e8870b)",
                boxShadow: "0 12px 30px -8px rgba(232,135,11,0.9)",
                animation: "lhero-floaty 5s ease-in-out infinite",
                animationDelay: "-3.1s",
              }}
            >
              <HIcon.trend />
            </div>

            {/* orbiting diverse avatars (photo slots) */}
            {ORBIT.map((o) => (
              <div
                key={o.id}
                className="absolute w-[54px] h-[54px] lg:w-[70px] lg:h-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full z-[5] bg-white/[0.08]"
                style={{
                  top: `${o.top}%`,
                  left: `${o.left}%`,
                  boxShadow:
                    "0 10px 28px -8px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.55)",
                }}
              >
                <img
                  src={o.src}
                  id={o.id}
                  shape="circle"
                  placeholder={o.cap}
                  className="h-full w-full rounded-full object-cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                ></img>
              </div>
            ))}

            {/* large people photos (behind phone) */}

            {/* phone centerpiece */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-[4]">
              <Phone />
            </div>
          </div>
        </div>

        {/* ---------- PURPOSE CARDS ---------- */}
        <div className="relative z-[2] mt-8 rounded-[34px] border border-white/10 bg-white/[0.05] backdrop-blur-[18px] px-8 py-8">
          <h3 className="[font-family:var(--ff-display)] text-[24px] font-semibold tracking-[-0.03em] text-center text-white">
            Built for every need.
          </h3>

          <div className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-6">
            {[
              {
                icon: <HIcon.education />,
                title: "Education",
                color: "#9B5CFF",
              },
              { icon: <HIcon.medical />, title: "Medical", color: "#53E3C2" },
              { icon: <HIcon.home />, title: "Home", color: "#FFC72C" },
              { icon: <HIcon.travel />, title: "Travel", color: "#4B8DFF" },
              { icon: <HIcon.business />, title: "Business", color: "#FF647C" },
              { icon: <HIcon.shield />, title: "Emergency", color: "#FF6B6B" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[18px] bg-[#0000]/40 backdrop-blur-xl px-4 py-4 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className="w-10 h-10 rounded-[8px] flex items-center justify-center"
                  style={{
                    background: "#14121f",
                    boxShadow: `0 0 16px ${item.color}35, inset 0 0 0 1px ${item.color}40`,
                    border: `1px solid ${item.color}`
                  }}
                >
                  <div className="w-6 h-6" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                </div>

                <div className="mt-2 text-[14px] font-semibold text-white text-center">
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/55">
              YOUR PEOPLE.&nbsp;&nbsp;&nbsp;YOUR CIRCLE.&nbsp;&nbsp;&nbsp;YOUR
              PROGRESS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
