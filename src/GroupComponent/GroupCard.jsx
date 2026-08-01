import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
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

/* ─── Updated GroupCard Component ──────────────────────────────────────── */
export const GroupCard = ({ group, onClick }) => {
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

  return (
    <>
      <div
        onClick={onClick}
        className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 flex flex-col gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:ring-primary/20 transition-all duration-200 overflow-hidden"
      >
        {/* Accent top bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

        {/* Top row: name + currency badge */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight tracking-tight truncate">
              {group.groupName}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {group.groupType} <span className="mx-1 text-gray-300">·</span>{" "}
              {group.frequency}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 shrink-0">
            <ReactCountryFlag
              countryCode={currencyMeta[group.currency]?.flag || "IN"}
              svg
              style={{ width: "16px", height: "16px", borderRadius: "999px" }}
            />
            <span className="text-xs font-medium text-gray-600">
              {group.currency}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`self-start text-[10px] font-semibold px-2.5 py-1 rounded-full ${cls}`}
        >
          {label}
        </span>

        {/* Flow/Transaction Type */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Flow
          </span>

          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            {group.fundDistributionType ===
            "Member → Fund Manager → Winner" ? (
              <>
                <FaUsers className="text-[11px] text-gray-500" />
                <MdArrowForward className="text-[12px] text-gray-300" />
                <FaUserTie className="text-[11px] text-blue-600" />
                <MdArrowForward className="text-[12px] text-gray-300" />
                <FaTrophy className="text-[11px] text-amber-500" />
              </>
            ) : (
              <>
                <FaUsers className="text-[11px] text-gray-500" />
                <MdArrowForward className="text-[12px] text-gray-300" />
                <FaTrophy className="text-[11px] text-amber-500" />
              </>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-xl p-2.5 group-hover:bg-primary/5 transition-colors">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              Fund
            </p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 tabular-nums">
              {getCurrencySymbol(group.currency)}
              {fmtINR(group.totalFundAmount)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 group-hover:bg-primary/5 transition-colors">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              Members
            </p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 tabular-nums">
              {group.totalMembers}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 group-hover:bg-primary/5 transition-colors">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              Admin Fee
            </p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 tabular-nums">
              {getCurrencySymbol(group.currency)}
              {fmtINR(group.adminCommissionAmount)}
            </p>
          </div>
        </div>

        {/* Manager row + Manage Settings Button */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {/* Manager Info */}
          <div className="flex items-center gap-2">
            {group.fundManagerProfileImage ? (
              <img
                src={group.fundManagerProfileImage}
                alt={group.fundManager}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary flex-shrink-0">
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

          {/* Location with Manage Settings Button */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>📍</span>
              {group.city || "NA"}, {group.state || "NA"}{" "}
              <span className="text-gray-300">·</span> {group.currency}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCard;