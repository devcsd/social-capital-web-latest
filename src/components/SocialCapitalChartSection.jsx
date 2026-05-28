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
  hidden: { opacity: 0, y: 40 },
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
    <section className="relative w-full overflow-hidden  py-20 px-5 md:px-10 xl:px-16">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            {/* Label */}
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 bg-white/5 mb-8">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />

              <span className="text-[12px] tracking-[0.35em] text-yellow-200 font-medium">
                TRUST & SAFETY
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-white text-5xl md:text-6xl xl:text-[72px] leading-[0.95] tracking-[-0.05em] font-semibold max-w-[700px]">
              Coordination only.
              <br />
              <span className="text-yellow-400">We never hold your money.</span>
            </h2>

            {/* Description */}
            <p className="mt-10 text-white/75 text-xl leading-relaxed max-w-[650px]">
              Social Capital is the coordination layer — schedules, mandates,
              ledgers, and reminders. Money moves peer-to-peer between members'
              own bank accounts — we never touch it.
            </p>

            {/* Info Rows */}
            <div className="mt-14 border-t border-white/10">
              {infoRows.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[120px_1fr] gap-8 py-8 border-b border-white/10">
                  <span className="text-[11px] tracking-[0.30em] text-[#C5CEFF]/70 pt-1">
                    {item.label}
                  </span>

                  <div>
                    <h4 className="text-white text-2xl font-medium mb-2">
                      {item.title}
                    </h4>

                    <p className="text-white/70 text-lg leading-relaxed max-w-[520px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Top Large Card */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 text-lg mb-8">
                <HiOutlineShieldCheck />
              </div>

              <h3 className="text-white text-[34px] leading-tight tracking-[-0.04em] font-semibold mb-5">
                No custody by design.
              </h3>

              <p className="text-white/70 text-lg leading-relaxed max-w-[720px]">
                Money moves directly between members' bank accounts on regulated
                rails. We orchestrate the schedule — we don't initiate transfers
                or hold balances.
              </p>

              {/* Flow Box */}
              <div className="mt-10 flex flex-col lg:flex-row gap-8 items-center">
                {/* Mini Diagram */}
                <div className="bg-primary-hover border border-white/10 rounded-3xl px-7 py-8 min-w-[320px]">
                  <div className="flex items-center justify-center gap-5">
                    {/* P */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-xl">
                        P
                      </div>

                      <span className="text-[10px] tracking-[0.25em] text-white/60 mt-3">
                        PAYER
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] tracking-[0.25em] text-yellow-300 mb-3 whitespace-nowrap">
                        PEER-TO-PEER
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="w-20 h-[2px] bg-yellow-400" />

                        <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-yellow-400" />
                      </div>
                    </div>

                    {/* R */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xl">
                        R
                      </div>

                      <span className="text-[10px] tracking-[0.25em] text-white/60 mt-3">
                        RECEIVER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <p className="text-white/70 text-lg leading-relaxed max-w-[320px]">
                  Social Capital sits outside the money flow. We send the
                  instruction — your bank executes it.
                </p>
              </div>
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  custom={index + 1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 min-h-[280px]">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 text-lg mb-8">
                    {card.icon}
                  </div>

                  <h3 className="text-white text-[30px] leading-tight tracking-[-0.04em] font-semibold mb-5">
                    {card.title}
                  </h3>

                  <p className="text-white/70 text-lg leading-relaxed">
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
