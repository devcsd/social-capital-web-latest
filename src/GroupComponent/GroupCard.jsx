import React, { useState } from "react";
import { FiSettings, FiUsers, FiMapPin, FiArrowRight } from "react-icons/fi";
import { MdArrowForward } from "react-icons/md";
import { FaUsers, FaUserTie, FaTrophy } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";

/* ─── Currency Helpers ──────────────────────────────────────────────────── */
const currencyMeta = {
  INR: { symbol: "₹", flag: "IN" },
  USD: { symbol: "$", flag: "US" },
  AUD: { symbol: "$", flag: "AU" },
  CNY: { symbol: "¥", flag: "CN" },
  GBP: { symbol: "£", flag: "GB" },
};

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

const getCurrencySymbol = (currency) =>
  currencyMeta[currency]?.symbol || currency;

const statusMeta = (groupStatus, isPause) => {
  if (isPause)
    return {
      label: "Paused",
      cls: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    };
  if (!groupStatus)
    return {
      label: "Active",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    };
  return {
    label: groupStatus,
    cls: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
  };
};

const cardAccents = [
  { bar: "bg-gradient-to-r from-blue-600 to-blue-400", tile: "bg-blue-50 text-blue-600" },
  { bar: "bg-gradient-to-r from-blue-600 to-violet-400", tile: "bg-orange-50 text-orange-500" },
  { bar: "bg-gradient-to-r from-violet-600 to-fuchsia-400", tile: "bg-pink-50 text-pink-500" },
];

/* ─── Updated GroupCard Component ──────────────────────────────────────── */
export const GroupCard = ({ group, onClick, accentIndex = 0 }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { label, cls } = statusMeta(group.groupStatus, group.isPause);

  const handleSettingsClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    setIsSettingsModalOpen(true);
  };

  const handleSettingsSave = async (settings) => {
    // TODO: Replace with your actual API call
    console.log("Saving settings:", settings);
    // Example API call:
    // await updateGroupSettings(settings.groupId, settings);
  };

  const accent = cardAccents[accentIndex % cardAccents.length];

  return (
    <>
      <div
        onClick={onClick}
        className="group relative bg-white rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      >
        {/* Accent top bar */}
        <div className={`absolute inset-x-0 top-0 h-[3px] ${accent.bar}`} />

        {/* Top row: icon + name + currency badge */}
        <div className="flex items-start gap-3 pt-1">
          <div
            className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${accent.tile}`}
          >
            <FiUsers size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-[14px] leading-tight tracking-tight truncate">
              {group.groupName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {group.groupType} <span className="mx-1 text-slate-300">•</span>{" "}
              {group.frequency}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2.5 py-1 shrink-0">
            <ReactCountryFlag
              countryCode={currencyMeta[group.currency]?.flag || "IN"}
              svg
              style={{ width: "16px", height: "12px", borderRadius: "2px" }}
            />
            <span className="text-[11px] font-semibold text-slate-700">
              {group.currency}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`self-start text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}
        >
          {label}
        </span>

        {/* Flow/Transaction Type */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Flow
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1">
            {group.fundDistributionType ===
            "Member → Fund Manager → Winner" ? (
              <>
                <FaUsers className="text-[11px] text-slate-500" />
                <MdArrowForward className="text-[11px] text-slate-300" />
                <FaUserTie className="text-[11px] text-blue-600" />
                <MdArrowForward className="text-[11px] text-slate-300" />
                <FaTrophy className="text-[11px] text-amber-500" />
              </>
            ) : (
              <>
                <FaUsers className="text-[11px] text-slate-500" />
                <MdArrowForward className="text-[11px] text-slate-300" />
                <FaTrophy className="text-[11px] text-amber-500" />
              </>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50/70 rounded-xl px-2 py-2.5">
            <p className="text-[10px] text-blue-500/80 font-medium uppercase tracking-wide">
              Fund
            </p>
            <p className="text-[15px] font-bold text-slate-900 mt-0.5 tabular-nums truncate">
              {getCurrencySymbol(group.currency)}
              {fmtINR(group.totalFundAmount)}
            </p>
          </div>
          <div className="bg-violet-50/70 rounded-xl px-2 py-2.5">
            <p className="text-[10px] text-violet-500/80 font-medium uppercase tracking-wide">
              Members
            </p>
            <p className="text-[15px] font-bold text-indigo-900 mt-0.5 tabular-nums">
              {group.totalMembers}
            </p>
          </div>
          <div className="bg-orange-50/80 rounded-xl px-2 py-2.5">
            <p className="text-[10px] text-orange-500 font-medium uppercase tracking-wide">
              Admin Fee
            </p>
            <p className="text-[15px] font-bold text-orange-600 mt-0.5 tabular-nums truncate">
              {getCurrencySymbol(group.currency)}
              {fmtINR(group.adminCommissionAmount)}
            </p>
          </div>
        </div>

        {/* Manager row */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2.5">
            {group.fundManagerProfileImage ? (
              <img
                src={group.fundManagerProfileImage}
                alt={group.fundManager}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold bg-blue-50 text-blue-700 flex-shrink-0">
                {group.fundManagerProfileName}
              </div>
            )}
            <span className="text-[13px] text-slate-700 flex-1 truncate">
              {group.fundManager}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full flex-shrink-0">
              Admin
            </span>
          </div>

          {/* Location + open arrow */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500 flex items-center gap-1.5 min-w-0 truncate">
              <FiMapPin className="text-rose-500 shrink-0" size={12} />
              {group.city || "NA"}, {group.state || "NA"}{" "}
              <span className="text-slate-300">·</span> {group.currency}
            </p>
            <span className="h-8 w-9 shrink-0 rounded-lg border border-slate-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
              <FiArrowRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCard;