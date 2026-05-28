import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { getTransactionByRoundID } from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function RoundAuction() {
  const [transactionData, setTransactionData] = useState(null);

  const { roundID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await getTransactionByRoundID(roundID);

        // IMPORTANT
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
    winnerName,
    settlementAmount,
    totalFundValue,
    dividendAmount,
    maximumBidAmount,
    minimumBidAmount,
    biddingHistory,
    transactionDetails,
    totalMember,
    completeContribution,
    pendingContribution,
    timeLine,
  } = transactionData;

  const chartData = biddingHistory?.map((item, index) => ({
    bid: item.bidAmount,
    user: item.userName,
    time: new Date(item.bidAskAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    index: index + 1,
  }));

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
      {/* <pre>{JSON.stringify(transactionData, null, 2)}</pre> */}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Round {roundNumber} Overview</h1>

        <p className="text-gray-500">Status : {roundStatus}</p>
      </div>

      {/* Winner Summary */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-semibold mb-4">Winner Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
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

          <SummaryItem
            label="Settlement Amount"
            value={`${currencySymbol}${settlementAmount}`}
          />

          <SummaryItem label="Total Fund" value={`${currencySymbol}${totalFundValue}`} />

          <SummaryItem label="Dividend" value={`${currencySymbol}${dividendAmount}`} />

          <SummaryItem label="Minimum Bid" value={`${currencySymbol}${minimumBidAmount}`} />
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
              value={`${currencySymbol}${minimumBidAmount}`}
              color="text-green-600"
            />

            <Stat
              label="Highest Bid"
              value={`${currencySymbol}${maximumBidAmount}`}
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
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="bid"
                    stroke="#0154D8"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#0154D8",
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Contribution */}
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
              {biddingHistory?.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 hover:bg-gray-50 ${
                    item.status === "winner" ? "bg-yellow-50" : "bg-white"
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
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {item.userName?.charAt(0)}
                      </div>

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
                      {currencySymbol}{item.bidAmount?.toLocaleString()}
                    </p>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(item.bidAskAt).toLocaleTimeString()}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(item.bidAskAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {item.status === "winner" ? (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing all bids</p>

          <div className="text-sm font-medium text-indigo-600">
            Lowest Bid : {currencySymbol}{minimumBidAmount?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="flex gap-3">
        <Button label="Download Report" />

        <Button label="Download Receipts" />
      </div> */}
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

const Button = ({ label }) => (
  <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm">
    <FaDownload />
    {label}
  </button>
);
