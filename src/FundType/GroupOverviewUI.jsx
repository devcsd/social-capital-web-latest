import { forwardRef } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  CalendarDays,
  ChevronDown,
  Coins,
  Database,
  Gavel,
  RefreshCw,
  Repeat,
  Search,
  Users,
} from "lucide-react";

/* Presentational pieces shared by the Auction and Rotation overview pages. */

export const OVERVIEW_THEME = {
  Auction: {
    icon: Gavel,
    iconWrap: "bg-purple-100 text-purple-600",
    accent: "text-purple-600",
    value: "text-purple-700",
    tile: "bg-purple-50/60",
    ring: "focus-within:ring-purple-200",
  },
  Rotation: {
    icon: RefreshCw,
    iconWrap: "bg-sc-blue-100 text-primary",
    accent: "text-primary",
    value: "text-primary",
    tile: "bg-sc-blue-100/50",
    ring: "focus-within:ring-sc-blue-100",
  },
};

export const OverviewHeader = ({ type, title, subtitle }) => {
  const theme = OVERVIEW_THEME[type];
  const Icon = theme.icon;
  return (
    <div className="flex items-center gap-5 mb-6">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${theme.iconWrap}`}
      >
        <Icon size={28} strokeWidth={2.2} />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-sc-ink-900 tracking-tight">
          {title}
        </h1>
        <p className="text-base text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};

export const SearchInput = ({ value, onChange }) => (
  <div className="relative w-full sm:w-[420px]">
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
    <input
      type="text"
      placeholder="Search by group name"
      value={value}
      onChange={onChange}
      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-slate-100 shadow-sm text-sm
                 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
    />
  </div>
);

export const FrequencySelect = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none h-11 pl-4 pr-10 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-sc-ink-900
                 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <option value="ALL">All Frequency</option>
      {options.map((freq) => (
        <option key={freq} value={freq}>
          {freq}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
    />
  </div>
);

/* Trigger for the antd currency Dropdown (forwards Dropdown's injected props). */
export const CurrencyTrigger = forwardRef(({ count, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    className="flex items-center gap-3 h-11 px-4 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-sc-ink-900
               hover:border-primary/30 transition-colors"
  >
    <Database size={18} className="text-primary" />
    Currency
    {count > 0 && (
      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
    <ChevronDown size={16} className="text-slate-600" />
  </button>
));
CurrencyTrigger.displayName = "CurrencyTrigger";

export const OverviewCard = ({
  type,
  group,
  flag,
  totalValue,
  onClick,
}) => {
  const theme = OVERVIEW_THEME[type];
  const Icon = theme.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5
                 transition-all duration-200 p-5 flex flex-col gap-2.5 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-1">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${theme.iconWrap}`}
        >
          <Icon size={26} strokeWidth={2.2} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-sc-ink-900 truncate">
            {group.groupName}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
            <CalendarDays size={14} className={theme.accent} />
            {group.groupStartDate ? (
              <>
                Started on {new Date(group.groupStartDate).toLocaleDateString()}
              </>
            ) : (
              <span className="text-yellow-600 font-medium">Not Started</span>
            )}
          </p>
          {group.frequency && (
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              {group.frequency}
            </span>
          )}
        </div>

        {flag && (
          <ReactCountryFlag
            svg
            countryCode={flag}
            style={{
              width: "1.75em",
              height: "1.3em",
              borderRadius: 2,
              marginTop: 28,
              flexShrink: 0,
            }}
          />
        )}
      </div>

      <div
        className={`rounded-xl px-4 py-3 flex items-center gap-3 ${theme.tile}`}
      >
        <Repeat size={18} className={theme.accent} />
        <span className="text-sm text-sc-ink-900">Total Rounds</span>
        <span className={`ml-auto text-base font-bold ${theme.value}`}>
          {group.totalRound}
        </span>
      </div>

      <div
        className={`rounded-xl px-4 py-3 flex items-center gap-3 ${theme.tile}`}
      >
        <Users size={18} className={theme.accent} />
        <span className="text-sm text-sc-ink-900">Members</span>
        <span className={`ml-auto text-base font-bold ${theme.value}`}>
          {group.totalMember}
        </span>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-amber-300 to-sc-gold-500 px-3 py-2.5 flex items-center gap-3 mt-1">
        <div className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
          <Coins size={20} className="text-sc-gold-600" />
        </div>
        <span className="text-sm font-semibold text-sc-ink-900">
          Total Group Value
        </span>
        <span className="ml-auto text-xl font-bold text-sc-ink-900">
          {totalValue}
        </span>
      </div>
    </div>
  );
};

export const OverviewSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse space-y-2.5">
    <div className="flex items-start gap-4 mb-1">
      <div className="w-16 h-16 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-5 bg-slate-200 rounded-full w-20" />
      </div>
    </div>
    <div className="h-11 bg-slate-100 rounded-xl" />
    <div className="h-11 bg-slate-100 rounded-xl" />
    <div className="h-14 bg-slate-200 rounded-xl" />
  </div>
);

export const OverviewPagination = ({
  total,
  pageSize,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const btn =
    "px-5 py-2 rounded-lg text-sm font-semibold transition-colors bg-primary text-white hover:bg-sc-blue-700 " +
    "disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed";

  return (
    <div className="flex justify-center items-center gap-6 mt-6 mb-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className={btn}
      >
        Prev
      </button>
      <span className="text-sm font-medium text-sc-ink-900">
        Page <span className="text-primary">{currentPage}</span> of{" "}
        {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className={btn}
      >
        Next
      </button>
    </div>
  );
};
