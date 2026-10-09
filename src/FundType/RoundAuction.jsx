import {
  FaArrowLeft,
  FaDownload,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { getTransactionByRoundID } from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuCircleCheck,
  LuCrown,
  LuWallet,
  LuDatabase,
  LuStar,
  LuMapPin,
  LuTrophy,
  LuShuffle,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const currencyOptions = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "AUD", symbol: "A$" },
  { code: "CNY", symbol: "¥" },
  { code: "GBP", symbol: "£" },
];
const getCurrencySymbol = (currencyCode) => {
  const currency = currencyOptions.find((item) => item.code === currencyCode);

  return currency?.symbol || currencyCode;
};

// INR-aware grouping (1,00,000 style) with sane fallback for other currencies
const formatAmount = (value, currencyCode) => {
  if (value === null || value === undefined) return "-";
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";
  return Number(value).toLocaleString(locale);
};

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return {
    time: d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: d.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
};

// mm:ss / h m formatting for a duration given in minutes (fallback: treat as minutes)
const formatDuration = (start, end) => {
  if (!start || !end) return "-";
  const ms = new Date(end) - new Date(start);
  if (isNaN(ms) || ms < 0) return "-";
  const totalSeconds = Math.round(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

// ---------- PDF Receipt ----------
// Builds a standalone settlement receipt (not a screenshot of the page).
const generateReceiptPDF = (roundData, currencySymbol) => {
  const {
    roundNumber,
    roundStatus,
    roundStartDate,
    winnerName,
    settlementAmount,
    totalFundValue,
    dividendAmount,
    minimumBidAmount,
    maximumBidAmount,
    biddingHistory = [],
    transactionDetails = [],
    totalMember,
    completeContribution,
    pendingContribution,
    timeLine,
    currency,
  } = roundData;

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let cursorY = 50;

  const money = (value) =>
    `${currencySymbol}${formatAmount(value || 0, currency)}`;

  // ===========================
  // Header
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Round Payout Receipt", margin, cursorY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `Generated on ${new Date().toLocaleString("en-IN")}`,
    pageWidth - margin,
    cursorY,
    { align: "right" },
  );

  cursorY += 15;

  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  cursorY += 25;

  // ===========================
  // Round Details
  // ===========================

  const roundStart = formatDateTime(roundStartDate);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Round ${roundNumber}`, margin, cursorY);

  cursorY += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Status : ${roundStatus}`, margin, cursorY);

  doc.text(
    `Started : ${roundStart.date} ${roundStart.time}`,
    pageWidth - margin,
    cursorY,
    { align: "right" },
  );

  cursorY += 30;

  // ===========================
  // Winner
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Winner", margin, cursorY);

  cursorY += 18;

  doc.setFont("helvetica", "normal");

  doc.text(winnerName || "-", margin, cursorY);

  doc.text(money(settlementAmount), pageWidth - margin, cursorY, {
    align: "right",
  });

  cursorY += 30;

  // ===========================
  // Financial Summary
  // ===========================

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },

    head: [["Financial Summary", ""]],

    body: [
      ["Total Group  Value", money(totalFundValue)],
      ["Payout Amount", money(settlementAmount)],
      ["Bonus Amount", money(dividendAmount)],
      ["Minimum Bid", money(minimumBidAmount)],
      ["Maximum Bid", money(maximumBidAmount)],
      ["Members", totalMember],
      ["Total Bids", biddingHistory.length],
    ],

    theme: "striped",

    headStyles: {
      fillColor: [17, 24, 39],
      textColor: 255,
    },

    columnStyles: {
      1: {
        halign: "right",
      },
    },
  });

  cursorY = doc.lastAutoTable.finalY + 30;

  // ===========================
  // Bidding History
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Bidding History", margin, cursorY);

  cursorY += 10;

  autoTable(doc, {
    startY: cursorY,

    margin: {
      left: margin,
      right: margin,
    },

    head: [["User", "Bid Amount", "Bid Time", "Status"]],

    body: biddingHistory.map((bid) => {
      const dt = formatDateTime(bid.bidAskAt);

      return [
        bid.userName,
        money(bid.bidAmount),
        `${dt.date} ${dt.time}`,
        bid.status === "winner" ? "Winner" : "-",
      ];
    }),

    theme: "striped",

    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontSize: 9,
    },

    bodyStyles: {
      fontSize: 9,
    },

    columnStyles: {
      1: {
        halign: "right",
      },
    },

    didParseCell: (data) => {
      if (
        data.section === "body" &&
        data.column.index === 3 &&
        data.cell.raw === "Winner"
      ) {
        data.cell.styles.textColor = [22, 163, 74];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  cursorY = doc.lastAutoTable.finalY + 30;

  // ===========================
  // Timeline
  // ===========================

  if (timeLine) {
    const start = formatDateTime(timeLine.transactionStartDate);
    const end = formatDateTime(timeLine.transactionEndDate);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payout Timeline", margin, cursorY);

    cursorY += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Started : ${start.date} ${start.time}`, margin, cursorY);

    cursorY += 15;

    doc.text(`Completed : ${end.date} ${end.time}`, margin, cursorY);

    cursorY += 15;

    doc.text(
      `Duration : ${formatDuration(
        timeLine.transactionStartDate,
        timeLine.transactionEndDate,
      )}`,
      margin,
      cursorY,
    );
  }

  // ===========================
  // Footer
  // ===========================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "This is a system generated receipt.",
    pageWidth / 2,
    pageHeight - 30,
    {
      align: "center",
    },
  );

  doc.save(`round-${roundNumber}-receipt.pdf`);
};

const Avatar = ({ name, imageUrl, size = 10 }) => {
  // size is in tailwind's 0.25rem units (matches w-10/h-10 style sizing)
  const dimension = `${size / 4}rem`;
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="rounded-full object-cover border border-gray-200 flex-shrink-0"
        style={{ width: dimension, height: dimension }}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0"
      style={{ width: dimension, height: dimension }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

export default function RoundAuction() {
  const [transactionData, setTransactionData] = useState(null);

  const { roundID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await getTransactionByRoundID(roundID);

        setTransactionData(response.data.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, [roundID]);

  const currencySymbol = getCurrencySymbol(transactionData?.currency);

  if (!transactionData) {
    return (
      <div className="min-h-screen animate-pulse">
        {/* Header */}
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded mb-3" />

          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>

        {/* Winner Summary */}
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />

                <div className="h-6 w-32 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl border p-6 lg:col-span-2">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-3" />

                  <div className="h-6 w-16 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            {/* Fake Chart */}
            <div className="h-[320px] rounded-2xl bg-gray-100 relative overflow-hidden">
              <div className="absolute bottom-10 left-0 right-0 flex items-end justify-around px-6">
                {[60, 120, 90, 180, 130, 200, 160].map((height, index) => (
                  <div
                    key={index}
                    className="w-8 bg-gray-300 rounded-t-xl"
                    style={{
                      height: `${height}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contribution */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="rounded-xl p-5 bg-gray-100">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3" />

                  <div className="h-8 w-16 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-6 py-5 border-b">
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />

            <div className="h-4 w-72 bg-gray-100 rounded" />
          </div>

          <div className="p-6 space-y-5">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />

                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />

                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>

                <div className="h-5 w-24 bg-gray-200 rounded" />

                <div className="h-5 w-32 bg-gray-100 rounded" />

                <div className="h-8 w-24 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const {
    roundNumber,
    roundStatus,
    roundStartDate,
    frequency,
    winnerName,
    winnerProfileImage,
    settlementAmount,
    totalFundValue,
    dividendAmount,
    maximumBidAmount,
    minimumBidAmount,
    biddingHistory,
    totalMember,
    completeContribution,
    pendingContribution,
    timeLine,
  } = transactionData;

  // Winner badge belongs only on the single lowest bid, not every row
  // for the winning member (status field from the API can't be trusted
  // to mark exactly one row).
  const winningBidIndex = biddingHistory?.reduce(
    (lowestIdx, item, idx, arr) => {
      if (lowestIdx === -1) return idx;
      return item.bidAmount < arr[lowestIdx].bidAmount ? idx : lowestIdx;
    },
    -1,
  );

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const chartData = biddingHistory.map((item) => ({
    time: formatTime(item.bidAskAt),
    bid: item.bidAmount,
    userName: item.userName,
    userProfileImage: item.userProfileImage,
  }));

  const isCompleted = roundStatus === "completed";
  const isLastRound = totalMember && roundNumber === totalMember;
  const hasBidding = biddingHistory && biddingHistory.length > 0;

  const bidAmounts = (biddingHistory || []).map((b) => Number(b.bidAmount) || 0);
  const highestIdx = bidAmounts.length
    ? bidAmounts.indexOf(Math.max(...bidAmounts))
    : -1;
  const lowestIdx = bidAmounts.length
    ? bidAmounts.lastIndexOf(Math.min(...bidAmounts))
    : -1;
  const averageBid = bidAmounts.length
    ? Math.round(bidAmounts.reduce((sum, n) => sum + n, 0) / bidAmounts.length)
    : 0;
  const money = (v) =>
    `${currencySymbol} ${formatAmount(v, transactionData.currency)}`;

const CustomDot = (props) => {
  const { cx, cy, payload, index } = props;

  if (!cx || !cy) return null;

  const size = 26; // profile image diameter
  const radius = size / 2;
  const isHigh = index === highestIdx;
  const isLow = index === lowestIdx && lowestIdx !== highestIdx;
  const ring = isHigh ? "#22c55e" : isLow ? "#8b5cf6" : "#fff";
  const pillText = isHigh
    ? `High ${money(payload.bid)}`
    : isLow
      ? `Low ${money(payload.bid)}`
      : null;
  const pillW = pillText ? pillText.length * 6.4 + 18 : 0;

  return (
    <g>
      {payload.userProfileImage ? (
        <>
          <clipPath id={`clip-${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={radius} />
          </clipPath>

          <image
            href={payload.userProfileImage}
            x={cx - radius}
            y={cy - radius}
            width={size}
            height={size}
            clipPath={`url(#clip-${cx}-${cy})`}
            preserveAspectRatio="xMidYMid slice"
          />

          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={ring}
            strokeWidth={isHigh || isLow ? 3 : 2}
          />
        </>
      ) : (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="#4f46e5"
            stroke={ring}
            strokeWidth={isHigh || isLow ? 3 : 2}
          />

          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize="10"
            fill="#fff"
            fontWeight="bold"
          >
            {payload.userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </text>
        </>
      )}

      {pillText && (
        <g>
          <rect
            x={cx - pillW / 2}
            y={cy - radius - 30}
            width={pillW}
            height={22}
            rx={11}
            fill={isHigh ? "#16a34a" : "#2563eb"}
          />
          <path
            d={`M${cx - 5} ${cy - radius - 9} L${cx + 5} ${cy - radius - 9} L${cx} ${cy - radius - 3} Z`}
            fill={isHigh ? "#16a34a" : "#2563eb"}
          />
          <text
            x={cx}
            y={cy - radius - 15}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#fff"
          >
            {pillText}
          </text>
        </g>
      )}
    </g>
  );
};
  const roundStart = formatDateTime(roundStartDate);
  const txStart = formatDateTime(timeLine?.transactionStartDate);
  const txEnd = formatDateTime(timeLine?.transactionEndDate);
  const txDuration = formatDuration(
    timeLine?.transactionStartDate,
    timeLine?.transactionEndDate,
  );

  return (
    <div className="min-h-screen space-y-5">
      {/* Back */}
      <button
        className="flex items-center gap-2 text-[14px] font-medium text-blue-700 hover:text-blue-800 transition-colors"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft size={12} />
        Back to Group Details
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[30px] leading-tight font-extrabold text-slate-900 tracking-tight">
            Round {roundNumber} Overview
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-semibold capitalize ring-1 ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-amber-50 text-amber-700 ring-amber-200"
              }`}
            >
              {isCompleted ? (
                <LuCircleCheck size={13} className="text-emerald-600" />
              ) : (
                <FaClock size={11} />
              )}
              {roundStatus}
            </span>
            {frequency && (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                {frequency}
              </span>
            )}
          </div>
        </div>

        {roundStartDate && (
          <div className="flex items-center gap-2.5 text-[13px] text-slate-600">
            <FaCalendarAlt className="text-blue-600 text-[16px]" />
            Auction Date : {roundStart.date}, {roundStart.time}
          </div>
        )}
      </div>

      {/* Winner Summary */}
      {isCompleted ? (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-amber-100 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-amber-50/80 shadow-sm px-5 py-4">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-amber-700 mb-2">
            <LuCrown className="text-amber-500" size={18} />
            Winner
          </p>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-5 xl:pr-32">
            <div className="flex items-center gap-4 xl:pr-6 xl:border-r xl:border-amber-200/60">
              <div className="rounded-full p-1 bg-gradient-to-br from-amber-300 via-rose-300 to-violet-300">
                <div className="rounded-full p-0.5 bg-white">
                  <Avatar
                    name={winnerName}
                    imageUrl={winnerProfileImage}
                    size={14}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[22px] font-bold text-slate-900 leading-tight">
                    {winnerName}
                  </p>
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-700">
                    Winner
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4 md:divide-x md:divide-amber-200/60">
              <SummaryItem
                icon={LuWallet}
                tint="bg-amber-100 text-amber-600"
                label="Payout"
                value={money(settlementAmount)}
              />
              <SummaryItem
                icon={LuDatabase}
                tint="bg-violet-100 text-violet-600"
                label="Total Fund"
                value={money(totalFundValue)}
              />
              <SummaryItem
                icon={LuStar}
                tint="bg-blue-100 text-blue-600"
                label="Bonus"
                value={money(dividendAmount)}
              />
              <SummaryItem
                icon={LuMapPin}
                tint="bg-violet-100 text-violet-600"
                label="Minimum Bid"
                value={money(minimumBidAmount)}
              />
            </div>
          </div>

          <LuTrophy
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block text-amber-200 text-[96px]"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className={`${cardCls} flex items-center gap-4 p-5`}>
          <span className="h-11 w-11 shrink-0 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <FaClock size={18} />
          </span>
          <div>
            <span className="inline-block px-3 py-0.5 text-[12px] rounded-full bg-amber-100 text-amber-700 font-semibold capitalize">
              {roundStatus}
            </span>
            <p className="text-[13px] text-slate-600 mt-1">
              This round hasn't completed yet — winner, payout and bonus will
              appear once it's settled.
            </p>
          </div>
        </div>
      )}

      {roundStatus !== "completed" ? (
        <div className={`${cardCls} flex flex-col items-center justify-center text-center py-16`}>
          <span className="h-14 w-14 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
            <FaClock size={24} />
          </span>
          <h3 className="font-bold text-slate-800">Round Still In Progress</h3>
          <p className="text-sm text-slate-500 mt-1">
            Bidding summary and trend chart will appear once this round is
            completed.
          </p>
        </div>
      ) : isLastRound ? (
        <div className={`${cardCls} flex flex-col items-center justify-center text-center py-16`}>
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <LuTrophy size={26} />
          </div>
          <h3 className="font-bold text-slate-800">
            Last Round — Direct Selection
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            This is the final round of the group. No bidding took place — the
            winner was allotted directly as the last remaining member.
          </p>
        </div>
      ) : (
        <>
          {/* Bidding Summary */}
          <div className={`${cardCls} p-5`}>
            <h3 className="text-[17px] font-bold text-slate-900 mb-4">
              Bidding Summary
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat
                icon={LuShuffle}
                tint="bg-blue-100 text-blue-700"
                bg="bg-slate-50"
                label="Total Bids"
                value={biddingHistory?.length}
              />
              <Stat
                icon={LuTrendingUp}
                tint="bg-emerald-100 text-emerald-600"
                bg="bg-emerald-50/50"
                label="Highest Bid"
                value={money(maximumBidAmount)}
                color="text-emerald-600"
              />
              <Stat
                icon={LuTrendingDown}
                tint="bg-blue-100 text-blue-700"
                bg="bg-blue-50/50"
                label="Lowest Bid"
                value={money(minimumBidAmount)}
                color="text-blue-700"
              />
              <Stat
                icon={LuCircleCheck}
                tint="bg-violet-100 text-violet-600"
                bg="bg-violet-50/50"
                label="Average Bid"
                value={money(averageBid)}
                color="text-violet-700"
              />
            </div>
          </div>

          {/* Bidding Trend - Line Chart */}
          <div className={`${cardCls} p-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-[17px] font-bold text-slate-900">
                Bidding Trend
              </h3>

              <div className="flex items-center gap-4 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  Bid Amount
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Highest Bid
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  Lowest Bid
                </span>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 36, right: 24, left: 4, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="bidFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    domain={["dataMin - 500", "dataMax + 500"]}
                    tickFormatter={(v) =>
                      `${currencySymbol} ${formatAmount(v, transactionData.currency)}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                    formatter={(value) => [
                      `${currencySymbol}${formatAmount(value, transactionData.currency)}`,
                      "Bid",
                    ]}
                    labelFormatter={(label, payload) => {
                      if (!payload?.length) return "";
                      const user = payload[0].payload.userName;
                      return (
                        <>
                          <div>
                            <strong>{user}</strong>
                          </div>
                          <div>Time: {label}</div>
                        </>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bid"
                    stroke="none"
                    fill="url(#bidFill)"
                    tooltipType="none"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bid"
                    stroke="#2563eb"
                    strokeWidth={2}
                    strokeDasharray="0"
                    dot={<CustomDot />}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {isCompleted && (
        <div className={`${cardCls} p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-slate-900">
                Bid History{" "}
                <span className="text-[14px] font-semibold text-slate-700">
                  ({biddingHistory?.length || 0} bids)
                </span>
              </h3>
              <p className="text-[13px] text-slate-500 mt-0.5">
                All bids placed in this auction round.
              </p>
            </div>
            {!isLastRound && (
              <Button
                label="Download Receipt"
                onClick={() => generateReceiptPDF(transactionData, currencySymbol)}
              />
            )}
          </div>

          {hasBidding ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide rounded-l-xl">
                      #
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Member
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Bid Amount
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Bid Time
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide rounded-r-xl">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {biddingHistory?.map((item, index) => {
                    const bidTime = formatDateTime(item.bidAskAt);
                    const isWinningBid = index === winningBidIndex;
                    return (
                      <tr
                        key={item.userId + item.bidAskAt}
                        className={`transition-colors duration-200 ${
                          isWinningBid
                            ? "bg-amber-50/70"
                            : "bg-white hover:bg-slate-50/70"
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-4 py-2.5">
                          <div
                            className={`flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-semibold ring-1 ${
                              rankStyles[index] ??
                              "bg-white text-slate-700 ring-slate-200"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={item.userName}
                              imageUrl={item.userProfileImage}
                              size={9}
                            />

                            <div>
                              <p className="text-[13px] font-semibold text-slate-800">
                                {item.userName}
                              </p>

                              <p className="text-[11px] text-slate-400">
                                ID: {item.userId?.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-2.5">
                          <p className="font-bold text-slate-900 text-[15px] tabular-nums">
                            {currencySymbol}{" "}
                            {formatAmount(
                              item.bidAmount,
                              transactionData.currency,
                            )}
                          </p>
                        </td>

                        {/* Time */}
                        <td className="px-4 py-2.5">
                          <p className="text-[12px] text-slate-600 leading-snug">
                            {bidTime.date},
                            <br />
                            {bidTime.time}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-2.5">
                          {isWinningBid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-100 text-amber-800">
                              <LuCrown className="text-amber-500" size={13} />
                              Won
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                              Participated
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-slate-500 text-sm">
              {isLastRound
                ? "This was the final round — winner was selected directly, no bids were placed."
                : "No bids recorded for this round."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

const cardCls =
  "bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]";

const rankStyles = [
  "bg-amber-100 text-amber-700 ring-amber-300",
  "bg-white text-slate-700 ring-slate-300",
  "bg-orange-50 text-orange-700 ring-orange-200",
];

const SummaryItem = ({ icon: Icon, tint, label, value }) => (
  <div className="flex items-start gap-3 md:pl-4 first:pl-0">
    <span
      className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${tint}`}
    >
      <Icon size={17} />
    </span>
    <div className="min-w-0">
      <p className="text-[12px] text-slate-500">{label}</p>

      <p className="text-[18px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
        {value}
      </p>
    </div>
  </div>
);

const Stat = ({ icon: Icon, tint, bg, label, value, color = "text-slate-900" }) => (
  <div className={`${bg} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
    <span
      className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${tint}`}
    >
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-[12px] text-slate-600">{label}</p>

      <p className={`text-[18px] font-bold tabular-nums truncate ${color}`}>
        {value}
      </p>
    </div>
  </div>
);

const Button = ({ label, onClick }) => (
  <button
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 h-10 rounded-xl text-[14px] font-semibold shadow-sm shadow-blue-200 transition-colors"
    onClick={onClick}
  >
    <FaDownload />
    {label}
  </button>
);
