import { useState, useEffect } from "react";
import PhoneMockup from "./PhoneMockup";
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Target,
  Link2,
  Home,
  Bell,
  User,
  Wallet,LockIcon
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
    { label: "African man", top: "6%", left: "18%" },
    { label: "South Indian woman", top: "4%", left: "62%" },
    { label: "Middle Eastern man", top: "22%", left: "88%" },
    { label: "Asian woman", top: "52%", left: "90%" },
    { label: "Latina woman", top: "42%", left: "8%" },
  ];

  const features = [
    {
      icon: Users,
      title: "Group Savings",
      desc: "Save as a team and reach goals together.",
      bg: "bg-blue-500/20",
      color: "text-blue-400",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Security",
      desc: "Private groups, your money never held by us.",
      bg: "bg-purple-500/20",
      color: "text-purple-400",
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      desc: "Track progress and celebrate every milestone.",
      bg: "bg-orange-500/20",
      color: "text-orange-400",
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

  const avatars = [
    "https://i.pravatar.cc/48?img=1",
    "https://i.pravatar.cc/48?img=5",
    "https://i.pravatar.cc/48?img=12",
    "https://i.pravatar.cc/48?img=20",
  ];

  return (
    <section className="relative overflow-hidden bg-primary py-20">
      {/* Glow */}
      <div className="absolute left-[30%] top-[20%] h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-3xl" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          {/* LEFT */}
          <div className="flex-1">
            <h1 className="leading-none font-black tracking-tight text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              Social
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-secondary bg-clip-text text-transparent">
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
                    className="flex max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon size={20} className={feature.color} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-white/60">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <JoinPlatformPopup buttonName="Get Started Free →" />
              <span className="text-sm text-white/60">
               <div className="flex items-center gap-2"> <LockIcon/> <span>Secure. Trusted. Community Driven.</span></div>
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex min-h-[650px] flex-1 items-center justify-center">
            {/* Floating People */}
            {people.map((person, index) => (
              <div
                key={index}
                className={`absolute flex flex-col items-center gap-2 transition-all duration-500 ${
                  pulse === index ? "opacity-100" : "opacity-50"
                }`}
                style={{
                  top: person.top,
                  left: person.left,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-white/5">
                  <div className="h-8 w-8 rounded-full bg-blue-400/30" />
                </div>

                <span className="max-w-[70px] text-center text-[10px] text-white/80">
                  {person.label}
                </span>
              </div>
            ))}

            {/* Phone */}
            <PhoneMockup />

            {/* Left Floating Card */}
            <div className="absolute bottom-[12%] left-0 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Friends saving together</span>
              </div>
            </div>

            {/* Right Floating Card */}
            <div className="absolute bottom-[12%] right-0 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Wallet size={16} />
                <span>Family reaching a goal</span>
              </div>
            </div>

            {/* Growth Icon */}
            <div className="absolute right-[5%] top-[10%] flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-xl shadow-lg shadow-yellow-400/30">
              <TrendingUp size={24} className="text-black" />
            </div>
          </div>
        </div>

        {/* Stronger Together */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md lg:p-12">
          <h2 className="text-center text-3xl font-bold text-white">
            Stronger Together. Better Future.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {bottomFeatures.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="flex gap-4">
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

        {/* Avatar Strip */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt=""
                className={`h-11 w-11 rounded-full border-[3px] border-blue-600 object-cover ${
                  index !== 0 ? "-ml-3" : ""
                }`}
              />
            ))}

            <div className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-blue-600 bg-gradient-to-br from-yellow-400 to-orange-500 text-[10px] font-bold text-black">
              +9K
            </div>
          </div>

          <p className="font-semibold text-white">
            12,400+ members
            <span className="ml-2 font-normal text-white/60">
              across India, USA, China, Australia & UK
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
