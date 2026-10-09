import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiLayers,
  FiAlertCircle,
  FiSend,
  FiMapPin,
  FiFilter,
  FiRefreshCw,
  FiAward,
  FiRepeat,
  FiClock,
  FiActivity,
  FiArrowRight,
  FiChevronRight,
  FiMessageCircle,
  FiPauseCircle,
  FiCreditCard,
  FiInbox,
  FiCheck,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { RiAuctionLine, RiVipCrownFill } from "react-icons/ri";
import { getDashboardData } from "../api/api";

// ---------- Presentational helpers ----------

const Card = ({ className = "", children }) => (
  <div
    className={`bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, iconClass, title, to }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="flex items-center gap-2.5 text-[17px] font-bold text-slate-900 tracking-tight">
      <Icon className={`text-[20px] ${iconClass}`} />
      {title}
    </h2>
    {to && (
      <Link
        to={to}
        className="flex items-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition"
      >
        View All <FiArrowRight size={14} />
      </Link>
    )}
  </div>
);

// Decorative trend wave shown in the KPI cards
const Sparkline = ({ id, color }) => (
  <svg
    viewBox="0 0 100 36"
    preserveAspectRatio="none"
    className="h-9 w-24 shrink-0"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`spark-${id}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.28" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 30 C 10 26, 16 22, 26 24 S 42 30, 52 20 S 66 18, 74 14 S 90 4, 100 2 L100 36 L0 36 Z"
      fill={`url(#spark-${id})`}
    />
    <path
      d="M0 30 C 10 26, 16 22, 26 24 S 42 30, 52 20 S 66 18, 74 14 S 90 4, 100 2"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Donut = ({ segments, total }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="22" />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * c;
            const el = (
              <circle
                key={seg.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="22"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
          {total}
        </span>
        <span className="text-xs text-slate-500 mt-1">Groups</span>
      </div>
    </div>
  );
};

const OverviewRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-b-0 text-sm">
    <span className="text-slate-600">{label}</span>
    <span
      className={`tabular-nums ${
        highlight ? "font-bold text-emerald-600" : "font-semibold text-slate-900"
      }`}
    >
      {value}
    </span>
  </div>
);

const ActivityItem = ({ icon: Icon, tint, dot, title, subtitle, time }) => (
  <div className="relative pl-6">
    <span
      className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${dot}`}
    ></span>
    <div className="flex items-center gap-3 border border-slate-100 rounded-xl px-3 py-2.5 hover:bg-slate-50/70 transition">
      <span
        className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${tint}`}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-slate-800 truncate">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {time && (
        <span className="hidden sm:block shrink-0 text-[11px] text-slate-400 tabular-nums">
          {time}
        </span>
      )}
    </div>
  </div>
);

// Decorative header illustration
const HeaderIllustration = () => (
  <svg
    viewBox="0 0 200 110"
    className="hidden 2xl:block h-[100px] w-[190px] shrink-0 self-end"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dash-ill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#c7d6ff" />
        <stop offset="100%" stopColor="#e6ecff" />
      </linearGradient>
    </defs>
    <rect x="150" y="18" width="22" height="92" rx="4" fill="#dbe5ff" />
    <rect x="176" y="34" width="18" height="76" rx="4" fill="#e6ecff" />
    <rect x="128" y="44" width="18" height="66" rx="4" fill="#e6ecff" />
    <circle cx="20" cy="76" r="6" fill="url(#dash-ill)" />
    <path d="M10 110 q10 -26 20 0 z" fill="url(#dash-ill)" />
    <circle cx="40" cy="72" r="7" fill="url(#dash-ill)" />
    <path d="M28 110 q12 -30 24 0 z" fill="url(#dash-ill)" />
    <circle cx="64" cy="66" r="8.5" fill="url(#dash-ill)" />
    <path d="M50 110 q14 -36 28 0 z" fill="url(#dash-ill)" />
    <circle cx="94" cy="54" r="11" fill="#b9cbff" />
    <path d="M76 110 q18 -46 36 0 z" fill="#b9cbff" />
  </svg>
);

