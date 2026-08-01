"use client";

import { color, motion } from "framer-motion";
import {
  Gem,
  Car,
  Lightbulb,
  Monitor,
  Home,
  GraduationCap,
  Heart,
} from "lucide-react";

const cards = [
  {
    id: "gold",
    icon: "gold",
    tag: "Gold & savings",
    desc: "10 people, $250 / ₹21,000 biweekly — buy at today’s price, not next year’s.",
    tone: "gold",
    pool: "$2,500",
    poolAlt: "₹2,10,000",
    members: "Lakshmi, Meera, Priya + 7 others",
    freq: "Biweekly",
    pct: 30,
    people: ["Lakshmi", "Meera", "Priya", "Kiran", "Anil"],
    title: "Gold that grows with your group.",
    spotlight: true,
    ribbon: "Most popular",
    velocity:
      "Average turn: week 11 of 20 — buy at today’s price with tomorrow’s savings.",
    statDesc: "10 members • Biweekly • this cycle’s payout",
  },
  {
    id: "car",
    icon: "car",
    tag: "Student essentials",
    title: "Your first car, before credit history exists.",
    desc: "10 students, $250 monthly — no credit check, no cosigner, just your turn.",
    tone: "rose",
    pool: "$2,500",
    members: "Arjun, Neha, Ravi + 7 others",
    freq: "Monthly",
    pct: 60,
    people: ["Arjun", "Neha", "Ravi", "Sana", "Dev"],
    velocity:
      "Average turn: month 5 of 10 — about half the time of saving alone.",
    afterNote:
      "After 10 turns: everyone has a car — or the group rolls into the next goal (laptop, deposit, next semester).",
    color: "#FFC72C",
    statDesc: "10 members • Weekly • this cycle’s payout",
  },
  {
    id: "bigideas",
    icon: "ideas",
    tag: "Big goals, one circle",
    title: "Big expenses. Smaller contributions.",
    desc: "10 people, ₹10,000 / $120 biweekly — reach the goal without touching an EMI.",
    tone: "blue",
    pool: "₹1,00,000",
    poolAlt: "$1,200",
    members: "Rahul, Anita, Vikram + 7 others",
    freq: "Biweekly",
    pct: 68,
    people: ["Rahul", "Anita", "Vikram", "Divya", "Sam"],
    velocity:
      "Average turn: week 11 of 20 — about half the time of saving alone.",
    categories: [
      { key: "tech", label: "Tech Upgrade" },
      { key: "home", label: "Home Improvements" },
      { key: "college", label: "College Costs" },
      { key: "lifestyle", label: "Lifestyle Upgrade" },
    ],
    color: "#FFC72C",
    statDesc: "10 members • Monthly • this cycle’s payout",
  },
];

const UCIcon = {
  gold: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  ),
  car: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M3 13l1.5-5A2 2 0 016.4 6.5h11.2A2 2 0 0119.5 8l1.5 5" />
      <rect x="3" y="13" width="18" height="5" rx="1.5" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </svg>
  ),
  ideas: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0012 3z" />
    </svg>
  ),
};

const toneRing = {
  gold: "before:bg-[linear-gradient(135deg,#ffc72c,#e8a90b)]",
  rose: "before:bg-[linear-gradient(135deg,#f472b6,#a78bfa)]",
  blue: "before:bg-[linear-gradient(135deg,#4072ff,#a78bfa)]",
};

const toneIconBg = {
  gold: "bg-[#ffc72c]/10 text-[#ffc72c] ring-1 ring-[#ffc72c]/25",
  rose: "bg-[#f472b6]/10 text-[#f472b6] ring-1 ring-[#f472b6]/25",
  blue: "bg-[#4072ff]/10 text-[#4072ff] ring-1 ring-[#4072ff]/25",
};

const chips = [
  { from: "Interest", to: "None" },
  { from: "12-month lock-in", to: "Your cadence" },
  { from: "Credit check", to: "Just trust" },
];

