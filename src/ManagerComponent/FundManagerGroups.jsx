import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Coins,
  Crown,
  Database,
  Gavel,
  Mail,
  Phone,
  RefreshCw,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { currencyMeta } from "../utils/currencyMeta";
import { useNavigate, useParams } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { getFundManagerByID } from "../api/api";
import EmptyState from "../AdminComponent/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitials } from "../utils/getInitials";

/* ---------------- THEME PER GROUP TYPE ---------------- */
const TYPE_THEME = {
  Auction: {
    icon: Gavel,
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    chip: "bg-purple-100 text-purple-700",
    tile: "bg-purple-50/70",
    tileIcon: "text-purple-600",
    winnerTile: "bg-gradient-to-r from-purple-50 to-violet-100/80",
    winnerLabel: "text-purple-700",
    crown: "text-purple-500",
    amount: "text-purple-700",
    button: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
    status: "bg-purple-100 text-purple-700",
    statusDot: "bg-purple-600",
    fallbackDesc: "Auction based chit group",
  },
  Rotation: {
    icon: RefreshCw,
    iconBg: "bg-gradient-to-br from-blue-400 to-primary",
    chip: "bg-sc-blue-100 text-primary",
    tile: "bg-sc-blue-100/60",
    tileIcon: "text-primary",
    winnerTile: "bg-gradient-to-r from-blue-50 to-sc-blue-100",
    winnerLabel: "text-primary",
    crown: "text-primary",
    amount: "text-primary",
    button: "bg-primary hover:bg-sc-blue-700",
    status: "bg-sc-blue-100 text-primary",
    statusDot: "bg-primary",
    fallbackDesc: "Rotation based chit group",
  },
};
const themeFor = (groupType) =>
  TYPE_THEME[groupType] || TYPE_THEME.Rotation;

