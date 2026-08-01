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

export default function RoundRotation() {
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

  /* ---------------- Skeleton Loader ---------------- */

  if (!transactionData) {
    return (
      <div className="p-6 min-h-screen animate-pulse bg-gray-50">
        <div className="h-8 w-52 bg-gray-200 rounded mb-4" />

        <div className="h-4 w-32 bg-gray-200 rounded mb-8" />

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-gray-200 rounded mb-3" />

                <div className="h-6 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-6 lg:col-span-2">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3" />

                  <div className="h-6 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            <div className="h-[320px] bg-gray-100 rounded-2xl" />
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-5">
                  <div className="h-4 bg-gray-200 rounded mb-3" />

                  <div className="h-6 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Dynamic Data ---------------- */

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
    currency,
  } = transactionData;

  /* ---------------- Chart Data ---------------- */

  const chartData = biddingHistory?.map((item, index) => ({
    bid: item.bidAmount,
    user: item.userName,
    time: new Date(item.bidAskAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    index: index + 1,
  }));

  return (
    <div className="p-6 min-h-screen">
      {/* Back */}
      <button
        className="flex items-center text-sm text-indigo-600 mb-5"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" />
        Back to Group Details
      </button>
{/* <pre>{JSON.stringify(transactionData, null, 2)}</pre> */}
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Round {roundNumber} Overview
        </h1>

        <p className="text-gray-500 mt-1">Status : {roundStatus}</p>
      </div>

      {/* Winner Summary */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-5">Winner Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Winner Name</p>

            <p className="font-bold text-xl text-gray-800">{winnerName}</p>

            <span
              className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                roundStatus === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {roundStatus}
            </span>
          </div>

          <SummaryItem
            label="Payout"
            value={`${currencySymbol} ${settlementAmount ?? 0}`}
          />

          <SummaryItem
            label="Group Value"
            value={`${currencySymbol} ${totalFundValue ?? 0}`}
          />

          <SummaryItem
            label="Bonus"
            value={`${currencySymbol} ${dividendAmount ?? 0}`}
          />

          <SummaryItem label="Members" value={totalMember} />
        </div>
      </div>

      {/* Rotation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Rotation Info */}
        <div className="bg-white rounded-2xl border p-6 lg:col-span-2 shadow-sm">
          <h3 className="font-semibold text-lg mb-5">Rotation Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat label="Total Members" value={totalMember} />

            <Stat
              label="Completed"
              value={completeContribution}
              color="text-green-600"
            />

            <Stat
              label="Pending"
              value={pendingContribution}
              color="text-yellow-600"
            />

            <Stat
              label="Group Value"
              value={`${currencySymbol} ${totalFundValue}`}
              color="text-indigo-600"
            />
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-2xl border p-5">
            <h4 className="font-semibold text-gray-800 mb-4">
              Transaction Timeline
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />

                <div>
                  <p className="font-medium text-gray-800">
                    Transaction Started
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(timeLine?.transactionStartDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="ml-[7px] h-10 border-l-2 border-dashed border-gray-300" />

              <div className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-full bg-indigo-600 mt-1" />

                <div>
                  <p className="font-medium text-gray-800">
                    Transaction Completed
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(timeLine?.transactionEndDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Card */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-5">Contribution Status</h3>

          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-[14px] border-gray-100"></div>

              <div
                className="absolute inset-0 rounded-full border-[14px] border-green-500"
                style={{
                  clipPath:
                    pendingContribution > 0 ? "inset(0 0 50% 0)" : "none",
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-gray-800">
                  {completeContribution}
                </p>

                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm text-green-600">Completed Contributions</p>

              <p className="text-2xl font-bold text-green-700">
                {completeContribution}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <p className="text-sm text-yellow-600">Pending Contributions</p>

              <p className="text-2xl font-bold text-yellow-700">
                {pendingContribution}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-2xl border shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Transaction Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Member
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactionDetails?.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {item.userProfileImage ? (
                        <img
                          src={item.userProfileImage}
                          alt={item.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {item.userName?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-800">
                          {item.userName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {currencySymbol} {item.memberContributeAmount ?? 0}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Received"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(item.transactionDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}

/* ---------------- Components ---------------- */

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>

    <p className="font-semibold text-lg text-gray-800">{value}</p>
  </div>
);

const Stat = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>

    <p className={`font-bold text-lg ${color}`}>{value}</p>
  </div>
);

const Button = ({ label }) => (
  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-5 py-3 rounded-xl text-sm font-medium">
    <FaDownload />
    {label}
  </button>
);