const toneStyles = {
  gold: {
    glow: "bg-[radial-gradient(circle_at_top_right,rgba(255,199,44,0.45),transparent_55%)]",
    border: "border-[#6c5a2c]/70",
    iconBg: "bg-white/10 text-[#FFC72C]",
    accent: "text-[#FFD46A]",
  },
  rose: {
    glow: "bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.35),transparent_55%)]",
    border: "border-white/10",
    iconBg: "bg-white/10 text-[#A78BFA]",
    accent: "text-[#FFD46A]",
  },
  blue: {
    glow: "bg-[radial-gradient(circle_at_top_right,rgba(64,114,255,0.35),transparent_55%)]",
    border: "border-white/10",
    iconBg: "bg-white/10 text-[#60A5FA]",
    accent: "text-[#FFD46A]",
  },
};

/* ---------- Small subcomponents ---------- */
function People({ names = [], members }) {
  const shown = names.slice(0, 5);
  const extra = Math.max(members - shown.length, 0);

  const gradients = [
    "from-[#FFCB2D] to-[#F59E0B]", // Yellow
    "from-[#F58BD7] to-[#A855F7]", // Pink
    "from-[#34D399] to-[#059669]", // Green
    "from-[#7CA8FF] to-[#4F6DFF]", // Blue
    "from-[#FF6B8B] to-[#F43F5E]", // Red
  ];

  return (
    <div className="flex items-center mt-2">
      <div className="flex -space-x-3">
        {shown.map((n, i) => (
          <div
            key={i}
            title={n}
            className={`
              w-10 h-10
              rounded-full
              flex items-center justify-center
              text-white
              text-sm
              font-bold
              bg-gradient-to-br ${gradients[i % gradients.length]}
              border-[3px] border-[#0b1233]
              shadow-[0_8px_18px_rgba(0,0,0,.35)]
              transition-transform duration-300
              hover:scale-110
            `}
          >
            {n.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>

      <span className="ml-2 text-sm text-white/75 font-medium">{members}</span>
    </div>
  );
}

function CircleMeta({ c }) {
  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-baseline justify-between">
        <div className="font-display text-2xl font-semibold text-white">
          {c.pool}
        </div>
        {c.poolAlt && <div className="text-xs text-white/50">{c.pct}% there</div>}
      </div>
      <div className="mt-1 text-xs text-white/55">{c.freq} contributions</div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#4072ff,#a78bfa,#ffc72c)]"
          style={{ width: `${c.pct}%` }}
        />
      </div>
      <div className="mt-3 text-xs leading-relaxed text-white/60">
        {c.statDesc}
      </div>
     <div className="border-t-2 border-gray-500 mt-2 "/>
      {c.velocity && (
        <div className={`mt-3 text-xs leading-relaxed text-yellow-500`}>
          {c.velocity}
        </div>
      )}
    </div>
  );
}

const ChipIcon = {
  tech: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="4" y="4" width="16" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  home: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  ),
  college: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  ),
  lifestyle: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M12 21s-7-4.35-9.5-8.6C.8 8.8 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.2 3.8 3.5 7.4C19 16.65 12 21 12 21z" />
    </svg>
  ),
};

