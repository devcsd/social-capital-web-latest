import React, { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  FiSearch,
  FiMapPin,
  FiGlobe,
  FiLayers,
  FiX,
  FiFilter,
  FiRotateCcw,
  FiRepeat,
  FiDollarSign,
  FiChevronDown,
  FiChevronRight,
  FiArrowLeft,
  FiArrowRight,
  FiUsers,
  FiFileText,
  FiZap,
  FiTrendingUp,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useAuth } from "../Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { GiDiamondRing, GiHeartEarrings, GiMagicHat } from "react-icons/gi";
import { LuHouse, LuBriefcaseBusiness, LuBuilding2 } from "react-icons/lu";
import { MdOutlineSavings, MdArrowForward, MdCurrencyRupee } from "react-icons/md";
import { FaUsers, FaUserTie, FaTrophy } from "react-icons/fa";
import { getAllGroupCategoriesData } from "../api/api";
import ReactCountryFlag from "react-country-flag";
import GroupCard from "./GroupCard";
/* ─── Constants ───────────────────────────────────────────────────────────── */
export const currencyMeta = {
  INR: { symbol: "₹", flag: "IN" },
  USD: { symbol: "$", flag: "US" },
  AUD: { symbol: "$", flag: "AU" },
  CNY: { symbol: "¥", flag: "CN" },
  GBP: { symbol: "£", flag: "GB" },
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

const COLORS = [
  "#36A2EB",
  "#FF6384",
  "#FF8A66",
  "#9966FF",
  "#00A86B",
  "#E91E63",
];

const CARDS_PER_PAGE = 6;

const MEMBER_BUCKETS = [
  { label: "1–5 members", min: 0, max: 5, color: "#3b82f6" },
  { label: "6–10 members", min: 6, max: 10, color: "#ec4899" },
  { label: "11–20 members", min: 11, max: 20, color: "#f59e0b" },
  { label: "21–50 members", min: 21, max: 50, color: "#22c55e" },
  { label: "51+ members", min: 51, max: Infinity, color: "#10b981" },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

// Compact axis labels: 1K, 1L, 1Cr
const fmtCompact = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e7) return `${+(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `${+(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
  return `${v}`;
};

const getCurrencySymbol = (currency) =>
  currencyMeta[currency]?.symbol || currency;

const statusMeta = (groupStatus, isPause) => {
  if (isPause) return { label: "Paused", cls: "bg-amber-100 text-amber-700" };
  if (!groupStatus)
    return { label: "Active", cls: "bg-green-100 text-green-700" };
  return { label: groupStatus, cls: "bg-gray-100 text-gray-600" };
};

/* ─── Skeleton Atoms ──────────────────────────────────────────────────────── */
const SkeletonStat = () => (
  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 flex flex-col gap-3 animate-pulse">
    <div className="h-3 w-28 bg-gray-200 rounded" />
    <div className="h-7 w-20 bg-gray-200 rounded" />
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-16 h-5 bg-gray-200 rounded-full" />
    </div>
    <div className="h-2 bg-gray-200 rounded-full" />
    <div className="flex justify-between">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-1 items-center">
          <div className="w-14 h-3 bg-gray-200 rounded" />
          <div className="w-10 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
      <div className="w-7 h-7 bg-gray-200 rounded-full" />
      <div className="w-28 h-3 bg-gray-200 rounded" />
    </div>
  </div>
);

/* ─── Pagination Component ────────────────────────────────────────────────── */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  const numBtn =
    "w-8 h-8 rounded-lg text-[13px] font-medium transition-colors";
  const idleBtn =
    "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-2">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 h-8 rounded-lg text-[12px] font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        <FiArrowLeft size={12} /> Prev
      </button>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${numBtn} ${idleBtn}`}>
            1
          </button>
          {start > 2 && <span className="px-1 text-slate-400 text-sm">…</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`${numBtn} ${
            p === currentPage
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
              : "text-slate-700 hover:bg-white hover:border hover:border-slate-200"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-sm">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${numBtn} ${idleBtn}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 h-8 rounded-lg text-[12px] font-medium bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        Next <FiArrowRight size={12} />
      </button>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const Groups = () => {
  const [responsedata, setResponseData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    groupType: "",
    currencies: [],
    TxnType: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllGroupCategoriesData();
        setResponseData(response.data);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };
    fetchData();
  }, []);

  /* ── Skeleton ── */
  if (!responsedata) {
    return (
      <div className="min-h-screen space-y-6">
        <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-gray-100 h-[300px] animate-pulse"
            >
              <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
              <div className="h-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const {
    totalGroups,
    totalFundAmount,
    groupInfoByType: groups = [],
  } = responsedata?.data ?? {};

  /* ── Derived filter options ── */
  const groupTypes = [
    ...new Set(groups.map((g) => g.groupType).filter(Boolean)),
  ];
  const currencies = [
    ...new Set(groups.map((g) => g.currency).filter(Boolean)),
  ];
  const txnTypes = [
    ...new Set(groups.map((g) => g.fundDistributionType).filter(Boolean)),
  ];

  /* ── Filter logic ── */
  const filteredGroups = groups.filter((group) => {
    const countryMatch =
      !filters.country ||
      group.country?.toLowerCase().includes(filters.country.toLowerCase());
    const stateMatch =
      !filters.state ||
      group.state?.toLowerCase().includes(filters.state.toLowerCase());
    const cityMatch =
      !filters.city ||
      group.city?.toLowerCase().includes(filters.city.toLowerCase());
    const typeMatch =
      !filters.groupType || group.groupType === filters.groupType;
    const txnTypeMatch =
      !filters.TxnType || group.fundDistributionType === filters.TxnType;
    const currencyMatch =
      filters.currencies.length === 0 ||
      filters.currencies.includes(group.currency);
    return (
      countryMatch &&
      stateMatch &&
      cityMatch &&
      typeMatch &&
      txnTypeMatch &&
      currencyMatch
    );
  });

  /* ── Pagination logic ── */
  const totalPages = Math.ceil(filteredGroups.length / CARDS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );

  /* Reset to page 1 when filters change */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredTotalGroups = filteredGroups.length;

  const filteredTotalFundAmount = filteredGroups.reduce(
    (sum, group) => sum + (group.totalFundAmount || 0),
    0,
  );
  /* ── Chart data ── */
  const chartLabels = filteredGroups.map((g) => g.groupName);
  const chartFunds = filteredGroups.map((g) => g.totalFundAmount ?? 0);

  // Members per group, bucketed by group size
  const memberBuckets = MEMBER_BUCKETS.map((b) => ({
    ...b,
    count: filteredGroups.filter((g) => {
      const m = g.totalMembers ?? 0;
      return m >= b.min && m <= b.max;
    }).length,
  }));

  const donutData = {
    labels: filteredGroups.length
      ? memberBuckets.map((b) => b.label)
      : ["No Data"],
    datasets: [
      {
        label: "Groups",
        data: filteredGroups.length ? memberBuckets.map((b) => b.count) : [1],
        backgroundColor: filteredGroups.length
          ? memberBuckets.map((b) => b.color)
          : ["#e5e7eb"],
        borderWidth: 3,
        borderColor: "#fff",
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: chartLabels.length ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "Group Amount",
        data: chartLabels.length ? chartFunds : [0],
        borderColor: "#4f46e5",
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return "rgba(99,102,241,0.12)";
          const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, "rgba(99,102,241,0.28)");
          grad.addColorStop(1, "rgba(99,102,241,0)");
          return grad;
        },
        tension: 0.45,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const tooltipStyle = {
    backgroundColor: "#fff",
    titleColor: "#64748b",
    bodyColor: "#0f172a",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    padding: 10,
    displayColors: false,
    titleFont: { size: 11, weight: "500" },
    bodyFont: { size: 13, weight: "700" },
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
  };

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: { label: (ctx) => fmtINR(ctx.parsed.y) },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          maxRotation: 0,
          autoSkip: true,
          callback(value) {
            const label = this.getLabelForValue(value) ?? "";
            return label.length > 10 ? `${label.slice(0, 10)}…` : label;
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          maxTicksLimit: 5,
          callback: (v) => fmtCompact(v),
        },
      },
    },
  };

  const showingFrom = filteredGroups.length
    ? (currentPage - 1) * CARDS_PER_PAGE + 1
    : 0;
  const showingTo = Math.min(currentPage * CARDS_PER_PAGE, filteredGroups.length);

  return (
    <div className="min-h-screen space-y-5">
      {/* ── Header ── */}
      <div className="flex justify-between items-end gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-2">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <FiChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-700">Groups</span>
          </nav>
          <h1 className="text-[30px] leading-tight font-extrabold text-slate-900 tracking-tight">
            Group Management
          </h1>
          <p className="text-[15px] text-slate-500 mt-1">
            Monitor, filter, and manage all active fund groups.
          </p>
        </div>
        <PeopleIllustration />
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiFilter size={18} />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                Filter Groups
              </h3>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Search and filter groups by location and type to find specific
                segments.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handleFilterChange({
                country: "",
                state: "",
                city: "",
                groupType: "",
                currencies: [],
                TxnType: "",
              })
            }
            className="flex shrink-0 items-center gap-2 px-4 py-2 text-[13px] font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FiRotateCcw size={14} />
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3">
          {/* Country */}
          <FilterField label="Country" icon={FiGlobe}>
            <input
              type="text"
              placeholder="Type country..."
              value={filters.country}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  country: e.target.value,
                })
              }
              className={fieldCls}
            />
          </FilterField>

          {/* State */}
          <FilterField label="State" icon={FiMapPin}>
            <input
              type="text"
              placeholder="Type state..."
              value={filters.state}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  state: e.target.value,
                })
              }
              className={fieldCls}
            />
          </FilterField>

          {/* City */}
          <FilterField label="City" icon={LuBuilding2}>
            <input
              type="text"
              placeholder="Type city..."
              value={filters.city}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  city: e.target.value,
                })
              }
              className={fieldCls}
            />
          </FilterField>

          {/* Group Type */}
          <FilterField label="Group Type" icon={FiLayers} select>
            <select
              value={filters.groupType}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  groupType: e.target.value,
                })
              }
              className={`${fieldCls} appearance-none pr-9`}
            >
              <option value="">All Group Types</option>
              {groupTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Txn Type */}
          <FilterField label="Transaction Type" icon={FiRepeat} select>
            <select
              value={filters.TxnType}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  TxnType: e.target.value,
                })
              }
              className={`${fieldCls} appearance-none pr-9`}
            >
              <option value="">All Transaction Types</option>
              {txnTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Currencies Type */}
          <FilterField label="Currencies" icon={FiDollarSign} select>
            <select
              value={filters.currencies}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  currencies: e.target.value,
                })
              }
              className={`${fieldCls} appearance-none pr-9`}
            >
              <option value="">All Currencies</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Search — filters apply live; this jumps to the results */}
          <div className="hidden xl:block" />
          <div className="flex items-end">
            <button
              onClick={() =>
                resultsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="w-full flex items-center justify-center gap-2 h-[42px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm shadow-indigo-200 transition-colors"
            >
              <FiSearch size={16} />
              Search Groups
            </button>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(groups, null, 2)}</pre> */}

      {/* ── KPI Strip ── */}
      <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-6">
        <StatCard
          label="Total Groups"
          value={filteredTotalGroups}
          icon={FiUsers}
          tint="bg-blue-50 text-blue-600"
          color="#4f46e5"
        />
        <StatCard
          label="Total Fund Amount"
          value={`${fmtINR(filteredTotalFundAmount)}`}
          icon={MdCurrencyRupee}
          tint="bg-emerald-50 text-emerald-600"
          color="#10b981"
        />
        <StatCard
          label="Total Pages"
          value={totalPages || 1}
          sub={
            filteredGroups.length
              ? `Showing ${showingFrom}–${showingTo} of ${filteredGroups.length} groups`
              : "No groups to show"
          }
          icon={FiFileText}
          tint="bg-violet-50 text-violet-600"
        />
      </div>

      {/* ── Group Cards Grid ── */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-12 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <FiSearch size={20} />
          </div>
          <p className="text-slate-600 text-sm font-medium">
            No groups match your current filters.
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Try adjusting or clearing a filter to see more results.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedGroups.map((g, idx) => {
              console.log("the Groups:",g)
              return (
                <GroupCard
                  key={g.groupId}
                  group={g}
                  accentIndex={idx}
                  onClick={() => {
                    g.groupType === "Rotation"
                      ? navigate(
                          `/adminPanel/RotationGroupDetails/${g.groupId}`,
                        )
                      : g.groupType === "Auction"
                        ? navigate(
                            `/adminPanel/AuctionGroupDetails/${g.groupId}`,
                          )
                        : navigate(`/adminPanel/GroupCategories`);
                  }}
                />
              );
            })}
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* ── Pagination Info ── */}
          <p className="text-center text-xs text-slate-500 !mt-3">
            Showing {showingFrom}–{showingTo} of {filteredGroups.length} groups
          </p>
        </>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Members per Group"
          subtitle="Distribution of members across all active groups."
          icon={FiZap}
          tint="bg-violet-600 text-white"
        >
          <div className="flex h-full flex-col sm:flex-row items-center gap-6">
            <div className="relative h-[170px] w-[170px] shrink-0">
              <Doughnut data={donutData} options={donutOpts} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 leading-none tabular-nums">
                  {filteredGroups.length}
                </span>
                <span className="text-xs text-slate-500 mt-1">Groups</span>
              </div>
            </div>
            <ul className="flex-1 w-full space-y-2">
              {memberBuckets.map((b) => (
                <li
                  key={b.label}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span className="flex items-center gap-2.5 text-slate-600">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: b.color }}
                    />
                    {b.label}
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {b.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
        <ChartCard
          title="Group Amount Trend"
          subtitle="Total group fund amount across groups."
          icon={FiTrendingUp}
          tint="bg-emerald-500 text-white"
        >
          <Line data={lineData} options={lineOpts} />
        </ChartCard>
      </div>

    </div>
  );
};

