import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "antd";
import {
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Coins,
  RotateCcw,
  Briefcase,
  Users,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { currencyMeta } from "../utils/currencyMeta";
import { formatCurrency } from "../utils/formatCurrency";
import { getAllFundManager } from "../api/api";
import ReactCountryFlag from "react-country-flag";
import EmptyState from "../AdminComponent/EmptyState";
import { getInitials } from "../utils/getInitials";

const { Option } = Select;

const EMPTY_FILTERS = {
  name: "",
  email: "",
  mobile: "",
  country: "",
  state: "",
  city: "",
  currencies: [],
};

const ALL_CURRENCIES = ["INR", "AUD", "USD", "GBP", "CNY"];

/* ── small reusable label ── */
const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

/* ── input with lucide prefix icon ── */
const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative flex items-center group">
    <Icon
      size={16}
      className="absolute left-3 text-slate-400 group-focus-within:text-primary pointer-events-none z-10 transition-colors"
    />
    <Input
      {...props}
      className="pl-9 h-10 rounded-lg border-slate-200 w-full hover:border-primary/50 focus:border-primary transition-colors"
      allowClear
    />
  </div>
);

export default function ManagerDetails() {
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const [fundManager, setFundManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const setF = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const setFEvent = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const hasAnyFilter = Object.entries(filters).some(([k, v]) =>
    k === "currencies" ? v.length > 0 : v !== "",
  );

  const activeFilterCount = Object.entries(filters).reduce(
    (count, [k, v]) => count + (k === "currencies" ? (v.length > 0 ? 1 : 0) : v !== "" ? 1 : 0),
    0,
  );

  /* ── filter logic ── */
  const filteredManagers = fundManager.filter((fm) => {
    const includes = (field, term) =>
      !term.trim() ||
      (field ?? "").toLowerCase().includes(term.toLowerCase().trim());

    return (
      includes(fm.fundManagerName, filters.name) &&
      includes(fm.emailId, filters.email) &&
      includes(fm.mobileNumber, filters.mobile) &&
      includes(fm.country, filters.country) &&
      includes(fm.state, filters.state) &&
      includes(fm.city, filters.city) &&
      (filters.currencies.length === 0 ||
        (fm.earnings &&
          filters.currencies.every((c) => fm.earnings[c] !== undefined)))
    );
  });

  useEffect(() => setCurrentPage(1), [filters]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredManagers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  /* ── fetch ── */
  const fetchFundManager = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFundManager();
      setFundManager(response.data.data);
    } catch (err) {
      console.error("Error fetching managers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFundManager();
  }, [fetchFundManager]);

  /* ── derived summary (display only) ── */
  const activeCount = fundManager.filter((fm) => fm.managedGroups > 0).length;
  const earningsTotals = fundManager.reduce((acc, fm) => {
    Object.entries(fm.earnings || {}).forEach(([currency, amount]) => {
      if (!currencyMeta[currency]) return;
      acc[currency] = (acc[currency] || 0) + (Number(amount) || 0);
    });
    return acc;
  }, {});
  const earningsEntries = Object.entries(earningsTotals).sort(
    ([a], [b]) => (a === "INR" ? -1 : b === "INR" ? 1 : 0),
  );
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

  /* ── skeleton ── */
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-slate-100/70 to-transparent" />
      <div className="flex items-center gap-4">
        <div className="w-[88px] h-[88px] rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-3 w-44 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-11 bg-slate-200 rounded-xl" />
        <div className="h-11 bg-slate-200 rounded-xl" />
      </div>
      <div className="mt-3 h-[60px] bg-slate-200 rounded-xl" />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  /* ── summary stat card ── */
  const StatCard = ({ icon, iconBg, label, children }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-5">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {children}
      </div>
    </div>
  );

  /* ── UI ── */
  return (
    <div className="mx-auto min-h-screen">
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-sc-ink-900 tracking-tight">
            Group Admins
          </h1>
          <p className="text-base text-slate-500 mt-1">
            Manage and monitor all group admins
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Total Admins"
          iconBg="bg-sc-blue-100"
          icon={<Users size={24} className="text-primary" />}
        >
          <p className="text-2xl font-bold text-sc-ink-900 leading-tight mt-0.5">
            {loading ? "—" : fundManager.length}
          </p>
        </StatCard>

        <StatCard
          label="Active Admins"
          iconBg="bg-green-50"
          icon={<span className="w-5 h-5 rounded-full bg-green-600" />}
        >
          <p className="text-2xl font-bold text-sc-ink-900 leading-tight mt-0.5">
            {loading ? "—" : activeCount}
          </p>
        </StatCard>

        <StatCard
          label="Total Earnings"
          iconBg="bg-amber-50"
          icon={<Coins size={24} className="text-sc-gold-600" />}
        >
          {loading ? (
            <p className="text-2xl font-bold text-sc-ink-900 leading-tight mt-0.5">—</p>
          ) : earningsEntries.length === 0 ? (
            <p className="text-2xl font-bold text-sc-ink-900 leading-tight mt-0.5">0</p>
          ) : (
            <div className="flex items-baseline flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              <p className="text-2xl font-bold text-sc-ink-900 leading-tight">
                {formatCurrency(earningsEntries[0][0], earningsEntries[0][1])}
              </p>
              {earningsEntries.slice(1).map(([currency, amount]) => (
                <span
                  key={currency}
                  className="text-sm font-semibold text-slate-500"
                >
                  {formatCurrency(currency, amount)}
                </span>
              ))}
            </div>
          )}
        </StatCard>
      </div>

      {/* ═══════════════════ FILTER PANEL ═══════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5">
        {/* Panel header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-sc-blue-100 flex items-center justify-center shrink-0">
              <SlidersHorizontal size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-sc-ink-900 flex items-center gap-2">
                Filter managers
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Search and filter managers by name, contact, location, and
                currency.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            disabled={!hasAnyFilter}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-primary
                       hover:bg-sc-blue-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-default transition-colors"
          >
            <RotateCcw size={16} />
            Reset filters
          </button>
        </div>

        {/* Row 1 — Name · Email · Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <IconInput
              icon={Search}
              placeholder="Search by name..."
              value={filters.name}
              onChange={setFEvent("name")}
            />
          </div>

          <div>
            <FieldLabel>Email</FieldLabel>
            <IconInput
              icon={Mail}
              placeholder="Search by email..."
              value={filters.email}
              onChange={setFEvent("email")}
            />
          </div>

          <div>
            <FieldLabel>Mobile</FieldLabel>
            <IconInput
              icon={Phone}
              placeholder="Search by mobile..."
              value={filters.mobile}
              onChange={setFEvent("mobile")}
            />
          </div>
        </div>

        {/* Row 2 — Country · State · City · Currencies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <FieldLabel>Country</FieldLabel>
            <IconInput
              icon={Globe}
              placeholder="Type country..."
              value={filters.country}
              onChange={setFEvent("country")}
            />
          </div>

          <div>
            <FieldLabel>State</FieldLabel>
            <IconInput
              icon={MapPin}
              placeholder="Type state..."
              value={filters.state}
              onChange={setFEvent("state")}
            />
          </div>

          <div>
            <FieldLabel>City</FieldLabel>
            <IconInput
              icon={Building2}
              placeholder="Type city..."
              value={filters.city}
              onChange={setFEvent("city")}
            />
          </div>

          <div>
            <FieldLabel>Currencies</FieldLabel>
            <Select
              mode="multiple"
              className="w-full fm-currency-select"
              style={{ minHeight: 40 }}
              prefix={<Coins size={15} className="text-slate-400 mr-1" />}
              placeholder={<span className="text-slate-500">All currencies</span>}
              value={filters.currencies}
              onChange={setF("currencies")}
              allowClear
              maxTagCount={2}
              maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
              optionLabelProp="label"
            >
              {ALL_CURRENCIES.map((c) => {
                const meta = currencyMeta[c];
                return (
                  <Option key={c} value={c} label={c}>
                    <span className="flex items-center gap-2">
                      {meta && (
                        <ReactCountryFlag
                          svg
                          countryCode={meta.flag}
                          style={{ fontSize: "1.1em" }}
                        />
                      )}
                      {c}
                    </span>
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      {/* ════════════════ END FILTER PANEL ════════════════ */}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading &&
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && currentData.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState message="No group Admins match your filters" />
          </div>
        )}

        {!loading &&
          currentData.map((fm) => {
            const isActive = fm.managedGroups > 0;
            const earnings = Object.entries(fm.earnings || {}).filter(
              ([currency]) => currencyMeta[currency],
            );
            return (
              <div
                key={fm.fundManagerId}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm
                           hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200
                           p-5 flex flex-col cursor-pointer"
                onClick={() =>
                  navigate(`/adminPanel/FundManager/${fm.fundManagerId}`)
                }
              >
                <ChevronRight
                  size={16}
                  className="absolute top-5 right-5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                />

                {/* Identity */}
                <div className="flex items-center gap-5">
                  {fm.profileImage ? (
                    <img
                      src={fm.profileImage}
                      alt={fm.fundManagerName}
                      className={`w-[88px] h-[88px] rounded-full object-cover shrink-0 ring-2 ring-offset-2 ${
                        isActive ? "ring-green-300" : "ring-slate-200"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-[88px] h-[88px] rounded-full shrink-0 bg-primary text-white ring-2 ring-offset-2
                                  text-2xl font-semibold flex items-center justify-center ${
                                    isActive ? "ring-green-300" : "ring-slate-200"
                                  }`}
                    >
                      {getInitials(fm.fundManagerName)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="text-base font-bold text-sc-ink-900 truncate">
                      {fm.fundManagerName}
                    </h3>
                    <p className="text-sm text-slate-600 truncate mt-0.5">
                      {fm.emailId || "N/A"}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {fm.mobileNumber || "N/A"}
                    </p>
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-green-600" : "bg-red-500"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Groups · Members */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                    <Briefcase size={17} className="text-primary shrink-0" />
                    <span className="text-sm text-slate-700">Groups</span>
                    <span className="ml-auto text-base font-bold text-primary">
                      {fm.managedGroups}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                    <Users size={17} className="text-primary shrink-0" />
                    <span className="text-sm text-slate-700">Members</span>
                    <span className="ml-auto text-base font-bold text-primary">
                      {fm.groupMembers}
                    </span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="mt-3 bg-amber-100/60 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-sc-ink-900 mb-1.5">
                    Earnings
                  </p>
                  {earnings.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                      {earnings.map(([currency, amount]) => (
                        <div key={currency} className="flex items-center gap-3">
                          <ReactCountryFlag
                            svg
                            countryCode={currencyMeta[currency].flag}
                            style={{ width: "1.6em", height: "1.2em", borderRadius: 2 }}
                          />
                          <span className="text-xl font-bold text-sc-ink-900">
                            {formatCurrency(currency, amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Coins size={20} className="text-sc-gold-600" />
                      <span className="text-sm text-slate-600">
                        No earnings yet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {!loading && filteredManagers.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-6 mt-6 mb-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                       bg-primary text-white hover:bg-sc-blue-700
                       disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-sc-ink-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-5 py-1.5 rounded-lg text-sm font-medium transition-colors
                       bg-primary text-white hover:bg-sc-blue-700
                       disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