/* ---------------- GROUP CARD ---------------- */
const GroupCard = ({
  title,
  description,
  date,
  status,
  earned,
  winner,
  winnerImage,
  amount,
  groupId,
  currency,
  groupType,
}) => {
  const navigate = useNavigate();
  const theme = themeFor(groupType);
  const TypeIcon = theme.icon;
  const flag = currencyMeta[currency]?.flag;

  return (
    <div
      onClick={() => navigate(`/adminPanel/ManagerGroupsDetails/${groupId}`)}
      className="cursor-pointer rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col"
    >
      {/* Title */}
      <div className="flex items-start gap-4">
        <div
          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 text-white shadow-md ${theme.iconBg}`}
        >
          <TypeIcon size={24} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-sc-ink-900 truncate">
            {title}
          </h3>
          <p className="text-sm text-slate-500 truncate mt-0.5">
            {description || theme.fallbackDesc}
          </p>
        </div>
        {flag && (
          <ReactCountryFlag
            svg
            countryCode={flag}
            style={{ width: "1.7em", height: "1.25em", borderRadius: 2, marginTop: 4 }}
          />
        )}
      </div>
      <span
        className={`self-start ml-[68px] mt-2 mb-4 px-4 py-0.5 rounded-full text-sm font-semibold ${theme.chip}`}
      >
        {groupType}
      </span>

      <div className="flex flex-col gap-2.5 flex-1">
        {/* Upcoming Round */}
        <div className={`rounded-xl px-4 py-3 flex items-center gap-4 ${theme.tile}`}>
          <CalendarDays size={22} className={`shrink-0 ${theme.tileIcon}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500">Upcoming Round</p>
            <p className="font-bold text-sc-ink-900">{date}</p>
          </div>
          {status && (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${theme.status}`}
            >
              <span className={`w-2 h-2 rounded-full ${theme.statusDot}`} />
              {status}
            </span>
          )}
        </div>

        {/* Manager Earned */}
        <div className={`rounded-xl px-4 py-3 flex items-center gap-4 ${theme.tile}`}>
          <Database size={22} className={`shrink-0 ${theme.tileIcon}`} />
          <div>
            <p className="text-sm text-slate-500">Manager Earned</p>
            <p className="font-bold text-sc-ink-900">
              {formatCurrency(currency, earned)}
            </p>
          </div>
        </div>

        {/* Previous Winner */}
        <div
          className={`relative overflow-hidden rounded-xl px-4 py-3 flex items-center gap-4 ${theme.winnerTile}`}
        >
          {winner ? (
            winnerImage ? (
              <img
                src={winnerImage}
                alt="Winner"
                className="w-[52px] h-[52px] rounded-full object-cover shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold shrink-0 shadow-sm">
                {getInitials(winner)}
              </div>
            )
          ) : (
            <div className="w-[52px] h-[52px] rounded-full bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
              <Trophy size={22} className={theme.tileIcon} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-semibold tracking-wide uppercase ${theme.winnerLabel}`}
            >
              Previous Winner
            </p>
            <h3 className="text-base font-bold text-sc-ink-900 truncate mt-0.5">
              {winner || "No Completed Round"}
            </h3>
          </div>
          <Crown
            size={34}
            strokeWidth={1.8}
            className={`shrink-0 fill-current opacity-80 ${theme.crown}`}
          />
        </div>

        {/* Settlement Amount */}
        <div className="flex justify-between items-center px-0.5 mt-1">
          <p className="text-sm font-medium text-sc-ink-900">Payout Amount</p>
          <p className={`text-lg font-bold ${theme.amount}`}>
            {formatCurrency(currency, amount)}
          </p>
        </div>

        {/* Button */}
        <button
          className={`w-full mt-auto text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors ${theme.button}`}
          onClick={() => navigate(`/adminPanel/ManagerGroups/${groupId}`)}
        >
          View Rounds
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const GroupSkeleton = () => (
  <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-[52px] h-[52px] bg-slate-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-3 w-48 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="space-y-2.5">
      <div className="h-6 w-24 bg-slate-200 rounded-full ml-[68px]" />
      <div className="h-14 bg-slate-200 rounded-xl" />
      <div className="h-14 bg-slate-200 rounded-xl" />
      <div className="h-[68px] bg-slate-200 rounded-xl" />
      <div className="flex justify-between">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </div>
      <div className="h-12 bg-slate-300 rounded-xl" />
    </div>
  </div>
);

/* ---------------- HERO ILLUSTRATION (decorative) ---------------- */
const TeamIllustration = () => (
  <svg
    viewBox="0 0 360 150"
    className="hidden lg:block absolute right-0 bottom-0 h-full w-auto pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="fmg-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4c86ff" />
        <stop offset="1" stopColor="#1e4fe5" />
      </linearGradient>
      <linearGradient id="fmg-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffd24d" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="fmg-purple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="fmg-podium" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#0b1a5c" />
      </linearGradient>
    </defs>
    {/* confetti */}
    <rect x="40" y="30" width="5" height="22" rx="2.5" fill="#8b5cf6" transform="rotate(-40 42 41)" />
    <rect x="60" y="80" width="5" height="18" rx="2.5" fill="#fbbf24" transform="rotate(30 62 89)" />
    <rect x="335" y="80" width="4" height="14" rx="2" fill="#fbbf24" transform="rotate(40 337 87)" />
    <circle cx="90" cy="120" r="2.5" fill="#1e4fe5" />
    <circle cx="330" cy="125" r="2" fill="#93c5fd" />
    {/* podium */}
    <ellipse cx="210" cy="112" rx="120" ry="16" fill="#2b4bb8" />
    <rect x="90" y="112" width="240" height="40" fill="url(#fmg-podium)" />
    {/* people */}
    {[
      { cx: 145, fill: "url(#fmg-blue)", y: 0 },
      { cx: 210, fill: "url(#fmg-gold)", y: -6 },
      { cx: 275, fill: "url(#fmg-purple)", y: 0 },
    ].map((p) => (
      <g key={p.cx} transform={`translate(0 ${p.y})`}>
        <circle cx={p.cx} cy="44" r="19" fill={p.fill} />
        <path
          d={`M${p.cx - 32} 112 v-26 a32 26 0 0 1 64 0 v26 z`}
          fill={p.fill}
        />
      </g>
    ))}
    {/* growth arrow */}
    <path d="M300 48 L336 14" stroke="#1e4fe5" strokeWidth="6" strokeLinecap="round" />
    <path d="M318 12 L340 10 L338 32 Z" fill="#1e4fe5" />
  </svg>
);

/* ---------------- PAGE ---------------- */

export default function FundManagerGroups() {
  const { managerId } = useParams();
  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [managerInfo, setManagerInfo] = useState(null);
  const [fundManagerGroups, setFundManagerGroups] = useState([]);

  const paginatedGroups = fundManagerGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const fetchFundManagerGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFundManagerByID(managerId);
      const managerData = response.data.data;

      setManagerInfo(managerData);
      setFundManagerGroups(managerData.data || []); // 👈 groups array
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    console.log(managerId);
    fetchFundManagerGroups();
  }, [fetchFundManagerGroups]);

  useEffect(() => {
    console.log("response", managerInfo);
  }, [managerInfo]);
  const totalPages = Math.ceil(fundManagerGroups.length / pageSize);
  const managerEmail = managerInfo?.fundManagerEmail ?? managerInfo?.emailId;
  const managerMobile =
    managerInfo?.fundManagerMobileNumber ?? managerInfo?.mobileNumber;
  const managerMembers =
    managerInfo?.totalMembers ?? managerInfo?.groupMembers;
  const isActive = (managerInfo?.totalManageGroup ?? 0) > 0;

  const HeaderStat = ({ icon, iconBg, label, value }) => (
    <div className="flex items-center gap-3 px-4 py-2.5 min-w-[150px]">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-sc-ink-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Back */}
      <button
        onClick={() => navigate("/adminPanel/FundManager")}
        className="flex items-center gap-3 text-sm font-medium text-sc-ink-900 hover:text-primary mb-4 cursor-pointer transition-colors"
      >
        <ArrowLeft size={18} className="text-primary" />
        Back to Group Admins
      </button>

      {/* Manager Header Card */}
      {managerInfo && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sc-blue-100 via-blue-50 to-indigo-100 border border-blue-100 shadow-sm mb-5">
          <TeamIllustration />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-4 lg:pr-[380px]">
            <div className="relative shrink-0 self-start sm:self-center">
              {managerInfo.fundManagerProfileImage ? (
                <img
                  src={managerInfo.fundManagerProfileImage}
                  alt={managerInfo.fundManagerName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary text-white text-2xl font-semibold flex items-center justify-center ring-4 ring-white shadow-md">
                  {getInitials(managerInfo.fundManagerName)}
                </div>
              )}
              {isActive && (
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-sc-ink-900">
                Groups Managed by {managerInfo.fundManagerName}
              </h1>

              {(managerEmail || managerMobile) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-sc-ink-900">
                  {managerEmail && (
                    <span className="flex items-center gap-2">
                      <Mail size={15} className="text-primary" />
                      {managerEmail}
                    </span>
                  )}
                  {managerEmail && managerMobile && (
                    <span className="hidden sm:inline text-slate-300">|</span>
                  )}
                  {managerMobile && (
                    <span className="flex items-center gap-2 font-semibold">
                      <Phone size={15} className="text-primary" />
                      {managerMobile}
                    </span>
                  )}
                </div>
              )}

              <div className="inline-flex flex-wrap items-center mt-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white">
                <HeaderStat
                  label="Total Earnings"
                  value={managerInfo.totalEarnings}
                  iconBg="bg-amber-50"
                  icon={<Coins size={20} className="text-sc-gold-600" />}
                />
                <HeaderStat
                  label="Total Groups"
                  value={managerInfo.totalManageGroup}
                  iconBg="bg-sc-blue-100"
                  icon={<Users size={20} className="text-primary" />}
                />
                {managerMembers !== undefined && (
                  <HeaderStat
                    label="Total Members"
                    value={managerMembers}
                    iconBg="bg-sc-blue-100"
                    icon={<User size={20} className="text-primary" />}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* LOADING */}
        {loading &&
          Array.from({ length: pageSize }).map((_, index) => (
            <GroupSkeleton key={index} />
          ))}

        {/* EMPTY */}
        {!loading && fundManagerGroups.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              message="No Groups Found"
              subtitle="This Group Admin has not created any groups yet."
            />
          </div>
        )}

        {/* DATA */}
        {!loading &&
          paginatedGroups.map((group) => (
            <GroupCard
              key={group.groupId}
              title={group.groupName}
              description={group.groupDescription ?? group.description}
              currency={group.currency}
              date={
                group.upcomingRoundDate
                  ? new Date(group.upcomingRoundDate).toLocaleDateString()
                  : "Not Scheduled"
              }
              status={
                group.upcomingRoundStatus ??
                (group.upcomingRoundDate ? "Scheduled" : null)
              }
              groupType={group.groupType}
              earned={group.managerEarningAmount}
              winner={group.previousRoundWinnerName}
              winnerImage={group.previousRoundWinnerImage}
              amount={group.previousRoundSettlementAmount}
              groupId={group.groupId}
            />
          ))}
      </div>

      {/* Pagination */}
      {!loading && fundManagerGroups.length > pageSize && (
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