const rankBadge = [
  "bg-amber-100 text-amber-600 ring-amber-200",
  "bg-slate-100 text-slate-500 ring-slate-200",
  "bg-orange-100 text-orange-600 ring-orange-200",
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // KPI Card Skeleton
  const SkeletonKPI = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-11 w-11 rounded-xl bg-slate-200"></div>
      </div>
      <div className="mt-5 h-3 w-24 bg-slate-200 rounded-full"></div>
      <div className="mt-3 h-8 w-20 bg-slate-300 rounded-full"></div>
    </div>
  );

  // Overview Card Skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 animate-pulse">
      <div className="h-5 w-36 bg-slate-300 rounded-full mb-5"></div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center mb-4">
          <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-12 bg-slate-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  // List Skeleton
  const SkeletonList = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 animate-pulse">
      <div className="h-5 w-40 bg-slate-300 rounded-full mb-5"></div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border border-slate-100 rounded-xl p-3 mb-3">
          <div className="h-4 w-3/4 bg-slate-200 rounded-full mb-2"></div>
          <div className="h-4 w-1/2 bg-slate-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  // Date filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchData = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    console.log(filters, "filters");

    try {
      const response = await getDashboardData(filters);

      setDashboard(response?.data?.data ?? null);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterData = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    console.log(filters, "filters");
    try {
      const response = await getDashboardData(filters);

      console.log("filter data", response.data.data);

      setDashboard(response?.data?.data ?? null);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load (no filter applied)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setError("Please select both start and end dates.");
      return;
    }

    filterData({
      fromDate,
      toDate,
    });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setError(null);

    fetchData();
  };

  const kpis = dashboard
    ? [
        {
          title: "Total Members",
          value: dashboard.totalMember,
          icon: FiUsers,
          tint: "bg-indigo-50 text-indigo-600",
          color: "#6366f1",
        },
        {
          title: "Group Admins",
          value: dashboard.totalFundManager,
          icon: FiUsers,
          tint: "bg-fuchsia-50 text-fuchsia-600",
          color: "#e879f9",
        },
        {
          title: "Active Groups",
          value: dashboard.totalActiveGroup,
          icon: FiLayers,
          tint: "bg-emerald-50 text-emerald-600",
          color: "#10b981",
        },
        {
          title: "Total Group Value",
          value: `${Number(dashboard.totalGroupValue || 0).toLocaleString("en-IN")}`,
          icon: MdCurrencyRupee,
          tint: "bg-sky-50 text-sky-600",
          color: "#38bdf8",
          prefix: "",
        },
        {
          title: "Pending Txns",
          value: `${Number(dashboard.totalPendingTxn || 0).toLocaleString("en-IN")}`,
          icon: FiAlertCircle,
          tint: "bg-orange-50 text-orange-500",
          color: "#fb923c",
          prefix: "",
        },
        {
          title: "Pending Requests",
          value: dashboard.totalPendingRequest,
          icon: FiSend,
          tint: "bg-rose-50 text-rose-500",
          color: "#fb7185",
        },
      ]
    : [];

  // Group status breakdown for the donut
  const groupSegments = dashboard
    ? [
        {
          label: "Active",
          value: dashboard.groupStatus?.activeGroups ?? 0,
          color: "#10b981",
          dot: "bg-emerald-500",
        },
        {
          label: "Paused",
          value: dashboard.groupStatus?.pausedGroups ?? 0,
          color: "#f59e0b",
          dot: "bg-amber-500",
        },
        ...(dashboard.groupStatus?.inactiveGroups !== undefined
          ? [
              {
                label: "Inactive",
                value: dashboard.groupStatus.inactiveGroups ?? 0,
                color: "#94a3b8",
                dot: "bg-slate-400",
              },
            ]
          : []),
      ]
    : [];
  const groupTotal = groupSegments.reduce((sum, s) => sum + (s.value || 0), 0);

  const pendingActions = dashboard
    ? [
        {
          title: "Group Requests",
          subtitle: "Approve or reject new group requests",
          value: dashboard.pendingAction?.pendingGroupReq ?? 0,
          icon: FiMessageCircle,
          to: "/adminPanel/GroupCategories",
        },
        {
          title: "Paused Groups Today",
          subtitle: "Review paused groups",
          value: dashboard.pendingAction?.pausedGroupsToday ?? 0,
          icon: FiPauseCircle,
          to: "/adminPanel/GroupCategories",
        },
        {
          title: "Pending Payouts",
          subtitle: "Groups pending payout processing",
          value: Number(
            dashboard.pendingAction?.settlementPending ?? 0,
          ).toLocaleString("en-IN"),
          icon: FiCreditCard,
        },
        {
          title: "Pending Contributions",
          subtitle: "Unpaid member contributions",
          value: Number(
            dashboard.pendingAction?.contributionPending ?? 0,
          ).toLocaleString("en-IN"),
          icon: FiInbox,
        },
        {
          title: "New Enquiries",
          subtitle: "New support enquiries",
          value: dashboard.pendingAction?.newEnquiries ?? 0,
          icon: FiMessageCircle,
          to: "/adminPanel/supportEnquiry",
        },
      ]
    : [];

  const topManagers = dashboard?.topGroupManagers ?? [];
  const maxCommission = Math.max(
    ...topManagers.map((m) => Number(m.commissionEarned) || 0),
    1,
  );

  const locations = dashboard?.locationAnalytics ?? [];
  const totalLocationUsers = Math.max(
    locations.reduce((sum, l) => sum + (l.totalUsers || 0), 0),
    1,
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Live Overview
            </span>
          </div>
          <h1 className="text-[32px] leading-tight font-extrabold text-slate-900 tracking-tight">
            Social Capital Dashboard
          </h1>
          <p className="text-slate-500 mt-1.5 text-[15px]">
            Monitor groups, members, and transactions performance in real-time.
          </p>
        </div>

        <div className="flex items-end gap-6">
          {/* Date Range Filter */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 px-4 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full sm:w-auto">
            {/* From Date */}
            <div className="flex flex-col">
              <label className="text-[13px] font-medium text-slate-700 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col">
              <label className="text-[13px] font-medium text-slate-700 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                disabled={loading || !fromDate || !toDate}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-5 py-2 h-[38px] rounded-lg text-sm font-medium transition shadow-sm shadow-blue-200 disabled:shadow-none"
              >
                {loading ? (
                  <FiRefreshCw size={15} className="animate-spin" />
                ) : (
                  <FiFilter size={15} />
                )}
                {loading ? "Filtering..." : "Filter"}
              </button>

              {(fromDate || toDate) && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-4 h-[38px] rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <HeaderIllustration />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center flex items-center justify-center gap-2">
          <FiAlertCircle className="shrink-0" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !dashboard ? (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonKPI key={i} />
            ))}
          </div>

          {/* Main Cards */}
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-6">
              <SkeletonList />
            </div>
            <div className="lg:col-span-6">
              <SkeletonList />
            </div>
            <div className="lg:col-span-6">
              <SkeletonList />
            </div>
            <div className="lg:col-span-6">
              <SkeletonList />
            </div>
          </div>
        </div>
      ) : dashboard ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mb-5">
            {kpis.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="!p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.tint}`}
                  >
                    <Icon className="text-[22px]" />
                  </div>
                  <h3 className="text-slate-600 text-[13px] font-medium mt-4">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-[24px] leading-none font-bold text-slate-900 tracking-tight tabular-nums">
                      {item.prefix ?? ""}
                      {item.value}
                    </p>
                    <Sparkline id={idx} color={item.color} />
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            {/* Group Status */}
            <Card className="lg:col-span-4">
              <CardHeader
                icon={FiLayers}
                iconClass="text-blue-600"
                title="Group Status"
                to="/adminPanel/GroupCategories"
              />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Donut segments={groupSegments} total={groupTotal} />
                <div className="flex-1 w-full space-y-3.5">
                  {groupSegments.map((seg) => (
                    <div
                      key={seg.label}
                      className="grid grid-cols-[1fr_auto_3rem] items-center gap-3 text-sm"
                    >
                      <span className="text-slate-600 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${seg.dot}`}></span>
                        {seg.label}
                      </span>
                      <b className="text-slate-900 tabular-nums">{seg.value}</b>
                      <span className="text-slate-500 text-right tabular-nums">
                        {groupTotal
                          ? Math.round((seg.value / groupTotal) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Auction Overview */}
            <Card className="lg:col-span-4 border-l-[3px] !border-l-blue-600">
              <CardHeader
                icon={RiAuctionLine}
                iconClass="text-blue-600"
                title="Auction Overview"
                to="/adminPanel/Auction"
              />
              <div>
                <OverviewRow
                  label="Total Auction Groups"
                  value={dashboard.auctionOverview?.totalAuctionGroup ?? 0}
                />
                <OverviewRow
                  label="Live Rounds"
                  value={dashboard.auctionOverview?.liveRound ?? 0}
                />
                <OverviewRow
                  label="Total Winners"
                  value={dashboard.auctionOverview?.totalWinner ?? 0}
                />
                <OverviewRow
                  label="Bonus Paid"
                  highlight
                  value={Number(
                    dashboard.auctionOverview?.dividendPaid ?? 0,
                  ).toLocaleString("en-IN")}
                />
              </div>
            </Card>

            {/* Rotation Overview */}
            <Card className="lg:col-span-4 border-l-[3px] !border-l-emerald-500">
              <CardHeader
                icon={FiRepeat}
                iconClass="text-emerald-500"
                title="Rotation Overview"
                to="/adminPanel/Rotation"
              />
              <div>
                <OverviewRow
                  label="Total Rotation Groups"
                  value={dashboard.rotationOverview?.totalRotationGroup ?? 0}
                />
                <OverviewRow
                  label="Live Rounds"
                  value={dashboard.rotationOverview?.liveRound ?? 0}
                />
                <OverviewRow
                  label="Total Winners"
                  value={dashboard.rotationOverview?.totalWinner ?? 0}
                />
                <OverviewRow
                  label="Payout Paid"
                  highlight
                  value={Number(
                    dashboard.rotationOverview?.settlementPaid ?? 0,
                  ).toLocaleString("en-IN")}
                />
              </div>
            </Card>

            {/* Pending Actions */}
            <Card className="lg:col-span-6">
              <CardHeader
                icon={FiClock}
                iconClass="text-amber-500"
                title="Pending Actions"
              />
              <div className="space-y-2.5">
                {pendingActions.map((action) => {
                  const Icon = action.icon;
                  const body = (
                    <>
                      <span className="h-9 w-9 shrink-0 rounded-full bg-white/80 ring-1 ring-amber-100 text-amber-600 flex items-center justify-center">
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-800">
                          {action.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {action.subtitle}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-bold text-amber-700 tabular-nums">
                        {action.value}
                      </span>
                      <FiChevronRight
                        className={`shrink-0 ${
                          action.to ? "text-slate-500" : "text-transparent"
                        }`}
                        size={16}
                      />
                    </>
                  );
                  const rowClass =
                    "flex items-center gap-3 rounded-xl bg-amber-50/60 px-3 py-2.5 transition";
                  return action.to ? (
                    <Link
                      key={action.title}
                      to={action.to}
                      className={`${rowClass} hover:bg-amber-50`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div key={action.title} className={rowClass}>
                      {body}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-6">
              <CardHeader
                icon={FiActivity}
                iconClass="text-blue-600"
                title="Recent Activities"
              />
              <div className="relative space-y-2.5">
                <span className="absolute left-[2.5px] top-3 bottom-3 w-px bg-slate-100"></span>
                {dashboard.recentActivity?.latestJoiner && (
                  <ActivityItem
                    icon={FiUsers}
                    tint="bg-indigo-50 text-indigo-600"
                    dot="bg-sky-400"
                    title={`${dashboard.recentActivity.latestJoiner.userName} joined ${dashboard.recentActivity.latestJoiner.groupName}`}
                    subtitle="New member added to group"
                    time={new Date(
                      dashboard.recentActivity.latestJoiner.approvedAt,
                    ).toLocaleString()}
                  />
                )}
                {dashboard.recentActivity?.latestWinner && (
                  <ActivityItem
                    icon={FiAward}
                    tint="bg-emerald-50 text-emerald-600"
                    dot="bg-sky-400"
                    title={`${dashboard.recentActivity.latestWinner.winnerName} – Round ${dashboard.recentActivity.latestWinner.roundNumber} in ${dashboard.recentActivity.latestWinner.groupName}`}
                    subtitle="Round winner"
                    time={new Date(
                      dashboard.recentActivity.latestWinner.updatedAt,
                    ).toLocaleString()}
                  />
                )}
                {dashboard.recentActivity?.latestGroupCreation && (
                  <ActivityItem
                    icon={FiLayers}
                    tint="bg-violet-50 text-violet-600"
                    dot="bg-violet-400"
                    title={`Latest Group Created: "${dashboard.recentActivity.latestGroupCreation.groupName}" by ${dashboard.recentActivity.latestGroupCreation.managerName}`}
                    subtitle="New group created"
                    time={new Date(
                      dashboard.recentActivity.latestGroupCreation.createdAt,
                    ).toLocaleString()}
                  />
                )}
                {dashboard.recentActivity?.latestSettlementPaid ? (
                  <ActivityItem
                    icon={MdCurrencyRupee}
                    tint="bg-amber-50 text-amber-600"
                    dot="bg-sky-400"
                    title="Latest Payout Paid"
                    subtitle={JSON.stringify(
                      dashboard.recentActivity.latestSettlementPaid,
                    )}
                  />
                ) : (
                  <ActivityItem
                    icon={FiCheck}
                    tint="bg-slate-100 text-slate-400"
                    dot="bg-slate-300"
                    title="No recent Payout paid"
                  />
                )}
              </div>
            </Card>

            {/* Top Group Admins */}
            <Card className="lg:col-span-6">
              <CardHeader
                icon={RiVipCrownFill}
                iconClass="text-amber-400"
                title="Top Group Admins"
                to="/adminPanel/FundManager"
              />
              <div className="space-y-3.5">
                {topManagers.map((mgr, idx) => {
                  const pct = Math.round(
                    ((Number(mgr.commissionEarned) || 0) / maxCommission) * 100,
                  );
                  return (
                    <div key={mgr.managerId} className="flex items-center gap-3">
                      <span
                        className={`h-6 w-6 shrink-0 rounded-full ring-1 flex items-center justify-center text-[11px] font-bold ${
                          rankBadge[idx] ?? "bg-slate-50 text-slate-400 ring-slate-100"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="h-9 w-9 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                        {mgr.managerName?.charAt(0)?.toUpperCase()}
                      </span>
                      <div className="w-32 sm:w-40 shrink-0 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {mgr.managerName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {mgr.groupsCreated} Groups
                        </p>
                      </div>
                      <div className="hidden sm:block flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="ml-auto w-20 text-right font-bold text-emerald-600 text-sm tabular-nums">
                        {Number(mgr.commissionEarned ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Location Analytics */}
            <Card className="lg:col-span-6">
              <CardHeader
                icon={FiMapPin}
                iconClass="text-rose-500"
                title="Location Analytics"
                to="/adminPanel/Members"
              />
              <div className="space-y-3">
                {locations.map((loc) => {
                  const pct = Math.round(
                    ((loc.totalUsers || 0) / totalLocationUsers) * 100,
                  );
                  return (
                    <div
                      key={loc.state}
                      className="grid grid-cols-[1fr_auto_2.5rem] items-end gap-x-4"
                    >
                      <div>
                        <p className="text-sm text-slate-700 mb-1.5">{loc.state}</p>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                      <b className="text-[13px] text-slate-900 tabular-nums self-center">
                        {loc.totalUsers} Members
                      </b>
                      <span className="text-[12px] text-slate-500 text-right tabular-nums self-center">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      ) : (
        !error && (
          <div className="text-center text-slate-500 py-20">
            <FiLayers className="mx-auto mb-3 text-slate-300" size={40} />
            No data available.
          </div>
        )
      )}
    </div>
  );
}
