import React from "react";
import screenshot from "../screenshots/DashboardEmpty.jpeg";

const PhoneMockup = () => {
  return (
    <div className="relative z-10 w-[220px] rounded-[46px] border-[12px] border-slate-950 bg-slate-950 p-2 shadow-[0_60px_120px_rgba(3,8,24,0.75)] sm:w-[280px] lg:w-[320px] mt-[80px]">
      <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-slate-950" />
      <div className="absolute left-1/2 top-6 z-20 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-b from-[#07113f] via-[#0d2563] to-[#09132f]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
        <img
          src={screenshot}
          alt="Social Capital App"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default PhoneMockup;