export default function HowItWorksSection() {
  return (
    <section
      className="relative overflow-hidden bg-primary py-24"
      id="how-it-works"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,140,255,0.35)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/4 h-[500px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(80,100,255,0.25)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFC72C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
              What you can do with it
            </span>
          </div>

          <h2 className="text-[38px] sm:text-[52px] md:text-[64px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Big goals don&apos;t need credit.{" "}
            <span className="text-[#FFC72C]">Just trust.</span>
          </h2>

          <p className="mt-8 max-w-2xl text-[16px] sm:text-[18px] leading-[30px] text-white/70">
            Same simple idea — small contributions, structured rounds, your turn
            — applied to whatever your group is building toward. No lender, no
            interest, no credit check, and no waiting years to get there.
          </p>
        </motion.div>

        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          {" "}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {cards.map((c, i) => {
              const Icon = UCIcon[c.icon];

              return (
                <div
                  className={`mt-5
    relative overflow-hidden rounded-[36px] border bg-[#0E1640]
    p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]
    transition-transform duration-300 hover:-translate-y-2
    ${toneStyles[c.tone].border}
  `}
                >
                  {/* Background Glow */}
                  <div
                    className={`absolute inset-0 ${toneStyles[c.tone].glow}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_35%,rgba(0,0,0,0.25))]" />

                  {/* Ribbon */}
                  {c.ribbon && (
                    <div className="absolute right-8 top-3 z-20 rounded-full bg-[#FFC72C] px-3 py-2 text-xs font-semibold text-[#1b1606] shadow-[0_12px_30px_rgba(255,199,44,.45)]">
                      {c.ribbon}
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex flex-1 flex-col">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="
                flex h-14    w-14 shrink-0 items-center justify-center
                rounded-[10px]
                border border-white/15
                bg-[linear-gradient(180deg,#56546b,#2e3159)]
                shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_20px_40px_rgba(0,0,0,.35)]
              "
                      >
                        <Icon className="h-12 w-12 text-[#ffc72c]" />
                      </div>

                      <div className="pt-3">
                        <p className="text-xs font-semibold text-[#FFD46A]">
                          {c.tag}
                        </p>

                        <h3 className="mt-3 max-w-[420px] text-[24px] font-bold leading-[1.05] tracking-[-0.04em] text-white">
                          {c.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-[12px] leading-relaxed text-white/70">
                      {c.desc}
                    </p>

                    {/* People */}
                    {c.people && (
                      <div className="mt-2">
                        <People names={c.people} members={c.members} />
                      </div>
                    )}

                    {/* Statistics Card */}
                    {c.pool && <CircleMeta c={c} />}

                    {/* Categories */}
                    {c.categories && (
                      <div className="mt-8 grid grid-cols-2 gap-3">
                        {c.categories.map((cat) => {
                          const CI = ChipIcon[cat.key];

                          return (
                            <div
                              key={cat.key}
                              className="
                      flex items-center gap-3
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      px-4
                      py-3
                      transition-all
                      duration-300
                      hover:bg-white/10
                    "
                            >
                              <span className="text-[#FFC72C]">
                                <CI />
                              </span>

                              <span className="text-sm text-white/75">
                                {cat.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer */}
                    {c.afterNote && (
                      <div className="mt-auto pt-8">
                        <div className="border-t border-white/10 pt-6 text-sm leading-relaxed">
                          {c.afterNote}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Border Glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-8 rounded-[30px] border border-white/10 bg-[#171B3D]/70 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
          <span className="text-[15px] font-medium text-white/60">
            Why not just put it on an EMI?
          </span>

          <div className=" flex flex-wrap items-baseline gap-3">
            <span className="text-[40px] sm:text-[52px] font-extrabold tracking-[-0.02em] text-[#4ADE80]">
              $90–$1,100
            </span>
            <span className="text-[16px] sm:text-[18px] text-white/70">
              interest you simply don&apos;t pay
            </span>
          </div>

          <div className=" flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {chips.map((chip) => (
              <div
                key={chip.from}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5"
              >
                <span className="text-[13px] text-red-400 line-through">
                  {chip.from}
                </span>
                <span className="text-white/30">&rarr;</span>
                <span className="text-[13px] font-semibold text-[#4ADE80]">
                  {chip.to}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 border-t border-white/[0.08] pt-4">
            <p className="text-[15px] leading-[26px] text-white/70">
              Savings apply to every member. How soon you get there depends on
              your turn — the average member arrives in about half the time of
              saving alone.
            </p>
            <p className="text-[12px] leading-[20px] text-white/35">
              Assumes typical rates: ~24% APR on cards, 14% on used-car loans,
              carried 12 months.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
