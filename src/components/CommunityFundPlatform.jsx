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
    <section className="w-full  overflow-hidden py-20 px-5 md:px-10 xl:px-16">
      <div className="max-w-[1500px] mx-auto">
        {/* Top Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-14">
          <div>
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 mb-8 bg-white/5">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />

              <span className="text-[12px] tracking-[0.35em] text-yellow-200 font-medium">
                PAYOUT MODELS
              </span>
            </div>

            <h2 className="text-white text-5xl md:text-6xl xl:text-[72px] leading-[0.95] font-semibold tracking-[-0.05em] max-w-[720px]">
              Choose how your circle decides each turn.
            </h2>
          </div>

          <div className="flex lg:justify-end">
            <p className="text-white/75 text-2xl leading-relaxed max-w-[500px] pt-6">
              Three payout models, one platform. Pick what fits your group's
              culture — from simple rotation to competitive bidding.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {payoutModels.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-[34px] border border-white/10 bg-primary-hover p-10 min-h-[610px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col">
              {/* Top */}
              <div className="flex items-start justify-between mb-14">
                <div
                  className={`w-[46px] h-[46px] rounded-2xl ${item.color} flex items-center justify-center text-black font-bold text-2xl`}>
                  {item.id}
                </div>

                <div className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] text-[12px] tracking-[0.30em] text-[#D3DAFF]">
                  {item.tag}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-white text-3xl leading-[0.95] tracking-[-0.06em] font-semibold mb-6">
                  {item.title}
                </h3>

                <p className="text-white/75 text-md leading-[1.6]">
                  {item.description}
                </p>
              </div>

              {/* Bottom Visual */}
              <div className="mt-auto pt-16">
                {item.type === "rotation" && (
                  <>
                    <div className="border-t border-white/10 pt-8">
                      <div className="flex items-center gap-3 mb-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <div
                            key={num}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border ${
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

                      <p className="text-[13px] tracking-[0.28em] text-[#C9D1FF]/80">
                        CYCLE 4 OF 8 · YOU'RE UP NEXT
                      </p>
                    </div>
                  </>
                )}

                {item.type === "auction" && (
                  <>
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
                          className="grid grid-cols-[70px_1fr_90px] items-center gap-5">
                          <span className="text-white text-sm">{bid.name}</span>

                          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                bid.active ? "bg-yellow-400" : "bg-violet-400"
                              }`}
                              style={{ width: bid.width }}
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <span
                              className={`text-sm ${
                                bid.active ? "text-yellow-400" : "text-white"
                              }`}>
                              {bid.amount}
                            </span>

                            {bid.active && (
                              <div className="w-2 h-2 bg-yellow-400 rotate-45" />
                            )}
                          </div>
                        </div>
                      ))}

                      <p className="text-[13px] tracking-[0.28em] text-[#C9D1FF]/80 pt-2">
                        LOWEST BIDDER WINS • ₹75K SHARED
                      </p>
                    </div>
                  </>
                )}

                {item.type === "predefined" && (
                  <>
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
                            className="grid grid-cols-[90px_1fr_auto] items-center border-b border-dashed border-white/5 pb-4 last:border-none">
                            <span className="text-[#AAB7FF] tracking-[0.25em] text-xs">
                              {row.month}
                            </span>

                            <span
                              className={`text-right text-sm ${
                                row.active
                                  ? "text-yellow-400 font-medium"
                                  : "text-white"
                              }`}>
                              {row.name}
                            </span>

                            {row.active && (
                              <div className="ml-5 px-3 py-1 rounded-md bg-yellow-400 text-black text-xs tracking-[0.25em] font-semibold">
                                YOU
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <p className="text-[13px] tracking-[0.28em] text-[#C9D1FF]/80 pt-10">
                        LOCKED AT CYCLE START • NO CHANGES
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
