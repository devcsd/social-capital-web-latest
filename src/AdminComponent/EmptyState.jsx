import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import NoHistory from "../animations/NoHistory.lottie";

export default function EmptyState({ message,subtitle }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className="w-60 h-60">
        <DotLottieReact src={NoHistory} loop autoplay />
      </div>
      <p className="text-gray-500 text-lg text-center">{message}</p>
      <p className="text-sm text-gray-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
}
