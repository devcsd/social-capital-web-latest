"use client";

import { motion } from "framer-motion";
import { FaShieldAlt, FaBalanceScale, FaLock, FaUsers } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi2";

const infoRows = [
  {
    label: "MONEY FLOW",
    title: "Peer to peer",
    description:
      "Direct bank-to-bank transfers. Social Capital holds no balance.",
  },
  {
    label: "SCHEDULING",
    title: "Automated reminders",
    description:
      "Mandate-ready flows keep contributions on schedule. We orchestrate — we don't debit.",
  },
  {
    label: "REGULATORY",
    title: "Lean by design",
    description:
      "Not an NBFC, not a deposit-taker. Pure software coordination.",
  },
  {
    label: "PRIVACY",
    title: "Your data, yours",
    description:
      "Group activity stays inside the circle. We don't sell or share member data.",
  },
];

const cards = [
  {
    icon: <FaShieldAlt />,
    title: "Schedule reminders",
    description:
      "Smart reminders and mandate-ready flows help every member contribute on time — no chasing, no awkward messages.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Transparent ledger",
    description:
      "Every contribution, payout, and rule change is logged and visible to every member — no hidden moves.",
  },
  {
    icon: <FaUsers />,
    title: "Trusted circles only",
    description:
      "Members invite people they already know. Social Capital is built for groups of friends, family, and colleagues — not strangers.",
  },
  {
    icon: <FaLock />,
    title: "Your data stays yours",
    description:
      "Group activity stays inside the circle. We don't sell or share member data, and you can leave or export your records any time.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export default function TrustAndSafetySection() {
  return (
    <section className="relative w-full overflow-hidden py-14 md:py-20 px-4 sm:px-6 lg:px-10 xl:px-16">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 bg-white/5 mb-6 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-[10px] sm:text-[12px] tracking-[0.25em] md:tracking-[0.35em] text-yellow-200 font-medium">
                TRUST & SAFETY
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl xl:text-[72px] leading-tight xl:leading-[0.95] tracking-tight xl:tracking-[-0.05em] font-semibold">
              Coordination only.
              <br />
              <span className="text-yellow-400">
                We never hold your money.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 md:mt-10 text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-[650px]">
              Social Capital is the coordination layer — schedules, mandates,
              ledgers, and reminders. Money moves peer-to-peer between members'
              own bank accounts — we never touch it.
            </p>

            {/* Info Rows */}
            <div className="mt-10 md:mt-14 border-t border-white/10">
              {infoRows.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-3 md:gap-8 py-6 md:py-8 border-b border-white/10"
                >
                  <span className="text-[10px] md:text-[11px] tracking-[0.25em] md:tracking-[0.30em] text-[#C5CEFF]/70">
                    {item.label}
                  </span>

                  <div>
                    <h4 className="text-white text-xl md:text-2xl font-medium mb-2">
                      {item.title}
                    </h4>

                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[520px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <div className="space-y-5 md:space-y-6">
            {/* Main Card */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6 md:p-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 text-lg mb-6 md:mb-8">
                <HiOutlineShieldCheck />
              </div>

              <h3 className="text-white text-2xl sm:text-3xl md:text-[34px] leading-tight tracking-tight font-semibold mb-4 md:mb-5">
                No custody by design.
              </h3>

              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Money moves directly between members' bank accounts on regulated
                rails. We orchestrate the schedule — we don't initiate transfers
                or hold balances.
              </p>

              {/* Flow Diagram */}
              <div className="mt-8 md:mt-10 flex flex-col xl:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full xl:w-auto bg-primary-hover border border-white/10 rounded-3xl px-4 sm:px-6 py-6 md:py-8">
                  <div className="flex items-center justify-center gap-2 sm:gap-5">
                    {/* Payer */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg sm:text-xl">
                        P
                      </div>

                      <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/60 mt-3">
                        PAYER
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] sm:text-[11px] tracking-[0.2em] text-yellow-300 mb-3 whitespace-nowrap">
                        PEER-TO-PEER
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="w-10 sm:w-20 h-[2px] bg-yellow-400" />

                        <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-yellow-400" />
                      </div>
                    </div>

                    {/* Receiver */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-lg sm:text-xl">
                        R
                      </div>

                      <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/60 mt-3">
                        RECEIVER
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[320px] text-center xl:text-left">
                  Social Capital sits outside the money flow. We send the
                  instruction — your bank executes it.
                </p>
              </div>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  custom={index + 1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6 md:p-8 min-h-[220px] md:min-h-[280px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 text-lg mb-6 md:mb-8">
                    {card.icon}
                  </div>

                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight font-semibold mb-4 md:mb-5">
                    {card.title}
                  </h3>

                  <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}