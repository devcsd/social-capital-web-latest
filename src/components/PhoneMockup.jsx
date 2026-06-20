import React from "react";
import screenshot from "../screenshots/DashboardEmpty.jpeg";
const PhoneMockup = () => {
  return (
    <div className="relative w-[320px] rounded-[42px] border-[10px] border-slate-900 bg-slate-950 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden">
      
      {/* Dynamic Island / Notch */}
      <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

      {/* Screenshot */}
      <img
        src={screenshot}
        alt="Social Capital App"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default PhoneMockup;