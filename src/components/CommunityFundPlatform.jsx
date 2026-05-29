"use client";

import { motion } from "framer-motion";

const payoutModels = [
  {
    id: "R",
    tag: "ROTATION",
    title: "Fixed turn order.",
    description:
      "Members agree on a sequence upfront. Each cycle, the next person in line receives the pool. Simple, fair, predictable.",
    color: "bg-emerald-400",
    type: "rotation",
  },
  {
    id: "A",
    tag: "AUCTION",
    title: "Bid for early access.",
    description:
      "Members who need money sooner bid a discount. Lowest bid wins the pool; the discount is shared across everyone else.",
    color: "bg-violet-400",
    type: "auction",
  },
  {
    id: "P",
    tag: "PREDEFINED",
    title: "Payouts set upfront.",
    description:
      "Schedule every turn at the start — aligned to weddings, tuition deadlines, or planned expenses. Zero ambiguity.",
    color: "bg-yellow-400",
    type: "predefined",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export default function PayoutModels() {
  return (
    <section className="w-full overflow-hidden py-14 md:py-20 px-4 sm:px-6 md:px-10 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start mb-12 lg:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-8 bg-white/5">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />

              <span className="text-[10px] sm:text-[12px] tracking-[0.25em] sm:tracking-[0.35em] text-yellow-200 font-medium">
                PAYOUT MODELS
              </span>
            </div>

            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl xl:text-[72px] leading-tight xl:leading-[0.95] font-semibold tracking-tight max-w-[720px]">
              Choose how your circle decides each turn.
            </h2>
          </div>

          <div className="flex justify-start lg:justify-end">
            <p className="text-white/75 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-[500px] pt-2 lg:pt-6">
              Three payout models, one platform. Pick what fits your group's
              culture — from simple rotation to competitive bidding.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {payoutModels.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/10 bg-primary-hover p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col">
              {/* Top */}
              <div className="flex items-start justify-between gap-4 mb-8 lg:mb-14">
                <div
                  className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-black font-bold text-xl sm:text-2xl`}>
                  {item.id}
                </div>

                <div className="px-3 sm:px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] text-[#D3DAFF]">
                  {item.tag}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-white text-2xl sm:text-3xl leading-tight font-semibold mb-4 sm:mb-6">
                  {item.title}
                </h3>

                <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Visual */}
              <div className="mt-auto pt-10 lg:pt-16">
                {item.type === "rotation" && (
                  <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <div
                          key={num}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium border ${
                            num === 4
                              ? "bg-yellow-400 border-yellow-400 text-black"
                              : num < 4
                                ? "bg-emerald-400/10 border-emerald-400/10 text-emerald-300"
                                : "bg-white/5 border-white/10 text-white/50"
                          }`}>
                          {num}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.28em] text-[#C9D1FF]/80">
                      CYCLE 4 OF 8 · YOU'RE UP NEXT
                    </p>
                  </div>
                )}

                {item.type === "auction" && (
                  <div className="border-t border-white/10 pt-8 space-y-6">
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
                    ].map((bid, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[55px_1fr_70px] sm:grid-cols-[70px_1fr_90px] items-center gap-2 sm:gap-5">
                        <span className="text-white text-xs sm:text-sm">
                          {bid.name}
                        </span>

                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bid.active
                                ? "bg-yellow-400"
                                : "bg-violet-400"
                            }`}
                            style={{ width: bid.width }}
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`text-xs sm:text-sm ${
                              bid.active
                                ? "text-yellow-400"
                                : "text-white"
                            }`}>
                            {bid.amount}
                          </span>

                          {bid.active && (
                            <div className="w-2 h-2 bg-yellow-400 rotate-45" />
                          )}
                        </div>
                      </div>
                    ))}

                    <p className="text-[11px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.28em] text-[#C9D1FF]/80 pt-2">
                      LOWEST BIDDER WINS • ₹75K SHARED
                    </p>
                  </div>
                )}

                {item.type === "predefined" && (
                  <div className="border-t border-white/10 pt-7">
                    <div className="space-y-5">
                      {[
                        {
                          month: "NOV 26",
                          name: "Priya K.",
                        },
                        {
                          month: "JAN 27",
                          name: "You",
                          active: true,
                        },
                        {
                          month: "FEB 27",
                          name: "Meera S.",
                        },
                      ].map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[70px_1fr_auto] sm:grid-cols-[90px_1fr_auto] items-center gap-2 border-b border-dashed border-white/5 pb-4 last:border-none">
                          <span className="text-[#AAB7FF] tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs">
                            {row.month}
                          </span>

                          <span
                            className={`text-right text-xs sm:text-sm ${
                              row.active
                                ? "text-yellow-400 font-medium"
                                : "text-white"
                            }`}>
                            {row.name}
                          </span>

                          {row.active && (
                            <div className="ml-2 sm:ml-5 px-2 sm:px-3 py-1 rounded-md bg-yellow-400 text-black text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] font-semibold">
                              YOU
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.28em] text-[#C9D1FF]/80 pt-8 sm:pt-10">
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