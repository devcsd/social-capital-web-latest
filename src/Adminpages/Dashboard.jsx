import React, { useEffect, useState, useCallback } from "react";
import {
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiAlertCircle,
  FiSend,
  FiMapPin,
  FiFilter,
} from "react-icons/fi";
import { getDashboardData } from "../api/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // KPI Card Skeleton
  const SkeletonKPI = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
      </div>
      <div className="mt-5 h-3 w-24 bg-slate-200 rounded"></div>
      <div className="mt-3 h-8 w-20 bg-slate-300 rounded"></div>
    </div>
  );

  // Overview Card Skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-5 w-36 bg-slate-300 rounded mb-5"></div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center mb-4">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-12 bg-slate-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  // List Skeleton
  const SkeletonList = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-5 w-40 bg-slate-300 rounded mb-5"></div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded-xl p-3 mb-3">
          <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-slate-300 rounded"></div>
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
console.log(filters,"filters")

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
console.log(filters,"filters")
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
        { title: "Total Members", value: dashboard.totalMember, icon: FiUsers },
        {
          title: "Fund Managers",
          value: dashboard.totalFundManager,
          icon: FiUsers,
        },
        {
          title: "Active Groups",
          value: dashboard.totalActiveGroup,
          icon: FiLayers,
        },
        {
          title: "Total Group Value",
          value: `${Number(dashboard.totalGroupValue || 0).toLocaleString("en-IN")}`,
          icon: FiDollarSign,
        },
        {
          title: "Pending Txns",
          value: `${Number(dashboard.totalPendingTxn || 0).toLocaleString("en-IN")}`,
          icon: FiAlertCircle,
        },
        {
          title: "Pending Requests",
          value: dashboard.totalPendingRequest,
          icon: FiSend,
        },
      ]
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Social Capital Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor groups, members, transactions performance.
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-end gap-4 w-full sm:w-auto">
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
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleFilter}
              disabled={loading || !fromDate || !toDate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <FiFilter size={16} />
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
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
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
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <Icon className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-slate-500 text-sm mt-4">{item.title}</h3>
                  <p className="text-2xl font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Group Status */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Group Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Active</span>
                  <b>{dashboard.groupStatus?.activeGroups ?? 0}</b>
                </div>
                <div className="flex justify-between">
                  <span>Paused</span>
                  <b>{dashboard.groupStatus?.pausedGroups ?? 0}</b>
                </div>
              </div>
            </div>

            {/* Auction Overview */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Auction Overview</h2>
              <div className="space-y-2">
                <p>
                  Total Auction Groups:{" "}
                  {dashboard.auctionOverview?.totalAuctionGroup ?? 0}
                </p>
                <p>Live Rounds: {dashboard.auctionOverview?.liveRound ?? 0}</p>
                <p>
                  Total Winners: {dashboard.auctionOverview?.totalWinner ?? 0}
                </p>
                <p>
                  Dividend Paid: ₹
                  {Number(
                    dashboard.auctionOverview?.dividendPaid ?? 0,
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Rotation Overview */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Rotation Overview</h2>
              <div className="space-y-2">
                <p>
                  Total Rotation Groups:{" "}
                  {dashboard.rotationOverview?.totalRotationGroup ?? 0}
                </p>
                <p>Live Rounds: {dashboard.rotationOverview?.liveRound ?? 0}</p>
                <p>
                  Total Winners: {dashboard.rotationOverview?.totalWinner ?? 0}
                </p>
                <p>
                  Settlement Paid: ₹
                  {Number(
                    dashboard.rotationOverview?.settlementPaid ?? 0,
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Pending Actions</h2>
              <div className="space-y-3">
                <div>
                  {dashboard.pendingAction?.pendingGroupReq ?? 0} Group Requests
                </div>
                <div>
                  {dashboard.pendingAction?.pausedGroupsToday ?? 0} Paused
                  Groups Today
                </div>
                <div>
                  ₹
                  {Number(
                    dashboard.pendingAction?.settlementPending ?? 0,
                  ).toLocaleString("en-IN")}{" "}
                  Pending Settlements
                </div>
                <div>
                  ₹
                  {Number(
                    dashboard.pendingAction?.contributionPending ?? 0,
                  ).toLocaleString("en-IN")}{" "}
                  Pending Contributions
                </div>
                <div>
                  {dashboard.pendingAction?.newEnquiries ?? 0} New Enquiries
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-4 text-sm">
                {dashboard.recentActivity?.latestJoiner && (
                  <div>
                    Latest Joiner:{" "}
                    {dashboard.recentActivity.latestJoiner.userName} joined{" "}
                    {dashboard.recentActivity.latestJoiner.groupName} (
                    {new Date(
                      dashboard.recentActivity.latestJoiner.approvedAt,
                    ).toLocaleString()}
                    )
                  </div>
                )}
                {dashboard.recentActivity?.latestWinner && (
                  <div>
                    Latest Winner:{" "}
                    {dashboard.recentActivity.latestWinner.winnerName} — Round{" "}
                    {dashboard.recentActivity.latestWinner.roundNumber} in{" "}
                    {dashboard.recentActivity.latestWinner.groupName} (
                    {new Date(
                      dashboard.recentActivity.latestWinner.updatedAt,
                    ).toLocaleString()}
                    )
                  </div>
                )}
                {dashboard.recentActivity?.latestSettlementPaid ? (
                  <div>
                    Latest Settlement Paid:{" "}
                    {JSON.stringify(
                      dashboard.recentActivity.latestSettlementPaid,
                    )}
                  </div>
                ) : (
                  <div className="text-slate-400">
                    No recent settlement paid
                  </div>
                )}
                {dashboard.recentActivity?.latestGroupCreation && (
                  <div>
                    Latest Group Created: "
                    {dashboard.recentActivity.latestGroupCreation.groupName}" by{" "}
                    {dashboard.recentActivity.latestGroupCreation.managerName} (
                    {new Date(
                      dashboard.recentActivity.latestGroupCreation.createdAt,
                    ).toLocaleString()}
                    )
                  </div>
                )}
              </div>
            </div>

            {/* Top Group Managers */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Top Group Managers</h2>
              <div className="space-y-3">
                {(dashboard.topGroupManagers ?? []).map((mgr) => (
                  <div key={mgr.managerId} className="border rounded-xl p-3">
                    {mgr.managerName} - {mgr.groupsCreated} Groups - ₹
                    {Number(mgr.commissionEarned ?? 0).toLocaleString("en-IN")}{" "}
                    Earnings
                  </div>
                ))}
              </div>
            </div>

            {/* Location Analytics */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <FiMapPin /> Location Analytics
              </h2>
              <div className="space-y-3">
                {(dashboard.locationAnalytics ?? []).map((loc) => (
                  <div key={loc.state} className="flex justify-between">
                    <span>{loc.state}</span>
                    <b>{loc.totalUsers} Members</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        !error && (
          <div className="text-center text-slate-500 py-20">
            No data available.
          </div>
        )
      )}
    </div>
  );
}
