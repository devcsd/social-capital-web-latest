import { useState, useCallback, useEffect } from "react";
import { Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
// import { getTransactionByRoundID } from "../data/adminpanel";
import { useNavigate, useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { getTransactionByRoundID } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitials } from "../utils/getInitials";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const { Text } = Typography;

/* ---------------- PAGE ---------------- */

export default function GroupTranscation() {
  const { roundID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [group, setGroup] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Days",
        },
        ticks: {
          stepSize: 1,
        },
        grid: {
          borderDash: [4, 4],
          color: "#e5e7eb",
        },
      },
    },
  };

  const formatDuration = (days) => {
    if (!days || days <= 0) return "0 Day";

    if (days === 1) return "1 Day";
    if (days < 7) return `${days} Days`;

    if (days < 14) return "1 Week";
    if (days < 30) return `${Math.floor(days / 7)} Weeks`;

    if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? "1 Month" : `${months} Months`;
    }

    const years = Math.floor(days / 365);
    return years === 1 ? "1 Year" : `${years} Years`;
  };

  const getDurationInDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffMs = endDate - startDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const buildPaymentChartData = (apiData) => {
    const startDate = apiData.timeLine.transactionStartDate;

    const labels = [];
    const data = [];

    apiData.transactionDetails.forEach((txn) => {
      if (txn.memberContributeAmount === null) return;
      if (!txn.transactionDate) return;

      labels.push(txn.userName);
      data.push(getDurationInDays(startDate, txn.transactionDate));
    });

    return {
      labels,
      datasets: [
        {
          label: "Days",
          data,
          backgroundColor: "#3b2fb3",
          borderRadius: 10,
          barThickness: 40,
        },
      ],
    };
  };

  /* ---------------- Skeleton Blocks ---------------- */
  const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  const SkeletonText = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`} />
  );

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Sent: "bg-blue-100 text-blue-700",
    Received: "bg-green-100 text-green-700",
  };

  const getCompletionRate = (completed = 0, total = 0) => {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchFundManagerGroupsMembers = useCallback(async () => {
    if (!roundID) return;

    setLoading(true);
    try {
      const response = await getTransactionByRoundID(roundID);
      console.log("Response", response);
      // ✅ correct level
      const Data = response.data.data;

      setGroup(Data);
      setTransactions(Data.transactionDetails || []);
      setChartData(buildPaymentChartData(Data));
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, [roundID]);

  useEffect(() => {
    fetchFundManagerGroupsMembers();
  }, [fetchFundManagerGroupsMembers]);

  useEffect(() => {
    console.log(roundID);
    console.log("GRoup", group);
    console.log("Transcation", transactions);
  }, [group]);
  const paidTransactions =
    transactions?.filter((t) => t.memberContributeAmount !== null) || [];

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      {/* Back */}
      <button
        disabled={!group}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-4 cursor-pointer">
        <ArrowLeftOutlined />
        <Text strong>Back to rounds</Text>
      </button>
      {loading ? (
        <div className="min-h-screen p-4 md:p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white p-6 rounded-xl space-y-4">
            <SkeletonText className="w-40" />
            <div className="grid grid-cols-3 gap-4">
              <SkeletonBox className="h-16" />
              <SkeletonBox className="h-16" />
              <SkeletonBox className="h-16" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonBox className="h-64" />
            <SkeletonBox className="h-64 lg:col-span-2" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonBox key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-6 mt-4 rounded-xl">
            {/* Left: Title + Status */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">
                  Round {group?.roundNumber}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    group?.winnerName
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                  {group?.winnerName ? "Completed" : "upcoming"}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(group?.timeLine?.transactionStartDate)} –{" "}
                    {formatDate(group?.timeLine?.transactionEndDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="mt-1 text-lg font-semibold">
                    {group?.totalMember}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="mt-1 text-lg font-semibold text-primary">
                    {formatCurrency(group?.currency, group?.totalFundValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Winner Card */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              {group?.winnerName ? (
                <>
                  {group?.winnerProfileImage ? (
                    <img
                      src={group.winnerProfileImage}
                      alt={group.winnerName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {getInitials(group.winnerName)}
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500">Winner</p>
                    <p className="text-sm font-semibold">{group.winnerName}</p>
                    <p className="text-xs text-gray-400">
                      Round {group?.roundNumber}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                    🏆
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Winner</p>
                    <p className="text-sm font-medium text-gray-400">
                      Not selected yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Round {group?.roundNumber}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Cards */}
            <div className="space-y-6 mb-5">
              {/* Round Overview */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Round Overview</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Round Number</span>
                    <span className="font-medium">
                      {" "}
                      Round {group?.roundNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        group?.winnerName
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                      {group?.winnerName ? "Completed" : "upcoming"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Contributions</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(group?.currency, group?.totalFundValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Settlement Amount</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(group?.currency, group?.settlementAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Participation */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Participation</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Members</span>
                    <span className="font-medium">{group?.totalMember}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Contributions Received
                    </span>
                    <span className="font-medium text-green-600">
                      {group?.completeContribution}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending Members</span>
                    <span className="font-medium text-red-600">
                      {group?.pendingContribution}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Completion Rate</span>
                      <span>
                        {getCompletionRate(
                          group?.completeContribution,
                          group?.totalMember
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${getCompletionRate(
                            group?.completeContribution,
                            group?.totalMember
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm mb-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold">Transaction Details</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="rounded-lg border px-4 py-2 text-sm">
                    Filter
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500">
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidTransactions.length > 0 ? (
                      paidTransactions.map((t) => (
                        <tr key={t.txnId} className="border-t hover:bg-gray-50">
                          <td className="flex items-center gap-3 px-4 py-3">
                            {t.userProfileImage ? (
                              <img
                                src={t.userProfileImage}
                                className="h-12 w-12 rounded-full object-cover"
                                alt={t.userName}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
                                {getInitials(t.userName)}
                              </div>
                            )}
                            <span className="font-medium">{t.userName}</span>
                          </td>

                          <td className="px-4 py-3">{t.id}</td>

                          <td className="px-4 py-3 font-semibold text-primary">
                            {formatCurrency(
                              group?.currency,
                              t.memberContributeAmount
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatDate(t.transactionDate)}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                statusStyles[t.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}>
                              {t.status}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <button className="rounded-lg bg-primary px-4 py-2 text-xs text-white hover:bg-indigo-700">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* ✅ VALID EMPTY STATE */
                      <tr>
                        <td colSpan={6} className="py-10 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <span className="text-3xl">💸</span>
                            <p className="text-sm font-medium">
                              No one has started their payments
                            </p>
                            <p className="text-xs text-gray-400">
                              Waiting for members to contribute
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT – Timeline */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">Timeline</h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Start Date</span>
                  <span className="font-semibold">
                    {formatDate(group?.timeLine?.transactionStartDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">End Date</span>
                  <span className="font-semibold">
                    {formatDate(group?.timeLine?.transactionEndDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Duration</span>
                  <span className="font-semibold">
                    {formatDuration(group?.timeLine?.totalDuration)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT – Chart */}
            <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">
                Payment Completion Time
              </h2>

              <div className="h-[300px]">
                {chartData?.datasets?.length > 0 && (
                  <Bar data={chartData} options={paymentChartOptions} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
