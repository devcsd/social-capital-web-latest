import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const RadialProgress = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: 30 }}
    whileInView={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
    viewport={{ once: true }}
    className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl w-48">
    <div className="flex justify-center mb-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
          <path
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-700"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="78, 100"
            strokeLinecap="round"
            className="text-secondary"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">78%</span>
        </div>
      </div>
    </div>
    <div className="text-center">
      <p className="text-white font-semibold text-lg mb-2">2118 – 3000%</p>
      <p className="text-gray-400 text-sm">46% Growth • 42 Days</p>
    </div>
  </motion.div>
);

// Bar Chart Card Component
const BarChart = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: -30 }}
    whileInView={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    viewport={{ once: true }}
    className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl w-64">
    <h4 className="text-white font-semibold text-sm mb-2">
      Capital Engagement
    </h4>
    <div className="flex items-center justify-between mb-2">
      <span className="text-white font-bold text-xl">$76,682.5</span>
      <span className="text-secondary text-sm">+2.45%</span>
    </div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-secondary"></div>
      <span className="text-secondary text-sm">On track</span>
    </div>
    <div className="flex items-end justify-between gap-1 h-16">
      {[40, 60, 35, 80, 45, 70, 55, 90, 65, 75, 50, 85].map((h, i) => (
        <div
          key={i}
          className={`w-3 rounded-t ${
            i % 3 === 0 ? "bg-secondary" : "bg-white/60"
          }`}
          style={{ height: `${h}%` }}></div>
      ))}
    </div>
  </motion.div>
);
export const CandlestickChart = () => {
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-lg font-inter">
            Community Score
          </span>
          <FaChevronDown className="text-gray-400 text-sm" />
        </div>
      </div>

      {/* Candlestick Chart Placeholder */}
      <div className="h-64 flex items-end justify-between gap-2 px-4">
        {/* Generate candlestick bars */}
        {[
          { high: 80, low: 60, open: 70, close: 75, bullish: true },
          { high: 85, low: 70, open: 75, close: 72, bullish: false },
          { high: 78, low: 65, open: 72, close: 76, bullish: true },
          { high: 82, low: 70, open: 76, close: 79, bullish: true },
          { high: 85, low: 75, open: 79, close: 77, bullish: false },
          { high: 83, low: 72, open: 77, close: 81, bullish: true },
          { high: 88, low: 78, open: 81, close: 85, bullish: true },
          { high: 90, low: 80, open: 85, close: 83, bullish: false },
          { high: 87, low: 78, open: 83, close: 86, bullish: true },
          { high: 92, low: 82, open: 86, close: 89, bullish: true },
          { high: 95, low: 85, open: 89, close: 87, bullish: false },
          { high: 93, low: 83, open: 87, close: 91, bullish: true },
        ].map((candle, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative"
            style={{ height: "100%" }}>
            {/* High-Low line */}
            <div
              className="w-0.5 bg-gray-500"
              style={{
                height: `${candle.high - candle.low}%`,
                marginTop: `${100 - candle.high}%`,
              }}></div>
            {/* Candle body */}
            <div
              className={`w-3 absolute ${
                candle.bullish ? "bg-secondary" : "bg-red-500"
              }`}
              style={{
                height: `${Math.abs(candle.close - candle.open)}%`,
                top: `${100 - Math.max(candle.open, candle.close)}%`,
              }}></div>
          </div>
        ))}
      </div>

      {/* Floating Cards */}
      <RadialProgress />
      <BarChart />
    </motion.div>
  );
};
