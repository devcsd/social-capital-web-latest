"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const steps = [
  {
    id: "1",
    title: "Create a private group",
    description:
      "Name your circle and set it up in minutes. Only invited people can see it.",
  },
  {
    id: "2",
    title: "Invite trusted members",
    description:
      "Family, classmates, colleagues — people you already know and trust.",
  },
  {
    id: "3",
    title: "Set amount and frequency",
    description:
      "Pick your currency, contribution size, and cadence — weekly, biweekly or monthly.",
  },
  {
    id: "4",
    title: "Contribute on schedule",
    description:
      "Members pay each other directly, outside the app — whatever rail your group prefers.",
  },
  {
    id: "5",
    title: "Member receives payout",
    description:
      "Each cycle the scheduled member gets the full pool — for a home, wedding, tuition or any goal.",
  },
  {
    id: "6",
    title: "Track every activity",
    description:
      "A clear ledger of who paid, who's next, and what changed — visible to everyone.",
  },
];

const paymentRails = [
  "UPI",
  "Zelle",
  "GPay",
  "PhonePe",
  "Venmo",
  "PayPal",
  "Bank",
];

const trustPoints = [
  {
    title: "Less confusion",
    description: "Clear steps, no guesswork.",
  },
  {
    title: "More visibility",
    description: "See everything in one place.",
  },
  {
    title: "Better coordination",
    description: "Stay aligned, save time.",
  },
  {
    title: "Stronger accountability",
    description: "Built-in tracking you can trust.",
  },
];

function StepBadge({ id }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFC72C] text-[15px] font-bold text-black">
      {id}
    </span>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      className="overflow-hidden py-10 lg:min-h-screen flex items-center"
      id="how-it-works">
      <div className="mx-auto max-w-[1240px] px-6 xl:px-0 w-full">
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

            <h2 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-[46px] leading-[74px] font-[650] lg:leading-[0.95] max-w-3xl">
              From trusted group to{" "}
              <span className="text-[#FFC72C]">
                organized support in 6 steps.
              </span>
            </h2>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:pl-20 lg:pt-8 mt-4 lg:mt-0">
            <p className="text-white/75 text-base sm:text-lg md:text-xl lg:text-[17px] leading-[34px] max-w-[380px] text-justify">
              Social Capital handles the coordination. You and your people
              decide the currency, cadence, members, and payout model. Money
              moves between you — we never touch it.
            </p>
          </motion.div>
        </div>

        {/* 6-step grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="
                flex flex-col gap-3
                rounded-[24px]
                border border-white/[0.08]
                bg-white/[0.04]
                backdrop-blur-2xl
                p-6
                shadow-[0_20px_80px_rgba(0,0,0,0.18)]
                transition-all duration-500
                hover:-translate-y-1
                hover:border-white/20
                hover:bg-white/[0.06]
              ">
              <StepBadge id={step.id} />
              <h3 className="mt-1 text-[19px] leading-[24px] font-semibold tracking-[-0.01em] text-white">
                {step.title}
              </h3>
              <p className="text-[15px] leading-6 text-white/65">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Config + payment rails */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-8 grid gap-7 rounded-[30px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-8 lg:grid-cols-2">
          {/* Your group decides */}
          <div>
            <span className="text-[#FFC72C] text-[11px] tracking-[0.35em] uppercase font-semibold">
              Your Group Decides
            </span>

            <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
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
          </div>

          {/* Settle any way you like */}
          <div>
            <span className="text-[#FFC72C] text-[11px] tracking-[0.35em] uppercase font-semibold">
              Settle Any Way You Like
            </span>

            <div className="mt-5 flex flex-wrap gap-2">
              {paymentRails.map((item) => (
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

            <p className="mt-4 text-[13px] leading-6 text-white/50">
              Money moves peer-to-peer between members — never through Social
              Capital.
            </p>
          </div>
        </motion.div>

        {/* Trust banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-8 rounded-[30px] border border-white/[0.08] bg-[#0b11306c] p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <ShieldCheck className="w-5 h-5 text-[#FFC72C]" />
            </div>

            <div>
              <h3 className="text-white text-xl sm:text-2xl font-semibold">
                Social Capital does not hold your money.
              </h3>
              <p className="mt-2 text-white/65 text-[15px] leading-7 max-w-2xl">
                It gives your group the structure, visibility, and
                accountability to run its own process with confidence.
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title}>
                <p className="text-[#FFC72C] font-semibold text-[15px]">
                  {point.title}
                </p>
                <p className="mt-1 text-white/60 text-sm">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
