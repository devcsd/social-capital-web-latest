import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuArrowRight,
  LuArrowLeftRight,
  LuClock2,
  LuCalendarDays,
  LuLayers,
  LuRefreshCw,
  LuHourglass,
  LuCircleCheck,
  LuUserRound,
} from "react-icons/lu";
import { CiCreditCard1 } from "react-icons/ci";
import { MdGavel } from "react-icons/md";
import { currencyMeta } from "../utils/currencyMeta";
import { getInitials } from "../utils/getInitials";
import ReactCountryFlag from "react-country-flag";
import {
  GiTakeMyMoney,
  GiPayMoney,
  GiReceiveMoney,
  GiTrophyCup,
  GiMoneyStack,
} from "react-icons/gi";
import { IoPeopleSharp } from "react-icons/io5";
import { getGroupByID } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTimeByCurrency } from "../utils/formatDate";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-lg" />
    <div className="space-y-2 w-full">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-32" />
    </div>
  </div>
);

const GroupHeaderSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100 space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-indigo-50 rounded-xl p-5 flex justify-between items-center"
        >
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const RoundCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>

    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-3"
        >
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>

    <Skeleton className="h-12 rounded-xl" />
  </div>
);

export default function AuctionGroupDetails() {
  const { groupID } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [groupType, setGroupType] = useState("");
  const [currencyLabel, setCurrencyLabel] = useState("");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getGroupByID(groupID);
        const Data = response.data.data;
        setGroup(Data);
        setRounds(Data.rounds || []);
      } catch (error) {
        console.error("Error fetching group details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, []);

  useEffect(() => {
    console.log("Group Data:", group);
    setGroupType(group?.groupType || "");
    setCurrencyLabel(group?.currencyLabel || "USD");
    console.log("Group Type:", groupType);
    console.log("Rounds Data:", rounds);
  }, [group]);

  const joined = group?.joinedMember || 0;
  const capacity = group?.totalMember || 0;
  const fillPct = capacity ? Math.min(100, Math.round((joined / capacity) * 100)) : 0;

  return (
    <div className=" mx-auto space-y-5">
      {/* Back */}
      <button
        className="flex items-center gap-2 text-[15px] text-blue-700 font-medium hover:text-blue-800 transition-colors"
        onClick={() =>
          navigate(
            `/adminPanel/${groupType == "Auction" ? "Auction" : "Rotation"}`,
          )
        }
      >
        <LuArrowLeft size={18} />
        Back to {groupType} Overview
      </button>

      {loading ? (
        <div className="space-y-6">
          <GroupHeaderSkeleton />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RoundCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* <pre>Grousps : {JSON.stringify(group, null, 2)}</pre> */}
          {/* <pre>Rounds : {JSON.stringify(group.rounds, null, 2)}</pre> */}
          {/* <pre>{groupID}</pre> */}
          {/* Group Header */}
          <div className={`${cardCls} p-5`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Fund Manager Image */}
                {group?.admin?.profileImage ? (
                  <img
                    src={group.admin.profileImage}
                    alt="Group Admin"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow"
                  />
                ) : (
                  <div className="w-14 h-14 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-semibold ring-2 ring-white shadow">
                    {getInitials(
                      `${group?.admin?.firstName ?? ""} ${group?.admin?.lastName ?? ""}`,
                    ) || "FM"}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight truncate">
                    {group?.groupName}
                  </h3>
                  <p className="text-[14px] text-slate-500 mt-0.5">
                    Managed by{" "}
                    {group?.admin
                      ? `${group.admin.firstName || ""} ${group.admin.lastName || ""}`.trim()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Currency + Status */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Active Badge */}
                <span
                  className={`px-4 py-1.5 text-[13px] font-semibold rounded-full ${
                    group?.groupData?.is_active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {group?.groupData?.is_active ? "Active" : "Inactive"}
                </span>

                {/* Country Flag */}
                <ReactCountryFlag
                  svg
                  countryCode={currencyMeta?.[currencyLabel]?.flag || "US"}
                  style={{ width: "36px", height: "24px", borderRadius: "3px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              {/* Total Rounds */}
              <div className="relative overflow-hidden flex items-center gap-4 bg-slate-50/80 ring-1 ring-slate-100 rounded-2xl p-5">
                <IconTile Icon={LuLayers} tint="bg-violet-100 text-violet-600" />
                <div className="flex-1">
                  <p className="text-[13px] text-slate-600">Total Rounds</p>
                  <p className="text-[24px] font-bold text-slate-900 leading-tight tabular-nums">
                    {group?.rounds?.length || 0}
                  </p>
                </div>
                <LuClock2 className="absolute right-5 top-5 text-violet-500 text-[26px]" />
                <Wave color="#a78bfa" className="absolute right-0 bottom-0 h-12 w-40" />
              </div>

              {/* Members */}
              <div className="flex items-center gap-4 bg-slate-50/80 ring-1 ring-slate-100 rounded-2xl p-5">
                <IconTile Icon={IoPeopleSharp} tint="bg-rose-100 text-rose-500" />
                <div className="shrink-0">
                  <p className="text-[13px] text-slate-600">Members</p>
                  <p className="text-[24px] font-bold text-slate-900 leading-tight tabular-nums">
                    {group?.joinedMember || 0} / {group?.totalMember || 0}
                  </p>
                </div>
                <div className="flex-1 min-w-0 pt-4">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <p className="text-[12px] text-slate-500 mt-2">
                    {capacity && joined >= capacity
                      ? "Group is full"
                      : `${Math.max(capacity - joined, 0)} spots left`}
                  </p>
                </div>
              </div>

              {/*Transcation */}
              <div className="flex items-center gap-4 bg-slate-50/80 ring-1 ring-slate-100 rounded-2xl p-5">
                <IconTile Icon={LuArrowLeftRight} tint="bg-emerald-100 text-emerald-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-600">Transaction Type</p>
                  <p className="text-[16px] font-bold text-blue-700 leading-snug">
                    {group?.transactionType || "—"}
                  </p>
                </div>
                <CiCreditCard1 className="self-start shrink-0 text-blue-700 text-[28px]" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Group Value"
              value={formatCurrency(group?.currencyLabel, group?.totalFund)}
              Icon={GiTakeMyMoney}
              tint="bg-blue-100 text-blue-600"
              bg="from-white to-blue-50/70"
              color="#3b82f6"
            />

            <StatCard
              title="Total Admin Fee"
              value={formatCurrency(
                group?.currencyLabel,
                group?.totalCommission,
              )}
              Icon={GiReceiveMoney}
              tint="bg-amber-100 text-amber-500"
              bg="from-white to-amber-50/70"
              color="#fbbf24"
            />

            <StatCard
              title="Member Contributions"
              value={formatCurrency(
                group?.currencyLabel,
                group?.groupData?.initial_member_contribution,
              )}
              Icon={GiPayMoney}
              tint="bg-violet-100 text-violet-600"
              bg="from-white to-fuchsia-50/70"
              color="#e879f9"
            />
          </div>

          {/* Rounds */}
          <div>
            <div className="flex items-start gap-3 mb-4 mt-2">
              {groupType === "Auction" ? (
                <MdGavel className="text-blue-700 text-[28px] mt-0.5" />
              ) : (
                <LuRefreshCw className="text-blue-600 text-[26px] mt-0.5" />
              )}
              <div>
                <h2 className="text-[19px] font-bold text-slate-900 tracking-tight">
                  {groupType || "Rotation"} Rounds
                </h2>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  View all rounds and winners for this group.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...rounds]
                .sort((a, b) => {
                  const roundA = Number(a.round.split("_")[1]);
                  const roundB = Number(b.round.split("_")[1]);

                  return roundA - roundB;
                })
                .map((r, index) => {
                  const completed = r.status === "completed";
                  const accent = roundAccents[index % roundAccents.length];
                  return (
                    <div
                      key={r.round}
                      className={`group rounded-2xl p-4 space-y-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                        completed
                          ? `${cardCls}`
                          : "bg-white border-2 border-dashed border-violet-300 shadow-sm"
                      }`}
                      onClick={() => {
                        window.location.href = `/adminPanel/${group.groupType}Round/${r.id}`;
                      }}
                    >
                      {/* <p>{`/adminPanel/${group.groupType}Round/${r.id}`}</p> */}
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                              completed ? accent.badge : "bg-violet-100 text-violet-600"
                            }`}
                          >
                            {completed ? (
                              <GiTrophyCup size={18} />
                            ) : (
                              <LuHourglass size={18} />
                            )}
                          </span>
                          <h3 className="text-[16px] font-bold text-slate-900">
                            Round {index + 1}
                          </h3>
                        </div>

                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-full font-semibold capitalize ${
                            completed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {completed ? (
                            <LuCircleCheck size={13} className="text-emerald-600" />
                          ) : (
                            <LuClock2 size={13} />
                          )}
                          {r.status}
                        </span>
                      </div>

                      {/* Winner */}
                      <div className="relative overflow-hidden flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                        {completed && r.winnerName ? (
                          <span className="h-10 w-10 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                            {getInitials(r.winnerName)}
                          </span>
                        ) : (
                          <span className="h-10 w-10 shrink-0 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                            <LuUserRound size={18} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-[12px] text-slate-500">Winner</p>
                          <p className="text-[14px] font-semibold text-slate-900 truncate">
                            {r.winnerName
                              ? r.winnerName
                              : completed
                                ? "-"
                                : "Not decided yet"}
                          </p>
                        </div>
                        {completed ? (
                          <WinnerDecor />
                        ) : (
                          <LuHourglass className="ml-auto shrink-0 text-violet-200 text-[34px]" />
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-3 px-3">
                        <LuCalendarDays className="text-blue-800 text-[22px] shrink-0" />
                        <div>
                          <p className="text-[12px] text-slate-500">Date</p>
                          <p className="text-[14px] font-medium text-slate-800">
                            {!completed && !r.roundCompletedDate
                              ? "Upcoming"
                              : formatDateTimeByCurrency(
                                  r.roundCompletedDate,
                                  r.currencyLabel,
                                )}
                          </p>
                        </div>
                      </div>

                      {groupType === "Auction" &&
                        r.maximumBidAmount &&
                        r.payoutAmount && (
                          <div className="flex items-center gap-3 px-3">
                            <MdGavel className="text-blue-800 text-[22px] shrink-0" />
                            <div>
                              <p className="text-[12px] text-slate-500">Winning Bid</p>
                              <p className="text-[14px] font-medium text-slate-800">
                                {formatCurrency(r.currencyLabel, r.payoutAmount)}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* Settlement */}
                      <div
                        className={`rounded-xl px-4 py-3 flex items-center justify-between ${
                          completed ? accent.payout : "bg-violet-50"
                        }`}
                      >
                        <span
                          className={`text-[13px] font-medium ${
                            completed ? "text-slate-800" : "text-violet-700"
                          }`}
                        >
                          {completed ? "Payout Amount" : "Expected Payout"}
                        </span>

                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center gap-2 text-[17px] font-bold tabular-nums ${
                              completed ? "text-slate-900" : "text-violet-700"
                            }`}
                          >
                            <GiMoneyStack
                              size={20}
                              className={completed ? accent.money : "text-violet-500"}
                            />
                            {formatCurrency(r.currencyLabel, r.payoutAmount)}
                          </div>
                          {completed && (
                            <span
                              className={`h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center ${accent.arrow}`}
                            >
                              <LuArrowRight size={16} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

const cardCls =
  "bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]";

const roundAccents = [
  {
    badge: "bg-amber-50 text-amber-500",
    payout: "bg-amber-50",
    money: "text-amber-500",
    arrow: "text-amber-500",
  },
  {
    badge: "bg-slate-100 text-slate-400",
    payout: "bg-blue-50",
    money: "text-blue-600",
    arrow: "text-blue-700",
  },
  {
    badge: "bg-orange-50 text-orange-500",
    payout: "bg-emerald-50",
    money: "text-emerald-600",
    arrow: "text-blue-700",
  },
  {
    badge: "bg-violet-50 text-violet-600",
    payout: "bg-violet-50",
    money: "text-violet-600",
    arrow: "text-violet-700",
  },
];

const IconTile = ({ Icon, tint }) => (
  <div
    className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${tint}`}
  >
    <Icon size={24} />
  </div>
);

// Decorative wave used on the summary cards
const Wave = ({ color, className = "" }) => (
  <svg
    viewBox="0 0 160 48"
    preserveAspectRatio="none"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`rw-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 44 C 20 40, 34 26, 52 28 S 80 40, 98 30 S 128 14, 160 6 L160 48 L0 48 Z"
      fill={`url(#rw-${color.slice(1)})`}
    />
    <path
      d="M0 44 C 20 40, 34 26, 52 28 S 80 40, 98 30 S 128 14, 160 6"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// Trophy with confetti for completed rounds
const WinnerDecor = () => (
  <div className="relative ml-auto h-10 w-20 shrink-0" aria-hidden="true">
    <span className="absolute left-1 top-1 h-1.5 w-1.5 rotate-45 bg-rose-400" />
    <span className="absolute left-5 top-0 h-1.5 w-1.5 rotate-12 bg-amber-400" />
    <span className="absolute left-0 bottom-2 h-1.5 w-1.5 rotate-45 bg-emerald-400" />
    <span className="absolute left-4 bottom-0 h-1.5 w-1.5 rotate-45 bg-violet-400" />
    <span className="absolute right-0 top-0 h-1.5 w-1.5 rotate-45 bg-sky-400" />
    <span className="absolute right-1 bottom-1 h-1.5 w-1.5 rotate-45 bg-blue-400" />
    <GiTrophyCup className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 text-[30px]" />
  </div>
);

const StatCard = ({ title, value, Icon, tint, bg, color }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm bg-gradient-to-br ${bg} flex items-center gap-4`}
  >
    <IconTile Icon={Icon} tint={tint} />
    <div className="relative z-10">
      <p className="text-[13px] text-slate-600">{title}</p>
      <p className="text-[24px] font-bold text-slate-900 leading-tight tabular-nums">
        {value}
      </p>
    </div>
    <Wave color={color} className="absolute right-0 bottom-3 h-12 w-40" />
  </div>
);
