// App.jsx
import { useState } from "react";
import WorldMapCard from "./WorldMapCard";

const countries = [
  {
    code: "US",
    name: "USA",
    currency: "$",
    avatars: ["A", "P", "R", "N", "V"],
  },
  {
    code: "GB",
    name: "UK",
    currency: "£",
    avatars: ["M", "D"],
  },
  {
    code: "IN",
    name: "India",
    currency: "₹",
    avatars: ["K", "J", "L", "H", "G", "T", "R", "S"],
  },
  {
    code: "AE",
    name: "Dubai",
    currency: "AED",
    avatars: ["J", "K", "L"],
  },
  {
    code: "AU",
    name: "Australia",
    currency: "A$",
    avatars: ["B", "I", "Q"],
  },
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);

  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden" id="community">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-10">
        <span className="mb-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs tracking-[0.3em] text-white/80">
          GLOBAL COMMUNITY
        </span>

        <h1 className="text-center text-5xl font-semibold leading-none md:text-7xl">
          One idea,
          <span className="block text-[#ffbf2f]">across borders.</span>
        </h1>

        <p className="mt-6 max-w-3xl text-center text-base leading-7 text-white/70 md:text-xl">
          Groups are forming across the US, UK, UAE, India and Australia — each running in its own
          currency, on its own cadence, with the people who already trust each other.
        </p>

        <div className="mt-14 w-full">
          <WorldMapCard
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        </div>
      </div>
    </div>
  );
}