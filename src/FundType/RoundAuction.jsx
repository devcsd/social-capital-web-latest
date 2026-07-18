import { FaArrowLeft, FaDownload, FaClock, FaCalendarAlt } from "react-icons/fa";
import { getTransactionByRoundID } from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
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
  const currency = currencyOptions.find(
    (item) => item.code === currencyCode
  );

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
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    date: d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }),
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
  doc.text("Round Settlement Receipt", margin, cursorY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `Generated on ${new Date().toLocaleString("en-IN")}`,
    pageWidth - margin,
    cursorY,
    { align: "right" }
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

  doc.text(
    `Status : ${roundStatus}`,
    margin,
    cursorY
  );

  doc.text(
    `Started : ${roundStart.date} ${roundStart.time}`,
    pageWidth - margin,
    cursorY,
    { align: "right" }
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

  doc.text(
    money(settlementAmount),
    pageWidth - margin,
    cursorY,
    { align: "right" }
  );

  cursorY += 30;

  // ===========================
  // Financial Summary
  // ===========================

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },

    head: [["Financial Summary", ""]],

    body: [
      ["Total Fund Value", money(totalFundValue)],
      ["Settlement Amount", money(settlementAmount)],
      ["Dividend Amount", money(dividendAmount)],
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
    doc.text("Settlement Timeline", margin, cursorY);

    cursorY += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Started : ${start.date} ${start.time}`,
      margin,
      cursorY
    );

    cursorY += 15;

    doc.text(
      `Completed : ${end.date} ${end.time}`,
      margin,
      cursorY
    );

    cursorY += 15;

    doc.text(
      `Duration : ${formatDuration(
        timeLine.transactionStartDate,
        timeLine.transactionEndDate
      )}`,
      margin,
      cursorY
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
    }
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
      <div className="p-6 min-h-screen animate-pulse">
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
  const winningBidIndex = biddingHistory?.reduce((lowestIdx, item, idx, arr) => {
    if (lowestIdx === -1) return idx;
    return item.bidAmount < arr[lowestIdx].bidAmount ? idx : lowestIdx;
  }, -1);

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

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;

    if (!cx || !cy) return null;

    return (
      <g>
        {payload.userProfileImage ? (
          <image
            href={payload.userProfileImage}
            x={cx - 12}
            y={cy - 12}
            width={24}
            height={24}
            clipPath="circle(12px)"
          />
        ) : (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={12}
              fill="#0154D8"
              stroke="#fff"
              strokeWidth={2}
            />

            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize="9"
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
      </g>
    );
  };

  const roundStart = formatDateTime(roundStartDate);
  const txStart = formatDateTime(timeLine?.transactionStartDate);
  const txEnd = formatDateTime(timeLine?.transactionEndDate);
  const txDuration = formatDuration(
    timeLine?.transactionStartDate,
    timeLine?.transactionEndDate
  );

  return (
    <div className="p-6 min-h-screen ">
      {/* Back */}
      <button
        className="flex items-center text-sm text-indigo-600 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Round {roundNumber} Overview</h1>

          <p className="text-gray-500">
            Status : {roundStatus}
            {frequency && <span className="mx-2 text-gray-300">|</span>}
            {frequency && <span>{frequency}</span>}
          </p>
        </div>

        {roundStartDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt className="text-indigo-400" />
            Round started {roundStart.date} at {roundStart.time}
          </div>
        )}
      </div>

      {/* Winner Summary */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-semibold mb-4">Winner Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 flex items-center gap-4">
            <Avatar name={winnerName} imageUrl={winnerProfileImage} size={14} />

            <div>
              <p className="text-sm text-gray-500">Winner Name</p>

              <p className="font-semibold text-lg">{winnerName}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  roundStatus === "completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {roundStatus}
              </span>
            </div>
          </div>

          <SummaryItem
            label="Settlement Amount"
            value={`${currencySymbol}${formatAmount(settlementAmount, transactionData.currency)}`}
          />

          <SummaryItem
            label="Total Fund"
            value={`${currencySymbol}${formatAmount(totalFundValue, transactionData.currency)}`}
          />

          <SummaryItem
            label="Dividend"
            value={`${currencySymbol}${formatAmount(dividendAmount, transactionData.currency)}`}
          />

          <SummaryItem
            label="Minimum Bid"
            value={`${currencySymbol}${formatAmount(minimumBidAmount, transactionData.currency)}`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bid Summary */}
        <div className="bg-white rounded-xl border p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Bidding Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Total Bids" value={biddingHistory?.length} />

            <Stat label="Members" value={totalMember} />

            <Stat
              label="Lowest Bid"
              value={`${currencySymbol}${formatAmount(minimumBidAmount, transactionData.currency)}`}
              color="text-green-600"
            />

            <Stat
              label="Highest Bid"
              value={`${currencySymbol}${formatAmount(maximumBidAmount, transactionData.currency)}`}
              color="text-red-500"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Bidding Trend
                </h4>

                <p className="text-sm text-gray-500">
                  Bid amount movement over time
                </p>
              </div>

              <div className="bg-indigo-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {chartData?.length} Points
              </div>
            </div>

            <div className="h-[320px] w-full bg-gray-50 rounded-2xl p-4 border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />

                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={["dataMin - 500", "dataMax + 500"]}
                    tickFormatter={(v) => formatAmount(v, transactionData.currency)}
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
                          <div><strong>{user}</strong></div>
                          <div>Time: {label}</div>
                        </>
                      );
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="bid"
                    stroke="#0154D8"
                    strokeWidth={3}
                    dot={<CustomDot />}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Contribution + Timeline */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Contribution Status</h3>

            <div className="space-y-4">
              <div className="bg-green-500 text-white rounded-lg p-4">
                <p className="text-sm">Completed</p>

                <p className="text-2xl font-bold">{completeContribution}</p>
              </div>

              <div className="bg-yellow-400 text-white rounded-lg p-4">
                <p className="text-sm">Pending</p>

                <p className="text-2xl font-bold">{pendingContribution}</p>
              </div>
            </div>
          </div>

          {timeLine && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FaClock className="text-indigo-400" />
                Settlement Timeline
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Started</span>
                  <span className="font-medium text-gray-800">
                    {txStart.date}, {txStart.time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium text-gray-800">
                    {txEnd.date}, {txEnd.time}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-500">Total Duration</span>
                  <span className="font-semibold text-indigo-600">{txDuration}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mb-5">
        <Button
          label="Download Receipt"
          onClick={() => generateReceiptPDF(transactionData, currencySymbol)}
        />
      </div>

      {/* Bid History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Bid History</h3>

            <p className="text-sm text-gray-500">
              All bidding activities for this round
            </p>
          </div>

          <div className="bg-indigo-100 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
            {biddingHistory?.length || 0} Bids
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Member
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bid Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bid Time
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {biddingHistory?.map((item, index) => {
                const bidTime = formatDateTime(item.bidAskAt);
                const isWinningBid = index === winningBidIndex;
                return (
                  <tr
                    key={item.userId + item.bidAskAt}
                    className={`transition-all duration-200 hover:bg-gray-50 ${
                      isWinningBid ? "bg-yellow-50" : "bg-white"
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.userName} imageUrl={item.userProfileImage} size={10} />

                        <div>
                          <p className="font-medium text-gray-800">
                            {item.userName}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {item.userId?.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-base">
                        {currencySymbol}
                        {formatAmount(item.bidAmount, transactionData.currency)}
                      </p>
                    </td>

                    {/* Time */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {bidTime.time}
                        </p>

                        <p className="text-xs text-gray-400">{bidTime.date}</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {isWinningBid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          🏆 Winner
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
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

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing all bids</p>

          <div className="text-sm font-medium text-indigo-600">
            Lowest Bid : {currencySymbol}
            {formatAmount(minimumBidAmount, transactionData.currency)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>

    <p className="font-semibold">{value}</p>
  </div>
);

const Stat = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-500">{label}</p>

    <p className={`font-semibold ${color}`}>{value}</p>
  </div>
);

const Button = ({ label, onClick }) => (
  <button
    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"
    onClick={onClick}
  >
    <FaDownload />
    {label}
  </button>
);