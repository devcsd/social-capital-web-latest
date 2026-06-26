import { useState, useEffect } from "react";

const W = 900, H = 500;

const COUNTRIES = [
  {
    code: "US", name: "USA", currency: "$",
    x: 185, y: 200,
    center: { letter: "L", color: "#f4b321" },
    members: [
      { letter: "A", color: "#f4b321" },
      { letter: "P", color: "#2ec27e" },
      { letter: "R", color: "#c678dd" },
      { letter: "N", color: "#5b7cfa" },
      { letter: "V", color: "#ef476f" },
    ],
  },
  {
    code: "GB", name: "UK", currency: "£",
    x: 415, y: 120,
    center: { letter: "L", color: "#45b7ff" },
    members: [
      { letter: "S", color: "#45b7ff" },
      { letter: "M", color: "#f4b321" },
      { letter: "D", color: "#8b5cf6" },
    ],
  },
  {
    code: "IN", name: "India", currency: "₹",
    x: 617, y: 230,
    center: { letter: "L", color: "#f4b321" },
    members: [
      { letter: "K", color: "#eab308" },
      { letter: "M", color: "#c084fc" },
      { letter: "J", color: "#2ec27e" },
      { letter: "I", color: "#5b7cfa" },
      { letter: "T", color: "#14b8a6" },
      { letter: "C", color: "#ef476f" },
      { letter: "R", color: "#f87171" },
      { letter: "S", color: "#0ea5e9" },
    ],
  },
  {
    code: "AE", name: "Dubai", currency: "AED",
    x: 535, y: 275,
    center: { letter: "D", color: "#8b5cf6" },
    members: [
      { letter: "A", color: "#f4b321" },
      { letter: "S", color: "#45b7ff" },
      { letter: "M", color: "#f4b321" },
    ],
  },
  {
    code: "AU", name: "Australia", currency: "A$",
    x: 745, y: 345,
    center: { letter: "B", color: "#2ec27e" },
    members: [
      { letter: "I", color: "#8b5cf6" },
      { letter: "Q", color: "#c084fc" },
    ],
  },
];

// ── Mercator projection matching the marker coordinates ──────────────────────
function project(lon, lat) {
  const x = ((lon + 180) / 360) * W;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = H / 2 - ((W * mercN) / (2 * Math.PI)) * 0.72;
  return [x, y];
}

// ── Correct topojson delta-decode ────────────────────────────────────────────
function decodeTopojson(world) {
  const { arcs, transform, objects } = world;
  const [sx, sy] = transform.scale;
  const [tx, ty] = transform.translate;

  function decodeArc(arcIdx) {
    const reversed = arcIdx < 0;
    const raw = arcs[reversed ? ~arcIdx : arcIdx];
    let ax = 0, ay = 0;
    const pts = raw.map(([dx, dy]) => {
      ax += dx; ay += dy;
      return [ax * sx + tx, ay * sy + ty];
    });
    return reversed ? pts.reverse() : pts;
  }

  function ringToPath(arcRefs) {
    const pts = arcRefs.flatMap((ref) => decodeArc(ref));
    if (!pts.length) return "";
    const [[lx, ly], ...rest] = pts;
    const [px0, py0] = project(lx, ly);
    let d = `M${px0.toFixed(1)},${py0.toFixed(1)}`;
    for (const [lon, lat] of rest) {
      const [px, py] = project(lon, lat);
      d += `L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return d + "Z";
  }

  function geomToPaths(geom) {
    if (geom.type === "Polygon") {
      return [geom.arcs.map(ringToPath).join("")].filter(Boolean);
    }
    if (geom.type === "MultiPolygon") {
      return geom.arcs.map((poly) => poly.map(ringToPath).join("")).filter(Boolean);
    }
    return [];
  }

  return objects.countries.geometries.flatMap(geomToPaths);
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
            opacity="0.65"
          />
        );
      })}
    </g>
  );
}

function CountryMarker({ country, active, onClick }) {
  const { x, y, center, members, name, currency } = country;
  const memberRadius = active ? 46 : 36;
  const centerR      = active ? 30 : 22;
  const memberR      = active ? 16 : 13;
  const labelY       = active ? -92 : -78;

  return (
    <g transform={`translate(${x},${y})`} style={{ cursor: "pointer" }} onClick={onClick}>
      {active && (
        <>
          <circle r={56} fill="rgba(255,255,255,0.07)" />
          <circle r={76} fill="rgba(255,255,255,0.035)" />
        </>
      )}

      {members.map((m, i) => {
        const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        const mx = Math.cos(angle) * memberRadius;
        const my = Math.sin(angle) * memberRadius;
        return (
          <g key={i} transform={`translate(${mx},${my})`}>
            <circle r={memberR} fill={m.color} stroke="white" strokeWidth="2" />
            <text
              textAnchor="middle"
              dy={memberR * 0.42}
              fill="white"
              fontSize={active ? 15 : 12}
              fontWeight="700"
              fontFamily="system-ui,sans-serif"
            >
              {m.letter}
            </text>
          </g>
        );
      })}

      <circle r={centerR} fill={center.color} stroke="white" strokeWidth="3.5" />
      <text
        textAnchor="middle"
        dy={centerR * 0.42}
        fill="white"
        fontSize={active ? 30 : 22}
        fontWeight="700"
        fontFamily="system-ui,sans-serif"
      >
        {center.letter}
      </text>

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
            gap: 5,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#000" : "#fff", fontFamily: "system-ui,sans-serif" }}>
            {name}
          </span>
          <span style={{ fontSize: 11, color: active ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)", fontFamily: "system-ui,sans-serif" }}>
            {currency}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WorldMapCard() {
  const [selected, setSelected]   = useState(COUNTRIES.find((c) => c.code === "IN"));
  const [mapPaths, setMapPaths]   = useState([]);
  const [mapReady, setMapReady]   = useState(false);

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

  // Load & decode world map
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((world) => {
        setMapPaths(decodeTopojson(world));
        setMapReady(true);
      })
      .catch(() => setMapReady(true));
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 500,
      background: "#071759",
      borderRadius: 24,
      overflow: "hidden",
      fontFamily: "system-ui,sans-serif",
    }}>

      {/* ── Top-right: Any Currency ── */}
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 50,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
        }}>
          Any Currency
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelected(c)}
              style={{
                background: selected.code === c.code ? "#f4b321" : "#0d1d67",
                border: `1px solid ${selected.code === c.code ? "#f4b321" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
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
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 50,
        background: "#0d1d67",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14, padding: "10px 16px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
        }}>
          Live in
        </span>
        <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
          {selected.name}
        </span>
      </div>

      {/* ── SVG canvas ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.15)" />
          </pattern>
        </defs>

        {/* Dot grid */}
        <rect width={W} height={H} fill="url(#dots)" />

        {/* Country shapes */}
        {mapPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(120,150,255,0.13)"
            stroke="rgba(180,200,255,0.18)"
            strokeWidth="0.5"
          />
        ))}

        {/* Connecting arcs */}
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