/* ─── Reusable Atoms ──────────────────────────────────────────────────────── */
const fieldCls =
  "w-full pl-10 pr-3 h-[42px] border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow";

const FilterField = ({ label, icon: Icon, select = false, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      {children}
      {select && (
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      )}
    </div>
  </div>
);

// Decorative trend wave
const Sparkline = ({ color }) => (
  <svg
    viewBox="0 0 120 40"
    preserveAspectRatio="none"
    className="hidden sm:block h-10 w-28 shrink-0"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`gs-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 34 C 14 32, 22 26, 34 28 S 52 22, 62 24 S 80 14, 92 12 S 110 6, 120 4 L120 40 L0 40 Z"
      fill={`url(#gs-${color.slice(1)})`}
    />
    <path
      d="M0 34 C 14 32, 22 26, 34 28 S 52 22, 62 24 S 80 14, 92 12 S 110 6, 120 4"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// Decorative header illustration
const PeopleIllustration = () => (
  <svg
    viewBox="0 0 150 70"
    className="hidden 2xl:block h-[64px] w-[140px] shrink-0"
    aria-hidden="true"
  >
    <circle cx="36" cy="22" r="10" fill="#dbe4ff" />
    <path d="M16 70 q20 -46 40 0 z" fill="#dbe4ff" />
    <circle cx="112" cy="22" r="10" fill="#dbe4ff" />
    <path d="M92 70 q20 -46 40 0 z" fill="#dbe4ff" />
    <circle cx="74" cy="16" r="12" fill="#c7d4ff" />
    <path d="M50 70 q24 -56 48 0 z" fill="#c7d4ff" />
  </svg>
);

const StatCard = ({ label, value, sub, icon: Icon, tint, color }) => (
  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div
      className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${tint}`}
    >
      <Icon size={26} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] text-slate-600 font-medium">{label}</p>
      <h2 className="text-[22px] leading-tight font-bold text-slate-900 tracking-tight tabular-nums">
        {value}
      </h2>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
    {color && <Sparkline color={color} />}
  </div>
);

const ChartCard = ({ title, subtitle, icon: Icon, tint, children }) => (
  <div
    className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 flex flex-col hover:shadow-md transition-shadow"
    style={{ height: 300 }}
  >
    <div className="flex items-start gap-3 mb-4">
      <div
        className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${tint}`}
      >
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-[14px] font-bold text-indigo-950 tracking-tight">
          {title}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

export default Groups;
