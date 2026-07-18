"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Bell,
  Scale,
  Users,
  Lock,
  ArrowRight,
} from "lucide-react";

const leftInfo = [
  {
    label: "MONEY FLOW",
    title: "Peer to peer",
    desc: "Direct bank-to-bank transfers. Social Capital holds no balance.",
  },
  {
    label: "SCHEDULING",
    title: "Automated reminders",
    desc: "Mandate-ready flows keep contributions on schedule. We orchestrate — we don't debit.",
  },
  {
    label: "REGULATORY",
    title: "Lean by design",
    desc: "Not an NBFC, not a deposit-taker. Pure software coordination.",
  },
  {
    label: "PRIVACY",
    title: "Your data, yours",
    desc: "Group activity stays private to members. We don't sell or share data.",
  },
];

const smallCards = [
  {
    icon: Bell,
    title: "Schedule reminders",
    desc: "Smart reminders and mandate-ready flows help every member contribute on time — no chasing, no awkward messages.",
  },
  {
    icon: Scale,
    title: "Transparent ledger",
    desc: "Every contribution, payout, and rule change is logged and visible to every member — no hidden moves.",
  },
  {
    icon: Users,
    title: "Trusted groups only",
    desc: "Members invite people they already know. Social Capital is built for groups of friends, family, and colleagues — not strangers.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    desc: "Group activity stays private to its members. We don't sell or share data, and you can leave or export your records anytime.",
  },
];

const trustItems = [
  "NO CUSTODY OF MONEY",
  "PEER-TO-PEER TRANSFERS",
  "ISO 27001 IN PROGRESS",
  "REGULATOR-ALIGNED ARCHITECTURE",
  "END-TO-END ENCRYPTED",
];

