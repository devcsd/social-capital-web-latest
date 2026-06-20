import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = [
  {
    code: "US",
    name: "USA",
    currency: "$",
    coordinates: [-100, 38],
    center: { letter: "L", color: "#f4b321" },
    members: [
    //   { letter: "A", color: "#f4b321" },
    //   { letter: "P", color: "#2ec27e" },
    //   { letter: "R", color: "#c678dd" },
    //   { letter: "N", color: "#5b7cfa" },
    //   { letter: "V", color: "#ef476f" },
    ],
  },

  {
    code: "GB",
    name: "UK",
    currency: "£",
    coordinates: [-2, 55],
    center: { letter: "L", color: "#45b7ff" },
    members: [
    //   { letter: "S", color: "#45b7ff" },
    //   { letter: "M", color: "#f4b321" },
    //   { letter: "D", color: "#8b5cf6" },
    ],
  },

  {
    code: "IN",
    name: "India",
    currency: "₹",
    coordinates: [80, 22],
    center: { letter: "L", color: "#f4b321" },
    members: [
    //   { letter: "K", color: "#eab308" },
    //   { letter: "M", color: "#c084fc" },
    //   { letter: "J", color: "#2ec27e" },
    //   { letter: "I", color: "#5b7cfa" },
    //   { letter: "T", color: "#14b8a6" },
    //   { letter: "C", color: "#ef476f" },
    //   { letter: "R", color: "#f87171" },
    //   { letter: "S", color: "#0ea5e9" },
    ],
  },

  {
    code: "AE",
    name: "Dubai",
    currency: "AED",
    coordinates: [55, 25],
    center: { letter: "D", color: "#8b5cf6" },
    members: [
    //   { letter: "A", color: "#f4b321" },
    //   { letter: "S", color: "#45b7ff" },
    //   { letter: "M", color: "#f4b321" },
    ],
  },

  {
    code: "AU",
    name: "Australia",
    currency: "A$",
    coordinates: [135, -25],
    center: { letter: "B", color: "#2ec27e" },
    members: [
    //   { letter: "I", color: "#8b5cf6" },
    //   { letter: "Q", color: "#c084fc" },
    ],
  },
];

export default function WorldMapCard() {
  const [selected, setSelected] = useState(countries[2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => {
        const current = countries.findIndex(
          (c) => c.code === prev.code
        );

        return countries[
          (current + 1) % countries.length
        ];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[750px] w-full overflow-hidden rounded-[32px] bg-[#071759]">
          <div
  key={selected.code}
  className="absolute right-5 top-8 z-50 -translate-x-1/2"
>
  <div className="flex items-center gap-3 rounded-2xl bg-[#f4b321] px-5 py-3">
    <span className="text-lg font-semibold text-black">
      {selected.name}
    </span>

    <span className="rounded-lg bg-black/10 px-2 py-1 text-sm font-bold text-black">
      {selected.currency}
    </span>
  </div>
</div>
      <ComposableMap
        projection="geoEqualEarth"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
      
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "rgba(255,255,255,.15)",
                    stroke: "rgba(255,255,255,.08)",
                    strokeWidth: 0.4,
                  },
                  hover: {
                    fill: "rgba(255,255,255,.18)",
                  },
                  pressed: {
                    fill: "rgba(255,255,255,.18)",
                  },
                }}
              />
            ))
          }
        </Geographies>

   

        {countries.map((country) => {
          const active =
            selected.code === country.code;

          return (
            <Marker
              key={country.code}
              coordinates={country.coordinates}
            >
              <g
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(country)}
              >
                {/* Country Label */}

                <foreignObject
                  x="-40"
                  y="-95"
                  width="120"
                  height="40"
                >
                  <div className="rounded-xl border border-white/10 bg-[#0d1d67] px-3 py-1 text-white">
                    <span className="font-semibold">
                      {country.name}
                    </span>

                    <span className="ml-2 opacity-70">
                      {country.currency}
                    </span>
                  </div>
                </foreignObject>

                {/* Active Glow */}

                {active && (
                  <>
                    <circle
                      r="55"
                      fill="rgba(255,255,255,.08)"
                    />

                    <circle
                      r="75"
                      fill="rgba(255,255,255,.04)"
                    />
                  </>
                )}

                {/* Small Members */}

                {country.members.map(
                  (member, index) => {
                    const angle =
                      (index /
                        country.members.length) *
                      Math.PI *
                      2;

                    const radius = active
                      ? 45
                      : 35;

                    const x =
                      Math.cos(angle) * radius;

                    const y =
                      Math.sin(angle) * radius;

                    return (
                      <g
                        key={index}
                        transform={`translate(${x},${y})`}
                      >
                        <circle
                          r={active ? 16 : 14}
                          fill={member.color}
                          stroke="white"
                          strokeWidth="2"
                        />

                        <text
                          textAnchor="middle"
                          dy="6"
                          fill="white"
                          fontSize="18"
                          fontWeight="700"
                        >
                          {member.letter}
                        </text>
                      </g>
                    );
                  }
                )}

                {/* Center Bubble */}

                <circle
                  r={active ? 32 : 24}
                  fill={country.center.color}
                  stroke="white"
                  strokeWidth="4"
                />

                <text
                  textAnchor="middle"
                  dy="10"
                  fill="white"
                  fontSize={active ? 34 : 24}
                  fontWeight="700"
                >
                  {country.center.letter}
                </text>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}