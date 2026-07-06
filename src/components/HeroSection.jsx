import { useState, useEffect } from "react";
import PhoneMockup from "./PhoneMockup";
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Target,
  Link2,
  Wallet,
  LockIcon,
} from "lucide-react";
import JoinPlatformPopup from "../components/JoinPlatform";

const HeroSection = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => (p + 1) % 5);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const people = [
    {
      label: "African man",
      top: "-5%",
      left: "25%",
      img: "https://i.pravatar.cc/96?img=12",
      delay: "0s",
      duration: "3s",
    },
    {
      label: "South Indian woman",
      top: "-5%",
      left: "62%",
      img: "https://i.pravatar.cc/96?img=47",
      delay: "0.3s",
      duration: "3.4s",
    },
    {
      label: "Middle Eastern man",
      top: "5%",
      left: "80%",
      img: "https://i.pravatar.cc/96?img=33",
      delay: "0.6s",
      duration: "3.8s",
    },
    {
      label: "Asian woman",
      top: "30%",
      left: "90%",
      img: "https://i.pravatar.cc/96?img=44",
      delay: "0.9s",
      duration: "4.2s",
    },
    {
      label: "Latina woman",
      top: "20%",
      left: "-5%",
      img: "https://i.pravatar.cc/96?img=25",
      delay: "1.2s",
      duration: "3.6s",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Group Savings",
      desc: "Save as a team and reach goals together.",
      bg: "bg-blue-500/60",
      color: "text-blue-700",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Security",
      desc: "Private groups, your money never held by us.",
      bg: "bg-purple-500/60",
      color: "text-purple-700",
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      desc: "Track progress and celebrate every milestone.",
      bg: "bg-orange-500/60",
      color: "text-orange-700",
    },
  ];

  const bottomFeatures = [
    {
      icon: Target,
      title: "Build financial discipline",
      desc: "Stay consistent and take control.",
    },
    {
      icon: Link2,
      title: "Achieve goals faster",
      desc: "Pool resources and make big things happen.",
    },
    {
      icon: Users,
      title: "Stay accountable with your group",
      desc: "Support, encourage, and celebrate together.",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-20"
      // style={{
      //   background:
      //     "linear-gradient(135deg, #1565C0 0%, #1a237e 45%, #311b92 100%)",
      // }}
    >
      {/* Glow */}
      <div className="absolute left-[30%] top-[20%] h-[600px] w-[600px] rounded-full bg-indigo-700/30 blur-3xl" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="flex flex-col items-center lg:flex-row">
          {/* LEFT */}
          <div className="flex-1">
            <h1 className="leading-none font-black tracking-tight text-white text-6xl md:text-7xl lg:text-9xl">
              Social
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #1565C0, #ffc404)",
                }}
              >
                Capital
              </span>
            </h1>

            <p className="mt-4 text-2xl font-bold text-white md:text-3xl">
              <span className="text-blue-400">Save</span> Together.
              <span className="text-yellow-400"> Grow</span> Together.
            </p>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              Create groups, track savings, and reach your goals faster with
              your people.
            </p>

            {/* Features */}
            <div className="mt-10 flex flex-col gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex max-w-md items-center gap-4 rounded-2xl border border-white/90 bg-white/5 p-4 backdrop-blur-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/70">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <JoinPlatformPopup buttonName="Get Started Free →" />
              <span className="text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <LockIcon />
                  <span>Secure. Trusted. Community Driven.</span>
                </div>
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex min-h-[650px] flex-1 items-center justify-center ">
            {/* Floating People — real avatars with bounce */}
            {people.map((person, index) => (
              <div
                key={index}
                className={`float-bounce absolute flex flex-col items-center gap-2 transition-opacity duration-500  z-50`}
                style={{
                  top: person.top,
                  left: person.left,
                  animationDelay: person.delay,
                  animationDuration: person.duration,
                }}
              >
                <div
                  className="h-20 w-20 rounded-full border-2 border-dashed border-white/40 p-[3px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <img
                    src={person.img}
                    alt={person.label}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                {/* <span className="max-w-[70px] text-center text-[10px] font-medium leading-tight text-white/75">
                  {person.label}
                </span> */}
              </div>
            ))}

            {/* Badge — Shield Check / Trust */}
            <div
              className="badge-pop absolute flex h-14 w-14 items-center justify-center  z-50 rounded-2xl"
              style={{
                top: "5%",
                left: "15%",
                background: "rgba(99,102,241,0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                animationDuration: "2.8s",
                animationDelay: "0.2s",
              }}
            >
              <ShieldCheck size={22} className="text-white" />
            </div>

            {/* Badge — Users / Group */}
            <div
              className="badge-pop absolute flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                top: "45%",
                left: "-5%",
                background: "rgba(59,130,246,0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                animationDuration: "3.2s",
                animationDelay: "0.8s",
              }}
            >
              <Users size={22} className="text-white" />
            </div>

            {/* Badge — TrendingUp / Growth */}
            <div
              className="badge-pop absolute flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                top: "20%",
                right: "4%",
                background: "#f59e0b",
                boxShadow: "0 4px 20px rgba(245,158,11,0.45)",
                animationDuration: "2.5s",
                animationDelay: "1.4s",
              }}
            >
              <TrendingUp size={24} className="text-black" />
            </div>

            {/* Phone */}
            <PhoneMockup />
          </div>
        </div>

        {/* Stronger Together */}
        <div className="mt-20 rounded-3xl border border-white/90 bg-white/5 p-4 backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold text-white">
            Stronger Together. Better Future.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {bottomFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 border-l border-white/10 pl-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={20} className="text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