const glassCardStyle = {
  background: `
    linear-gradient(
      180deg,
      rgba(93,126,255,.18) 0%,
      rgba(72,104,245,.12) 48%,
      rgba(55,84,215,.08) 100%
    )
  `,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,.08),
    inset 0 -1px 0 rgba(255,255,255,.02),
    0 35px 120px rgba(5,18,80,.25)
  `,
};

export default function SocialCapitalChartSection() {
  return (
    <section
      className="relative overflow-hidden py-[130px] px-[130px]"
      // style={{
      //   background:
      //     "linear-gradient(135deg, #3D63EA 0%, #2B4FDB 40%, #1D3AA8 75%, #16307F 100%)",
      // }}
      >
      {/* Background Glow */}
      <div className="absolute left-[-220px] top-[140px] h-[520px] w-[520px] rounded-full bg-[#6F91FF]/15 blur-[170px]" />
      <div className="absolute right-[-220px] top-[60px] h-[460px] w-[460px] rounded-full bg-[#FFC72C]/6 blur-[170px]" />
      <div className="absolute left-1/2 top-[-220px] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[170px]" />

      <div className="relative mx-auto max-w-[1480px] px-[30px]">
        {/* ================= TOP ================= */}
        <div className="grid grid-cols-[42%_58%] gap-[40px] items-start">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-6 py-[11px] backdrop-blur-xl">
              <span className="h-[7px] w-[7px] rounded-full bg-[#FFC72C] shadow-[0_0_14px_rgba(255,199,44,.6)]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#FFC72C]">
                TRUST & SAFETY
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-10 text-[52px] leading-[58px] font-bold tracking-[-0.02em] text-white">
              Coordination only.
              <br />
              <span className="text-[#FFC72C]">
                We never hold your
                <br />
                money.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-[40px] max-w-[560px] text-[20px] leading-[38px] text-white/72">
              Social Capital is the coordination layer — schedules, mandates,
              ledgers and reminders. Money moves peer-to-peer between members'
              own bank accounts — we never touch it.
            </p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full">
            <div
              className="relative overflow-hidden rounded-[34px] border border-white/10 p-[40px] backdrop-blur-[34px]"
              style={{ ...glassCardStyle, minHeight: 390 }}>
              {/* Top Reflection */}
              <div className="absolute left-0 right-0 top-0 h-[130px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              {/* Ambient Glow */}
              <div className="absolute -right-20 -top-20 h-[240px] w-[240px] rounded-full bg-[#5D7EFF]/15 blur-[90px]" />
              {/* Bottom Shadow Glow */}
              <div className="absolute bottom-[-120px] left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />

              {/* Icon */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/10 bg-[#5578FF]/20">
                <ShieldCheck className="h-5 w-5 text-[#FFC72C]" />
              </div>

              {/* Title */}
              <h3 className="relative mt-6 text-[26px] leading-[32px] font-semibold text-white">
                No custody, by design.
              </h3>

              {/* Description */}
              <p className="relative mt-4 max-w-[480px] text-[18px] leading-[36px] text-white/72">
                Money moves directly between members' bank accounts on regulated
                rails. We orchestrate the schedule — we don't initiate transfers
                or hold balances.
              </p>

              {/* Payment Row */}
              <div className="relative mt-8 flex flex-nowrap items-center gap-[28px]">
                {/* Payment Card */}
                <div
                  className="relative flex h-[105px] w-[250px] shrink-0 items-center justify-between overflow-hidden rounded-[18px] border border-white/10 px-[18px]"
                  style={{
                    background: `
                      linear-gradient(
                        180deg,
                        rgba(23,31,76,.98) 0%,
                        rgba(18,25,63,.98) 100%
                      )
                    `,
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,.05),
                      0 18px 40px rgba(0,0,0,.28)
                    `,
                  }}>
                  <div className="absolute left-1/2 top-[-50px] h-[120px] w-[120px] -translate-x-1/2 rounded-full bg-[#5D7EFF]/10 blur-[60px]" />

                  {/* PAYER */}
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFC72C] shadow-[0_0_20px_rgba(255,199,44,.35)]">
                      <span className="text-[15px] font-bold text-[#1A1A1A]">
                        P
                      </span>
                    </div>
                    <span className="mt-2 text-[8px] font-medium uppercase tracking-[0.28em] text-white/55">
                      PAYER
                    </span>
                  </div>

                  {/* CENTER */}
                  <div className="relative flex flex-col items-center">
                    <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/35">
                      PEER TO PEER
                    </span>
                    <div className="mt-2 flex items-center">
                      <div className="h-px w-[26px] bg-[#FFC72C]" />
                      <ArrowRight className="ml-1 h-3 w-3 text-[#FFC72C]" />
                    </div>
                  </div>

                  {/* RECEIVER */}
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4F74FF] shadow-[0_0_20px_rgba(79,116,255,.35)]">
                      <span className="text-[15px] font-bold text-white">
                        R
                      </span>
                    </div>
                    <span className="mt-2 text-[8px] font-medium uppercase tracking-[0.28em] text-white/55">
                      RECEIVER
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="w-[230px] flex items-center">
                  <p className="text-[15px] leading-[26px] text-white/70">
                    Social Capital sits outside the money flow. We send the
                    instruction — your bank executes it.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="mt-[18px] grid grid-cols-[42%_58%] gap-[40px]">
          {/* LEFT */}
          <div>
            {leftInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="border-b border-white/[0.08] py-[18px] last:border-none">
                <div className="grid grid-cols-[100px_1fr] gap-12 items-start">
                  <div>
                    <span className="inline-block rounded-full  border-white/10 bg-[#3557D6]/30 px-3 py-[6px] text-[10px] font-medium uppercase tracking-[0.28em] text-[#C8D5FF]">
                      {item.label}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[16px] leading-[26px] text-white/70">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-[18px]">
            {smallCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group relative h-[250px] overflow-hidden rounded-[28px] border border-white/10 p-[24px]  backdrop-blur-[35px] transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
                  style={glassCardStyle}>
                  <div className="absolute left-0 right-0 top-0 h-[80px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none " />
                  <div className="absolute right-[-60px] top-[-60px] h-[160px] w-[160px] rounded-full bg-[#5C7BFF]/15 blur-[70px]" />

                  {/* Icon */}
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#5377FF]/18 backdrop-blur-xl">
                    <Icon className="h-4 w-4 text-[#FFC72C]" />
                  </div>

                  {/* Title */}
                  <h3 className="relative mt-4 text-[18px] font-semibold leading-[24px] text-white">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="relative mt-2 text-[15px] leading-[28px] text-white/72">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= FOOTER / TRUST BAR ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-10">
          <div className="min-h-[72px] rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl px-10 py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34D399]">
                    <ShieldCheck size={14} className="text-[#02130A]" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-white/85">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
