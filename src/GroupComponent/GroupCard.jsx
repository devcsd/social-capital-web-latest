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
  if (isPause) return { label: "Paused", cls: "bg-amber-100 text-amber-700" };
  if (!groupStatus)
    return { label: "Active", cls: "bg-green-100 text-green-700" };
  return { label: groupStatus, cls: "bg-gray-100 text-gray-600" };
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
        className="bg-white rounded-xl shadow p-5 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow"
        style={{ borderTop: "3px solid #0154D8" }}>
        {/* Top row: name + currency badge */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
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
          className={`self-start text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
          {label}
        </span>

        {/* Flow/Transaction Type */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-gray-400">
            Flow
          </span>

          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
            {group.fundDistributionType === "Member → Fund Manager → Winner" ? (
              <>
                <FaUsers className="text-[11px] text-gray-500" />
                <MdArrowForward className="text-[12px] text-gray-400" />
                <FaUserTie className="text-[11px] text-blue-600" />
                <MdArrowForward className="text-[12px] text-gray-400" />
                <FaTrophy className="text-[11px] text-yellow-500" />
              </>
            ) : (
              <>
                <FaUsers className="text-[11px] text-gray-500" />
                <MdArrowForward className="text-[12px] text-gray-400" />
                <FaTrophy className="text-[11px] text-yellow-500" />
              </>
            )}
          </div>
        </div>

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
              Admin Fee
            </p>
            <p className="text-sm font-bold text-gray-700 mt-0.5">
              {getCurrencySymbol(group.currency)}
              {fmtINR(group.adminCommissionAmount)}
            </p>
          </div>
        </div>

        {/* Manager row + Manage Settings Button */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {/* Manager Info */}
          <div className="flex items-center gap-2">
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

          {/* Location with Manage Settings Button */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              📍 {group.city || "NA"}, {group.state || "NA"} · {group.currency}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCard;