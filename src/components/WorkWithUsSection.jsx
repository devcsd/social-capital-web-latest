"use client";

import { motion } from "framer-motion";
import { Users, HandCoins, Zap } from "lucide-react";

const steps = [
  {
    id: "01",
    label: "FORM",
    icon: Users,
    title: "Invite your people,\nset the rules.",
    description:
      "Choose members you trust — family, classmates, colleagues. Pick your group's currency, cadence, and payout model.",
    extra: (
      <div className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="tracking-[0.2em] uppercase text-white/50 text-xs">
              Currency
            </span>
            <span className="text-white font-semibold">₹ INR</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="tracking-[0.2em] uppercase text-white/50 text-xs">
              Cadence
            </span>

            <div className="flex gap-2 flex-wrap justify-end">
              <span className="px-3 py-1 rounded-full border border-white/10 text-white/50 text-xs">
                Weekly
              </span>

              <span className="px-3 py-1 rounded-full bg-[#FFC72C] text-black font-semibold text-xs">
                Bi-weekly
              </span>

              <span className="px-3 py-1 rounded-full border border-white/10 text-white/50 text-xs">
                Monthly
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="tracking-[0.2em] uppercase text-white/50 text-xs">
              Payout
            </span>

            <span className="text-white font-semibold">Rotation</span>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "02",
    label: "SETTLE",
    icon: HandCoins,
    title: "Pay each other directly\n— any way you like.",
    description:
      "Money moves peer-to-peer between members, outside the app. Use whatever rail your group prefers — even cash. Social Capital tracks who paid, sends reminders, and keeps the ledger honest.",
    extra: (
      <div className="mt-8 flex flex-wrap gap-3">
        {[
          "UPI",
          "Zelle",
          "GPay",
          "PhonePe",
          "Venmo",
          "Cash App",
          "PayPal",
          "Wise",
          "Bank",
        ].map((item) => (
          <span
            key={item}
            className="px-3 py-1.5 rounded-full border border-white/10 text-white/70 text-[11px] font-medium">
            {item}
          </span>
        ))}

        <span className="px-3 py-1.5 rounded-full bg-[#FFC72C] text-black text-[11px] font-bold">
          Cash
        </span>
      </div>
    ),
  },

  {
    id: "03",
    label: "RECEIVE",
    icon: Zap,
    title: "One member\ngets the full pool.",
    description:
      "Each cycle, the scheduled member receives the lump sum directly from the group — for a home, wedding, tuition, or any goal.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      className="overflow-hidden py-20 lg:min-h-screen flex items-center"
      id="how-it-works">
      <div className="mx-auto max-w-[1240px] px-6 xl:px-0">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-5 py-2 mb-8 bg-white/[0.03]">
              <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              <span className="text-[#FFC72C] uppercase tracking-[0.25em] text-xs font-semibold">
                How It Works
              </span>
            </div>

            <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-[62px] leading-[74px] font-[650]  lg:leading-[0.95]  max-w-3xl">
              Three steps from{" "}
              <span className="text-[#FFC72C]">invite to payout.</span>
            </h2>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:pl-20 lg:pt-8 mt-4 lg:mt-0">
            <p className="text-white/75 text-base sm:text-lg md:text-xl lg:text-[17px] leading-[34px]  max-w-[380px]   text-justify py-10">
              Social Capital handles the coordination. You and your people
              decide the currency, cadence, members, and payout model. Money
              moves between you — we never touch it.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-6 xl:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="
    flex
    flex-col
    h-[500px]
    rounded-[30px]
    border
    border-white/[0.08]
    bg-white/[0.04]
    backdrop-blur-2xl
    p-7
    shadow-[0_20px_80px_rgba(0,0,0,0.18)]
    transition-all
    duration-500
    hover:-translate-y-2
    hover:border-white/20
    hover:bg-white/[0.06]
  ">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                  <Icon className="w-5 h-5 text-[#FFC72C]" />
                </div>

                {/* Label */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[#FFC72C] text-[11px] tracking-[0.35em] uppercase font-semibold">
                    {step.id}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-[#FFC72C]" />

                  <span className="text-[#FFC72C] text-[11px] tracking-[0.35em] uppercase font-semibold">
                    {step.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 whitespace-pre-line text-[26px] leading-[31px] font-semibold tracking-[-0.02em] text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-[16px] leading-7 text-white/65">
                  {step.description}
                </p>

                {/* Extra Content */}
                {step.extra && <div className="mt-auto pt-6">{step.extra}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
