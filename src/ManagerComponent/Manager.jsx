import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "antd";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Coins,
  X,
} from "lucide-react";
import { currencyMeta } from "../utils/currencyMeta";
import { formatCurrency } from "../utils/formatCurrency";
import { getAllFundManager } from "../api/api";
import ReactCountryFlag from "react-country-flag";
import EmptyState from "../AdminComponent/EmptyState";
import ManualPagination from "../AdminComponent/Pagination";
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
  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
    {children}
  </label>
);

/* ── input with lucide prefix icon ── */
const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative flex items-center">
    <Icon
      size={14}
      className="absolute left-3 text-slate-400 pointer-events-none z-10"
    />
    <Input
      {...props}
      className="pl-8 rounded-lg border-slate-200 w-full"
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

  /* ── skeleton ── */
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />
      <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-200 rounded mb-4" />
      <div className="w-full space-y-3 mt-4">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>
      <div className="w-full mt-4 h-20 bg-slate-200 rounded-xl" />
    </div>
  );

  /* ── UI ── */
  return (
    <div className="p-0 max-w-7xl mx-auto min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">
          Group managers overview
        </h1>
        <p className="text-sm text-slate-500">
          Manage and monitor all group managers
        </p>
      </div>

      {/* ═══════════════════ FILTER PANEL ═══════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 mb-8">
        {/* Panel header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Filter managers
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Search and filter managers by name, contact, location, and
              currency.
            </p>
          </div>

          {hasAnyFilter && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium
                         bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>

        {/* Row 1 — Name · Email · Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <IconInput
              icon={User}
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
              className="w-full"
              placeholder={
                <span className="flex items-center gap-2 text-slate-400">
                  <Coins size={14} />
                  All currencies
                </span>
              }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading &&
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && currentData.length === 0 && (
          <EmptyState message="No group managers match your filters" />
        )}

        {!loading &&
          currentData.map((fm) => {
            const isActive = fm.managedGroups > 0;
            return (
              <div
                key={fm.fundManagerId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm
                           hover:shadow-md transition p-6 flex flex-col items-center
                           text-center cursor-pointer"
                onClick={() =>
                  navigate(`/adminPanel/FundManager/${fm.fundManagerId}`)
                }
              >
                {fm.profileImage ? (
                  <img
                    src={fm.profileImage}
                    alt={fm.fundManagerName}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-100"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full mb-4 bg-primary text-white
                                text-xl font-semibold flex items-center justify-center"
                  >
                    {getInitials(fm.fundManagerName)}
                  </div>
                )}

                <div className="space-y-1">
                  {/* Fund Manager Name */}
                  <h3 className="text-lg font-semibold text-primary-hover">
                    {fm.fundManagerName}
                  </h3>

                  {/* Email */}
                  <p className="text-sm text-gray-600 break-all">
                    {fm.emailId || "N/A"}
                  </p>

                  {/* Mobile */}
                  <p className="text-sm text-gray-500">
                    {fm.mobileNumber || "N/A"}
                  </p>
                </div>

                <span
                  className={`mt-2 px-4 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-slate-600">Groups</span>
                    <span className="font-semibold text-primary">
                      {fm.managedGroups}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-slate-600">Members</span>
                    <span className="font-semibold text-primary">
                      {fm.groupMembers}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 bg-secondary rounded-xl px-4 py-3">
                  <p className="text-sm font-medium text-primary-hover mb-2 text-left">
                    Earnings
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {fm.earnings && Object.keys(fm.earnings).length > 0 ? (
                      Object.entries(fm.earnings).map(([currency, amount]) => {
                        const meta = currencyMeta[currency];
                        if (!meta) return null;
                        return (
                          <div
                            key={currency}
                            className="flex items-center justify-between
                                       bg-white/70 rounded-lg px-3 py-2"
                          >
                            <ReactCountryFlag
                              svg
                              countryCode={meta.flag}
                              style={{ fontSize: "1.2em" }}
                            />
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(currency, amount)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 text-left">
                        No earnings yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {!loading && filteredManagers.length > itemsPerPage && (
        <ManualPagination
          total={filteredManagers.length}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
