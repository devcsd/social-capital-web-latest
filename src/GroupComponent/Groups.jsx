import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
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
import { FiSearch, FiMapPin, FiGlobe, FiLayers, FiX } from "react-icons/fi";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { GiDiamondRing, GiHeartEarrings, GiMagicHat } from "react-icons/gi";
import { LuHouse, LuBriefcaseBusiness } from "react-icons/lu";
import { MdOutlineSavings } from "react-icons/md";
import { getAllGroupCategoriesData } from "../api/api";
import ReactCountryFlag from "react-country-flag";

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

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

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
  <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 animate-pulse">
    <div className="h-3 w-28 bg-gray-200 rounded" />
    <div className="h-7 w-20 bg-gray-200 rounded" />
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4 animate-pulse">
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

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-gray-400 text-sm">…</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? "bg-primary text-white border border-primary shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-gray-400 text-sm">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
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
  });

  const { user } = useAuth();
  const navigate = useNavigate();

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
      <div className="min-h-screen p-6 space-y-6">
        <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
              className="bg-white p-5 rounded-xl shadow h-[300px] animate-pulse"
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
    const currencyMatch =
      filters.currencies.length === 0 ||
      filters.currencies.includes(group.currency);
    return (
      countryMatch && stateMatch && cityMatch && typeMatch && currencyMatch
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

  /* ── Chart data ── */
  const chartLabels = filteredGroups.map((g) => g.groupName);
  const chartFunds = filteredGroups.map((g) => g.totalFundAmount ?? 0);
  const chartMembers = filteredGroups.map((g) => g.totalMembers ?? 0);

  const donutData = {
    labels: chartLabels.length ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "Members",
        data: chartLabels.length ? chartMembers : [1],
        backgroundColor: chartLabels.length ? COLORS : ["#e5e7eb"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const lineData = {
    labels: chartLabels.length ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "Fund Amount",
        data: chartLabels.length ? chartFunds : [0],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.08)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: COLORS,
        pointRadius: 5,
      },
    ],
  };

  const chartOpts = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { display: false }, grid: { display: false } },
      y: { ticks: { display: false }, grid: { display: false } },
    },
  });

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <h1 className="text-2xl font-bold text-primary">Group Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Filter Groups
            </h3>
            <p className="text-sm text-gray-500">
              Search and filter groups by location and type to find specific segments.
            </p>
          </div>

          <button
            onClick={() =>
              handleFilterChange({
                country: "",
                state: "",
                city: "",
                groupType: "",
                currencies: [],
              })
            }
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <FiX size={14} />
            Clear
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Country
            </label>
            <div className="relative">
              <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              State
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              City
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Group Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Group Type
            </label>
            <div className="relative">
              <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filters.groupType}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    groupType: e.target.value,
                  })
                }
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white"
              >
                <option value="">All Group Types</option>
                {groupTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Groups"
          value={totalGroups}
          accent="text-primary"
        />
        <StatCard
          label="Total Fund"
          value={`${fmtINR(totalFundAmount)}`}
          accent="text-emerald-600"
        />
        <StatCard
          label="Showing"
          value={`${filteredGroups.length} groups`}
          accent="text-gray-700"
        />
        <StatCard
          label="Page"
          value={`${currentPage} / ${totalPages || 1}`}
          accent="text-gray-700"
        />
      </div>

      {/* ── Group Cards Grid ── */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 text-sm">
            No groups match your current filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedGroups.map((g) => (
              <GroupCard
                key={g.groupId}
                group={g}
                onClick={() =>
                  navigate(`/adminPanel/GroupDetails/${g.groupId}`)
                }
              />
            ))}
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* ── Pagination Info ── */}
          <p className="text-center text-xs text-gray-400 -mt-2">
            Showing {(currentPage - 1) * CARDS_PER_PAGE + 1}–
            {Math.min(currentPage * CARDS_PER_PAGE, filteredGroups.length)} of{" "}
            {filteredGroups.length} groups
          </p>
        </>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Members per Group">
          <Doughnut data={donutData} options={chartOpts()} />
        </ChartCard>
        <ChartCard title="Fund Amount Trend">
          <Line data={lineData} options={chartOpts()} />
        </ChartCard>
      </div>
    </div>
  );
};

/* ─── Group Card ──────────────────────────────────────────────────────────── */
const GroupCard = ({ group, onClick }) => {
  const { label, cls } = statusMeta(group.groupStatus, group.isPause);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-5 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow"
      style={{ borderTop: "3px solid #0154D8" }}
    >
      {/* Top row: name + currency badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
              {group.groupName}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {group.groupType} · {group.frequency}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <ReactCountryFlag
            countryCode={currencyMeta[group.currency]?.flag || "IN"}
            svg
            style={{ width: "18px", height: "18px", borderRadius: "999px" }}
          />
          <span className="text-xs font-medium text-gray-700">
            {group.currency}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span
        className={`self-start text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}
      >
        {label}
      </span>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
            Fund
          </p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">
            {getCurrencySymbol(group.currency)}
            {fmtINR(group.totalFundAmount)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
            Members
          </p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">
            {group.totalMembers}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
            Commission
          </p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">
            {getCurrencySymbol(group.currency)}
            {fmtINR(group.adminCommissionAmount)}
          </p>
        </div>
      </div>

      {/* Manager row */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        {group.fundManagerProfileImage ? (
          <img
            src={group.fundManagerProfileImage}
            alt={group.fundManager}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-500 flex-shrink-0">
            {group.fundManagerProfileName}
          </div>
        )}
        <span className="text-xs text-gray-500 flex-1 truncate">
          {group.fundManager}
        </span>
        <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
          Admin
        </span>
      </div>

      {/* Location */}
      <p className="text-xs text-gray-400 -mt-1">
        📍 {group.city || "NA"}, {group.state || "NA"} · {group.currency}
      </p>
    </div>
  );
};

/* ─── Reusable Atoms ──────────────────────────────────────────────────────── */
const StatCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <h2 className={`text-xl font-bold mt-0.5 ${accent}`}>{value}</h2>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div
    className="bg-white p-5 rounded-xl shadow flex flex-col"
    style={{ height: 300 }}
  >
    <h2 className="text-sm font-semibold text-primary mb-3">{title}</h2>
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </div>
);

export default Groups;
