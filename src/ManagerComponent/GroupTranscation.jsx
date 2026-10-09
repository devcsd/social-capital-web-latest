import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CalendarRange,
  Clock,
  Coins,
  Crown,
  Download,
  FileText,
  Info,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
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
      indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items) => items[0].label,

          label: (context) => {
            const seconds = context.raw;

            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;

            return `Payment Time: ${mins}m ${secs}s`;
          },

          afterLabel: (context) => {
            const date = context.dataset.transactionDates[context.dataIndex];

            return `Paid At: ${formatTransactionTime(date)}`;
          },
        },
      },
    },
    layout: {
      padding: { right: 48 },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#eef2f7" },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
        title: {
          display: true,
          text: "Time (Seconds)",
          color: "#475569",
          font: { size: 12 },
        },
      },
      y: {
        grid: { display: false },
        border: { color: "#e2e8f0" },
        ticks: { color: "#475569", font: { size: 11 } },
      },
    },
  };

  /* value label drawn at the end of each bar (display only) */
  const barValueLabels = {
    id: "barValueLabels",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, di) => {
        chart.getDatasetMeta(di).data.forEach((bar, i) => {
          const seconds = dataset.data[i];
          if (seconds == null) return;
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          const text = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
          ctx.save();
          ctx.fillStyle = "#1e4fe5";
          ctx.font = "600 12px sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillText(text, bar.x + 8, bar.y);
          ctx.restore();
        });
      });
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

 const getDurationInSeconds = (start, end) => {
  if (!start || !end) return 1;

  const diff =
    (new Date(end).getTime() - new Date(start).getTime()) / 1000;

  return Math.max(Math.ceil(diff), 1);
};

  const buildPaymentChartData = (apiData) => {
    const startDate = apiData.timeLine.transactionStartDate;

    const labels = [];
    const data = [];
    const transactionDates = [];

    apiData.transactionDetails.forEach((txn) => {
      if (txn.memberContributeAmount == null) return;

      labels.push(txn.userName);
      data.push(getDurationInSeconds(startDate, txn.transactionDate));
      transactionDates.push(txn.transactionDate);
    });

    return {
      labels,
      datasets: [
        {
          label: "Payment Time",
          data,
          transactionDates, // <-- custom field
          backgroundColor: "#2f5cf0",
          hoverBackgroundColor: "#1b3fc4",
          borderRadius: 4,
          barThickness: 30,
        },
      ],
    };
  };

  const formatTransactionTime = (utcDate) => {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(utcDate));
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

  const isCompleted = Boolean(group?.winnerName);
  const completionRate = getCompletionRate(
    group?.completeContribution,
    group?.totalMember,
  );

  /* CSV export of the transactions already shown in the table */
  const downloadCsv = () => {
    const header = ["#", "Member", "Transaction ID", "Amount", "Date", "Status"];
    const rows = paidTransactions.map((t, i) => [
      i + 1,
      t.userName,
      t.id,
      t.memberContributeAmount,
      formatDate(t.transactionDate),
      t.status,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `round-${group?.roundNumber ?? ""}-transactions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const SectionTitle = ({ icon: Icon, children, right }) => (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sc-blue-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <h2 className="text-base font-bold text-sc-ink-900">{children}</h2>
      </div>
      {right}
    </div>
  );

  const Row = ({ label, children, last }) => (
    <div
      className={`flex items-center justify-between py-2.5 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <span className="text-slate-600">{label}</span>
      {children}
    </div>
  );

  const StatusPill = ({ large }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${
        large ? "px-3 py-1 text-sm" : "px-3 py-0.5 text-xs"
      } ${
        isCompleted ? "bg-green-50 text-green-700" : "bg-sc-blue-100 text-primary"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isCompleted ? "bg-green-600" : "bg-primary"
        }`}
      />
      {isCompleted ? "Completed" : "upcoming"}
    </span>
  );

  const HeaderStat = ({ icon, iconBg, label, value }) => (
    <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 shadow-sm px-3 py-3">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-sc-ink-900 leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );

  const card = "rounded-2xl bg-white border border-slate-100 shadow-sm p-5";

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6">
      {/* Back */}
      <button
        disabled={!group}
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-sm font-semibold text-sc-ink-900 hover:text-primary mb-4 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-default"
      >
        <ArrowLeft size={18} className="text-primary" />
        Back to rounds
      </button>
      {loading ? (
        <div className="space-y-5">
          {/* Header Skeleton */}
          <div className="bg-white p-5 rounded-2xl flex flex-wrap items-center gap-4">
            <SkeletonBox className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <SkeletonText className="w-40 h-6" />
              <SkeletonText className="w-52" />
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3 min-w-[300px]">
              <SkeletonBox className="h-16" />
              <SkeletonBox className="h-16" />
              <SkeletonBox className="h-16" />
            </div>
            <SkeletonBox className="h-20 w-80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-5">
              <SkeletonBox className="h-56" />
              <SkeletonBox className="h-56" />
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 space-y-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonBox key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="rounded-2xl bg-gradient-to-r from-white via-blue-50/60 to-sc-blue-100/60 border border-slate-100 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center gap-5">
            {/* Left: Badge + Title + Dates */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center shadow-md shrink-0">
                R{group?.roundNumber}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-sc-ink-900">
                    Round {group?.roundNumber}
                  </h1>
                  <StatusPill />
                </div>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays size={15} className="text-slate-500" />
                  {formatDate(group?.timeLine?.transactionStartDate)} –{" "}
                  {formatDate(group?.timeLine?.transactionEndDate)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <HeaderStat
                label="Members"
                value={group?.totalMember}
                iconBg="bg-sc-blue-100"
                icon={<Users size={20} className="text-primary" />}
              />
              <HeaderStat
                label="Total Amount"
                value={formatCurrency(group?.currency, group?.totalFundValue)}
                iconBg="bg-amber-100"
                icon={<Coins size={20} className="text-sc-gold-600" />}
              />
              <HeaderStat
                label="Duration"
                value={formatDuration(group?.timeLine?.totalDuration)}
                iconBg="bg-violet-100"
                icon={<CalendarRange size={20} className="text-violet-600" />}
              />
            </div>

            {/* Right: Winner Card */}
            <div
              className={`relative overflow-hidden flex items-center gap-4 rounded-2xl px-4 py-3 xl:min-w-[320px] ${
                isCompleted
                  ? "bg-gradient-to-r from-green-50 to-emerald-100/80"
                  : "bg-slate-50"
              }`}
            >
              {group?.winnerName ? (
                <>
                  {group?.winnerProfileImage ? (
                    <img
                      src={group.winnerProfileImage}
                      alt={group.winnerName}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white font-semibold ring-2 ring-white shrink-0">
                      {getInitials(group.winnerName)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Crown size={14} className="text-amber-500 fill-amber-400" />
                      Round Winner
                    </p>
                    <p className="text-base font-bold text-sc-ink-900 truncate">
                      {group.winnerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Round {group?.roundNumber}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center shrink-0">
                    <Trophy size={24} className="text-amber-500 fill-amber-400" />
                  </div>
                </>
              ) : (
                <>
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Trophy size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Winner</p>
                    <p className="text-sm font-semibold text-slate-400">
                      Not selected yet
                    </p>
                    <p className="text-xs text-slate-400">
                      Round {group?.roundNumber}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-5">
              {/* Round Overview */}
              <div className={card}>
                <SectionTitle icon={FileText}>Round Overview</SectionTitle>
                <div className="text-sm">
                  <Row label="Round Number">
                    <span className="font-semibold text-sc-ink-900">
                      Round {group?.roundNumber}
                    </span>
                  </Row>
                  <Row label="Status">
                    <StatusPill large />
                  </Row>
                  <Row label="Total Contributions">
                    <span className="text-base font-bold text-primary">
                      {formatCurrency(group?.currency, group?.totalFundValue)}
                    </span>
                  </Row>
                  <Row label="Payout Amount" last>
                    <span className="text-base font-bold text-primary">
                      {formatCurrency(group?.currency, group?.settlementAmount)}
                    </span>
                  </Row>
                </div>
              </div>

              {/* Participation */}
              <div className={card}>
                <SectionTitle icon={Users}>Participation</SectionTitle>
                <div className="text-sm">
                  <Row label="Total Members">
                    <span className="font-semibold text-sc-ink-900">
                      {group?.totalMember}
                    </span>
                  </Row>
                  <Row label="Contributions Received">
                    <span className="font-semibold text-green-600">
                      {group?.completeContribution}
                    </span>
                  </Row>
                  <Row label="Pending Members">
                    <span className="font-semibold text-red-600">
                      {group?.pendingContribution}
                    </span>
                  </Row>
                  <Row label="Completion Rate" last>
                    <span className="font-semibold text-sc-ink-900">
                      {completionRate}%
                    </span>
                  </Row>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className={card}>
                <SectionTitle icon={Clock}>Timeline</SectionTitle>
                <ol className="relative ml-[7px] border-l-2 border-sc-blue-100 space-y-5 text-sm">
                  {[
                    {
                      label: "Start Date",
                      value: formatDate(group?.timeLine?.transactionStartDate),
                    },
                    {
                      label: "End Date",
                      value: formatDate(group?.timeLine?.transactionEndDate),
                    },
                    {
                      label: "Total Duration",
                      value: formatDuration(group?.timeLine?.totalDuration),
                    },
                  ].map((item) => (
                    <li key={item.label} className="relative pl-7">
                      <span className="absolute -left-[8px] top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-sc-blue-100" />
                      <p className="text-slate-600">{item.label}</p>
                      <p className="font-bold text-sc-ink-900 mt-0.5">
                        {item.value}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Transactions */}
              <div className={card}>
                <SectionTitle
                  icon={FileText}
                  right={
                    <button
                      type="button"
                      onClick={downloadCsv}
                      disabled={paidTransactions.length === 0}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-sc-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={16} />
                      Download CSV
                    </button>
                  }
                >
                  Transaction Details
                </SectionTitle>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-sc-blue-100/50 text-left text-xs font-semibold text-slate-600">
                        <th className="px-4 py-3 rounded-l-lg">#</th>
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidTransactions.length > 0 ? (
                        paidTransactions.map((t, i) => (
                          <tr
                            key={t.txnId}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >
                            <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {t.userProfileImage ? (
                                  <img
                                    src={t.userProfileImage}
                                    className="h-9 w-9 rounded-full object-cover shrink-0"
                                    alt={t.userName}
                                  />
                                ) : (
                                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                    {getInitials(t.userName)}
                                  </div>
                                )}
                                <span className="font-semibold text-sc-ink-900 whitespace-nowrap">
                                  {t.userName}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-xs text-slate-700 font-mono">
                              {t.id}
                            </td>

                            <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">
                              {formatCurrency(
                                group?.currency,
                                t.memberContributeAmount,
                              )}
                            </td>

                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                              {formatDate(t.transactionDate)}
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                  statusStyles[t.status] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-10 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <div className="w-12 h-12 rounded-full bg-sc-blue-100 flex items-center justify-center">
                                <Wallet size={22} className="text-primary" />
                              </div>
                              <p className="text-sm font-semibold">
                                No one has started their payments
                              </p>
                              <p className="text-xs text-slate-400">
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

              {/* Chart */}
              <div className={card}>
                <SectionTitle
                  icon={BarChart3}
                  right={
                    <span className="hidden md:flex items-center gap-2 rounded-lg bg-sc-blue-100/60 px-3 py-2 text-xs text-slate-600">
                      <Info size={15} className="text-primary" />
                      Shows time taken by each member to complete payment
                    </span>
                  }
                >
                  Payment Completion Time
                </SectionTitle>

                <div
                  style={{
                    height: Math.max(
                      220,
                      (chartData?.labels?.length || 0) * 40 + 70,
                    ),
                  }}
                >
                  {console.log("Chart Dataahsjahsjkahsjsajskj", chartData)}
                  {chartData?.datasets?.length > 0 && (
                    <Bar
                      data={chartData}
                      options={paymentChartOptions}
                      plugins={[barValueLabels]}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
