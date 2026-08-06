"use client";

import { motion } from "framer-motion";

const payoutModels = [
  {
    id: "R",
    tag: "ROTATION",
    title: "Fixed turn order.",
    description:
      "Members agree on a sequence upfront. Each cycle, the next person in line receives the pool. Simple, fair, predictable.",
    color: "bg-[#32D99D]",
    type: "rotation",
  },
  {
    id: "A",
    tag: "AUCTION",
    title: "Bid for early access.",
    description:
      "Members who need money sooner bid a discount. Lowest bid wins the pool; the discount is shared across everyone else.",
    color: "bg-[#A78BFA]",
    type: "auction",
  },
  {
    id: "P",
    tag: "PREDEFINED",
    title: "Payouts set upfront.",
    description:
      "Schedule every turn at the start — aligned to weddings, tuition deadlines, or planned expenses. Zero ambiguity.",
    color: "bg-[#FFC72C]",
    type: "predefined",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: "easeOut",
    },
  }),
};
// bg-[#3e3bd86e]
export default function PayoutModels() {
  return (
    <section className="overflow-hidden py-10 ">
      <div className="mx-auto max-w-[1240px] px-16 xl:px-10 ">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FFC72C]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFC72C]">
                PAYOUT MODELS
              </span>
            </div>

            <h2 className="max-w-[560px] text-[34px] font-semibold leading-[58px] tracking-[-0.04em] text-white lg:text-[48px]">
              Choose how your
              <br />
              group decides each turn.
            </h2>
          </div>

          <div className="flex justify-start lg:justify-end">
            <p className="max-w-[420px] pt-20 text-[17px] leading-[34px] text-white/70">
              Three payout models, one platform. Pick what fits your group's
              culture — from simple rotation to competitive bidding.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-7 xl:grid-cols-3">
          {payoutModels.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
    relative
    flex
    h-[450px]
    flex-col
    rounded-[28px]
    border
    border-white/[0.06]
    bg-[#141B4D]
    px-6
    py-6
    shadow-[0_18px_50px_rgba(0,0,0,0.18)]
    transition-all
    duration-500
    hover:-translate-y-2
  ">
              {/* Top */}
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} text-[13px] font-bold text-black`}>
                  {item.id}
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D3DAFF]">
                  {item.tag}
                </div>
              </div>

              {/* Title */}
              <h3 className="max-w-[240px] text-[24px] font-semibold leading-[30px] tracking-[-0.03em] text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-[15px] leading-[28px] text-white/70">
                {item.description}
              </p>

              {/* Bottom */}
              <div className="mt-auto pt-8">
                {/* ROTATION */}
                {item.type === "rotation" && (
                  <div className="border-t border-white/10 pt-6">
                    <div className="mb-6 flex flex-wrap gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <div
                          key={num}
                          className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-medium
              ${
                num === 4
                  ? "bg-[#FFC72C] border-[#FFC72C] text-black"
                  : num < 4
                    ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-300"
                    : "bg-white/5 border-white/10 text-white/40"
              }`}>
                          {num}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9D1FF]/70">
                      CYCLE 4 OF 8 · YOU'RE UP NEXT
                    </p>
                  </div>
                )}

                {/* AUCTION */}
                {item.type === "auction" && (
                  <div className="border-t border-white/10 pt-6 space-y-5">
                    {[
                      {
                        name: "Priya",
                        amount: "₹2.25L",
                        width: "70%",
                        active: false,
                      },
                      {
                        name: "Rahul",
                        amount: "₹1.65L",
                        width: "55%",
                        active: true,
                      },
                      {
                        name: "Meera",
                        amount: "₹2.46L",
                        width: "78%",
                        active: false,
                      },
                    ].map((bid) => (
                      <div
                        key={bid.name}
                        className="grid grid-cols-[50px_1fr_60px] items-center gap-3">
                        <span className="text-[12px] text-white">
                          {bid.name}
                        </span>

                        <div className="h-[5px] overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${
                              bid.active ? "bg-[#FFC72C]" : "bg-violet-400"
                            }`}
                            style={{ width: bid.width }}
                          />
                        </div>

                        <span
                          className={`text-[12px] text-right ${
                            bid.active ? "text-[#FFC72C]" : "text-white"
                          }`}>
                          {bid.amount}
                        </span>
                      </div>
                    ))}

                    <p className="pt-2 text-[10px] uppercase tracking-[0.28em] text-[#C9D1FF]/70">
                      LOWEST BIDDER WINS • ₹75K SHARED
                    </p>
                  </div>
                )}

                {/* PREDEFINED */}
                {item.type === "predefined" && (
                  <div className="border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      {[
                        { month: "NOV 26", name: "Priya K." },
                        { month: "JAN 27", name: "You", active: true },
                        { month: "FEB 27", name: "Meera S." },
                      ].map((row) => (
                        <div
                          key={row.month}
                          className="grid grid-cols-[70px_1fr_auto] items-center border-b border-dashed border-white/5 pb-3 last:border-none">
                          <span className="text-[10px] uppercase tracking-[0.22em] text-[#AAB7FF]">
                            {row.month}
                          </span>

                          <span
                            className={`text-[12px] text-right ${
                              row.active
                                ? "text-[#FFC72C] font-medium"
                                : "text-white"
                            }`}>
                            {row.name}
                          </span>

                          {row.active && (
                            <span className="ml-3 rounded-md bg-[#FFC72C] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-black">
                              YOU
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="pt-1 text-[10px] uppercase tracking-[0.28em] text-[#C9D1FF]/70">
                      LOCKED AT CYCLE START • NO CHANGES
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
