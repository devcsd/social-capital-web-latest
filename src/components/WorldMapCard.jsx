import { useState, useEffect } from "react";
import worldMap from "../images/world-map-base.png";

const W = 900,
  H = 500;

const COUNTRIES = [
  {
    code: "US",
    name: "USA",
    currency: "$",
    x: 185,
    y: 200,
    members: [
      { letter: "A", color: "#f4b321" },
      { letter: "P", color: "#2ec27e" },
      { letter: "R", color: "#c678dd" },
    ],
  },
  {
    code: "GB",
    name: "UK",
    currency: "£",
    x: 415,
    y: 120,
    members: [
      { letter: "S", color: "#45b7ff" },
      { letter: "D", color: "#ef476f" },
    ],
  },
  {
    code: "IN",
    name: "India",
    currency: "₹",
    x: 637,
    y: 250,
    members: [
      { letter: "K", color: "#5b7cfa" },
      { letter: "S", color: "#f4b321" },
    ],  
  },
  {
    code: "AE",
    name: "UAE",
    currency: "AED",
    x: 535,
    y: 285,
    members: [{ letter: "A", color: "#45b7ff" }],
  },
  {
    code: "AU",
    name: "Australia",
    currency: "A$",
    x: 795,
    y: 375,
    members: [
      { letter: "I", color: "#ef476f" },
      { letter: "R", color: "#45b7ff" },
    ],
  },
];

// Small scatter cluster instead of an even ring — loosely matches a
// hand-placed group of avatars sitting near/over the country shape.
function scatterOffset(i, n) {
  const spacing = 34;
  const col = i % 2;
  const row = Math.floor(i / 2);
  const dx = (col === 0 ? -1 : 1) * (spacing / 2) + (n === 1 ? 0 : 0);
  const dy = row * spacing - ((Math.ceil(n / 2) - 1) * spacing) / 2;
  return n === 1 ? { dx: 0, dy: 0 } : { dx, dy };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function DashedLines({ selected }) {
  return (
    <g>
      {COUNTRIES.filter((c) => c.code !== selected.code).map((c) => {
        const mx = (selected.x + c.x) / 2;
        const my = Math.min(selected.y, c.y) - 70;
        return (
          <path
            key={c.code}
            d={`M${selected.x},${selected.y} Q${mx},${my} ${c.x},${c.y}`}
            fill="none"
            stroke="#f4b321"
            strokeWidth="1.5"
            strokeDasharray="6,5"
            opacity="0.5"
          />
        );
      })}
    </g>
  );
}

function Avatar({ x, y, r, color }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} fill={color} stroke="white" strokeWidth="2" />
      <circle cx="0" cy={-r * 0.32} r={r * 0.32} fill="white" />
      <path
        d={`
          M ${-r * 0.55} ${r * 0.55}
          C ${-r * 0.55} ${r * 0.05},
            ${r * 0.55} ${r * 0.05},
            ${r * 0.55} ${r * 0.55}
          Z
        `}
        fill="white"
      />
    </g>
  );
}

function CountryMarker({ country, active, onClick }) {
  const { x, y, members, name, currency } = country;
  const memberR = active ? 15 : 12;
  const labelY = -102;
  const pinY = -68;

  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      {/* leader line from label down to the marker cluster */}
      <line
        x1={x}
        y1={y + labelY + 30}
        x2={x}
        y2={y}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeDasharray="3,4"
      />
      <circle cx={x} cy={y + labelY + 28} r="3" fill="rgba(255,255,255,0.55)" />

      <g transform={`translate(${x},${y})`}>
        {active && <circle r={54} fill="rgba(255,255,255,0.06)" />}

        {members.map((m, i) => {
          const { dx, dy } = scatterOffset(i, members.length);
          return <Avatar key={i} x={dx} y={dy} r={memberR} color={m.color} />;
        })}

        <foreignObject x="-52" y={labelY} width="104" height="34">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              background: active ? "#f4b321" : "#0d1d67",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: active ? "#000" : "#fff",
                fontFamily: "system-ui,sans-serif",
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: 6,
                background: active
                  ? "rgba(0,0,0,0.12)"
                  : "rgba(255,255,255,0.1)",
                color: active ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.6)",
                fontFamily: "system-ui,sans-serif",
              }}
            >
              {currency}
            </span>
          </div>
        </foreignObject>
      </g>
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WorldMapCard() {
  const [selected, setSelected] = useState(
    COUNTRIES.find((c) => c.code === "IN"),
  );

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setSelected((prev) => {
        const idx = COUNTRIES.findIndex((c) => c.code === prev.code);
        return COUNTRIES[(idx + 1) % COUNTRIES.length];
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 500,
        background: "#071759",
        borderRadius: 24,
        overflow: "hidden",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      {/* ── Top-right: Any Currency ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          background: "rgba(6,14,56,0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "12px 14px",
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
          }}
        >
          Any Currency
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelected(c)}
              style={{
                background: selected.code === c.code ? "#f4b321" : "#0d1d67",
                border: `1px solid ${
                  selected.code === c.code
                    ? "#f4b321"
                    : "rgba(255,255,255,0.12)"
                }`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 700,
                color: selected.code === c.code ? "#000" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c.currency}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom-left: Live In ── */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          zIndex: 10,
          background: "#0d1d67",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: "10px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              position: "relative",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f4b321",
              boxShadow: "0 0 0 6px rgba(244,179,33,0.15)",
            }}
          />
          Live in
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>
          {selected.name}
        </span>
      </div>

      {/* ── SVG canvas ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Background map image */}
        <image
          x="0"
          y="0"
          width={W}
          height={H}
          href={worldMap}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Connecting arcs from the active country */}
        <DashedLines selected={selected} />

        {/* Markers */}
        {COUNTRIES.map((country) => (
          <CountryMarker
            key={country.code}
            country={country}
            active={selected.code === country.code}
            onClick={() => setSelected(country)}
          />
        ))}
      </svg>
    </div>
  );
}
