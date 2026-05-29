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
      <div className="mt-8 border border-white/10 rounded-2xl p-5 bg-white/[0.03]">
        <div className="space-y-4 text-sm">
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
            className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs font-medium"
          >
            {item}
          </span>
        ))}

        <span className="px-4 py-2 rounded-full bg-[#FFC72C] text-black text-xs font-bold">
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
    <section className="overflow-hidden bg-primary py-16 lg:min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Section */}
<div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-5 py-2 mb-8 bg-white/[0.03]">
              <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              <span className="text-[#FFC72C] uppercase tracking-[0.25em] text-xs font-semibold">
                How It Works
              </span>
            </div>

     <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight lg:leading-[0.95] tracking-tight max-w-3xl">
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
  className="lg:pl-20 lg:pt-8 mt-4 lg:mt-0"
          >
         <p className="text-white/75 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              Social Capital handles the coordination. You and your people
              decide the currency, cadence, members, and payout model. Money
              moves between you — we never touch it.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
   <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-20">
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
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 lg:p-9 min-h-auto lg:min-h-[520px] flex flex-col"
              >
                {/* Icon */}
      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-[#FFC72C]" />
                </div>

                {/* Label */}
                <div className="mt-8 flex items-center gap-3">
                  <span className="text-[#FFC72C] text-sm tracking-[0.3em] font-semibold">
                    {step.id}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-[#FFC72C]" />

                  <span className="text-[#FFC72C] text-sm tracking-[0.3em] font-semibold">
                    {step.label}
                  </span>
                </div>

                {/* Title */}
             <h3 className="mt-6 text-white text-2xl sm:text-3xl lg:text-4xl leading-tight font-bold whitespace-pre-line">
                  {step.title}
                </h3>

                {/* Description */}
          <p className="mt-4 lg:mt-6 text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed">
                  {step.description}
                </p>

                {/* Extra Content */}
                {step.extra && <div className="mt-auto pt-8">{step.extra}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
