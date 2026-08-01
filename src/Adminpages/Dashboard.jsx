import React, { useEffect, useState, useCallback } from "react";
import {
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiAlertCircle,
  FiSend,
  FiMapPin,
  FiFilter,
  FiTrendingUp,
  FiRefreshCw,
  FiAward,
  FiRepeat,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import { getDashboardData } from "../api/api";

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
        },
        {
          title: "Group Managers",
          value: dashboard.totalFundManager,
          icon: FiUsers,
          tint: "bg-violet-50 text-violet-600",
        },
        {
          title: "Active Groups",
          value: dashboard.totalActiveGroup,
          icon: FiLayers,
          tint: "bg-emerald-50 text-emerald-600",
        },
        {
          title: "Total Group Value",
          value: `${Number(dashboard.totalGroupValue || 0).toLocaleString("en-IN")}`,
          icon: FiDollarSign,
          tint: "bg-teal-50 text-teal-600",
          prefix: "₹",
        },
        {
          title: "Pending Txns",
          value: `${Number(dashboard.totalPendingTxn || 0).toLocaleString("en-IN")}`,
          icon: FiAlertCircle,
          tint: "bg-amber-50 text-amber-600",
          prefix: "₹",
        },
        {
          title: "Pending Requests",
          value: dashboard.totalPendingRequest,
          icon: FiSend,
          tint: "bg-rose-50 text-rose-600",
        },
      ]
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Overview
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Social Capital Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor groups, members, transactions performance.
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6 flex flex-col sm:flex-row items-end gap-4 w-full sm:w-auto">
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleFilter}
              disabled={loading || !fromDate || !toDate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm shadow-indigo-200 disabled:shadow-none"
            >
              {loading ? (
                <FiRefreshCw size={16} className="animate-spin" />
              ) : (
                <FiFilter size={16} />
              )}
              {loading ? "Filtering..." : "Filter"}
            </button>

            {(fromDate || toDate) && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Reset
              </button>
            )}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonKPI key={i} />
            ))}
          </div>

          {/* Main Cards */}
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-4">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-5">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-7">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.tint}`}
                    >
                      <Icon className="text-xl" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm mt-4">{item.title}</h3>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {item.prefix ?? ""}
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Group Status */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiLayers className="text-indigo-500" /> Group Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                  <b className="text-slate-900 tabular-nums">
                    {dashboard.groupStatus?.activeGroups ?? 0}
                  </b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Paused
                  </span>
                  <b className="text-slate-900 tabular-nums">
                    {dashboard.groupStatus?.pausedGroups ?? 0}
                  </b>
                </div>
              </div>
            </div>

            {/* Auction Overview */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 border-l-4 border-l-indigo-500">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiAward className="text-indigo-500" /> Auction Overview
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Auction Groups</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.auctionOverview?.totalAuctionGroup ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Rounds</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.auctionOverview?.liveRound ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Winners</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.auctionOverview?.totalWinner ?? 0}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Bonus Paid</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    ₹
                    {Number(
                      dashboard.auctionOverview?.dividendPaid ?? 0,
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Rotation Overview */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 border-l-4 border-l-emerald-500">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiRepeat className="text-emerald-500" /> Rotation Overview
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Rotation Groups</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.rotationOverview?.totalRotationGroup ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Rounds</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.rotationOverview?.liveRound ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Winners</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {dashboard.rotationOverview?.totalWinner ?? 0}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Payout Paid</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    ₹
                    {Number(
                      dashboard.rotationOverview?.settlementPaid ?? 0,
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiClock className="text-amber-500" /> Pending Actions
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                  <span className="text-slate-600">Group Requests</span>
                  <span className="font-semibold text-amber-700 tabular-nums">
                    {dashboard.pendingAction?.pendingGroupReq ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                  <span className="text-slate-600">Paused Groups Today</span>
                  <span className="font-semibold text-amber-700 tabular-nums">
                    {dashboard.pendingAction?.pausedGroupsToday ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                  <span className="text-slate-600">Pending Payouts</span>
                  <span className="font-semibold text-amber-700 tabular-nums">
                    ₹
                    {Number(
                      dashboard.pendingAction?.settlementPending ?? 0,
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                  <span className="text-slate-600">Pending Contributions</span>
                  <span className="font-semibold text-amber-700 tabular-nums">
                    ₹
                    {Number(
                      dashboard.pendingAction?.contributionPending ?? 0,
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                  <span className="text-slate-600">New Enquiries</span>
                  <span className="font-semibold text-amber-700 tabular-nums">
                    {dashboard.pendingAction?.newEnquiries ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiActivity className="text-indigo-500" /> Recent Activities
              </h2>
              <div className="space-y-3 text-sm">
                {dashboard.recentActivity?.latestJoiner && (
                  <div className="flex items-start gap-3 border border-slate-100 rounded-xl p-3">
                    <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FiUsers size={14} />
                    </span>
                    <div>
                      <p className="text-slate-700">
                        <span className="font-medium">
                          {dashboard.recentActivity.latestJoiner.userName}
                        </span>{" "}
                        joined{" "}
                        <span className="font-medium">
                          {dashboard.recentActivity.latestJoiner.groupName}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(
                          dashboard.recentActivity.latestJoiner.approvedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {dashboard.recentActivity?.latestWinner && (
                  <div className="flex items-start gap-3 border border-slate-100 rounded-xl p-3">
                    <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FiAward size={14} />
                    </span>
                    <div>
                      <p className="text-slate-700">
                        <span className="font-medium">
                          {dashboard.recentActivity.latestWinner.winnerName}
                        </span>{" "}
                        — Round{" "}
                        {dashboard.recentActivity.latestWinner.roundNumber} in{" "}
                        <span className="font-medium">
                          {dashboard.recentActivity.latestWinner.groupName}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(
                          dashboard.recentActivity.latestWinner.updatedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {dashboard.recentActivity?.latestSettlementPaid ? (
                  <div className="flex items-start gap-3 border border-slate-100 rounded-xl p-3">
                    <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                      <FiDollarSign size={14} />
                    </span>
                    <p className="text-slate-700 break-all">
                      <span className="font-medium">Latest Payout Paid:</span>{" "}
                      {JSON.stringify(
                        dashboard.recentActivity.latestSettlementPaid,
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-400 text-center py-6">
                    No recent Payout paid
                  </div>
                )}
                {dashboard.recentActivity?.latestGroupCreation && (
                  <div className="flex items-start gap-3 border border-slate-100 rounded-xl p-3">
                    <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                      <FiLayers size={14} />
                    </span>
                    <div>
                      <p className="text-slate-700">
                        Latest Group Created: "
                        <span className="font-medium">
                          {dashboard.recentActivity.latestGroupCreation.groupName}
                        </span>
                        " by{" "}
                        <span className="font-medium">
                          {
                            dashboard.recentActivity.latestGroupCreation
                              .managerName
                          }
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(
                          dashboard.recentActivity.latestGroupCreation.createdAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Group Managers */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500" /> Top Group Managers
              </h2>
              <div className="space-y-3">
                {(dashboard.topGroupManagers ?? []).map((mgr) => (
                  <div
                    key={mgr.managerId}
                    className="flex items-center justify-between border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                        {mgr.managerName?.charAt(0)?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {mgr.managerName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {mgr.groupsCreated} Groups
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600 text-sm tabular-nums">
                      ₹{Number(mgr.commissionEarned ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Analytics */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-rose-500" /> Location Analytics
              </h2>
              <div className="space-y-3">
                {(dashboard.locationAnalytics ?? []).map((loc) => {
                  const max = Math.max(
                    ...(dashboard.locationAnalytics ?? []).map(
                      (l) => l.totalUsers || 0,
                    ),
                    1,
                  );
                  const pct = Math.round(((loc.totalUsers || 0) / max) * 100);
                  return (
                    <div key={loc.state}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{loc.state}</span>
                        <b className="text-slate-900 tabular-nums">
                          {loc.totalUsers} Members
                        </b>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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