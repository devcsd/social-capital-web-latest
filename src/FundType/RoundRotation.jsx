import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { getTransactionByRoundID } from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuTrophy,
  LuCircleCheck,
  LuWallet,
  LuLayers,
  LuShieldCheck,
  LuUsers,
  LuRadio,
  LuDatabase,
  LuGift,
  LuChartColumn,
  LuCheck,
  LuClock3,
  LuLoaderCircle,
  LuFileText,
  LuInbox,
  LuCalendarDays,
} from "react-icons/lu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const currencyOptions = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "AUD", symbol: "A$" },
  { code: "CNY", symbol: "¥" },
  { code: "GBP", symbol: "£" },
];
const getCurrencySymbol = (currencyCode) => {
  const currency = currencyOptions.find(
    (item) => item.code === currencyCode
  );

  return currency?.symbol || currencyCode;
};

export default function RoundRotation() {
  const [transactionData, setTransactionData] = useState(null);

  const { roundID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await getTransactionByRoundID(roundID);

        setTransactionData(response.data.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, [roundID]);

  const currencySymbol = getCurrencySymbol(transactionData?.currency);

  /* ---------------- Skeleton Loader ---------------- */

  if (!transactionData) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="h-8 w-52 bg-gray-200 rounded mb-4" />

        <div className="h-4 w-32 bg-gray-200 rounded mb-8" />

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-gray-200 rounded mb-3" />

                <div className="h-6 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-6 lg:col-span-2">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3" />

                  <div className="h-6 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            <div className="h-[320px] bg-gray-100 rounded-2xl" />
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-5">
                  <div className="h-4 bg-gray-200 rounded mb-3" />

                  <div className="h-6 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Dynamic Data ---------------- */

  const {
    roundNumber,
    roundStatus,
    winnerName,
    settlementAmount,
    totalFundValue,
    dividendAmount,
    maximumBidAmount,
    minimumBidAmount,
    biddingHistory,
    transactionDetails,
    totalMember,
    completeContribution,
    pendingContribution,
    timeLine,
    currency,
  } = transactionData;

  /* ---------------- Chart Data ---------------- */

  const chartData = biddingHistory?.map((item, index) => ({
    bid: item.bidAmount,
    user: item.userName,
    time: new Date(item.bidAskAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    index: index + 1,
  }));

  /* ---------------- Display helpers ---------------- */

  const isCompleted = roundStatus === "completed";
  const isLive = roundStatus === "live";
  const money = (v) =>
    `${currencySymbol} ${Number(v ?? 0).toLocaleString(
      currency === "INR" ? "en-IN" : "en-US",
    )}`;
  const fmtDate = (v) => {
    const d = new Date(v);
    return v && !isNaN(d) && d.getTime() > 0 ? d.toLocaleString() : "—";
  };
  const winnerImage = transactionDetails?.find(
    (t) => t.userName === winnerName && t.userProfileImage,
  )?.userProfileImage;
  const contributionTotal =
    (completeContribution ?? 0) + (pendingContribution ?? 0) || totalMember || 0;
  const contributionPct = contributionTotal
    ? Math.round(((completeContribution ?? 0) / contributionTotal) * 100)
    : 0;
  const memberPct = totalMember
    ? Math.min(100, Math.round(((completeContribution ?? 0) / totalMember) * 100))
    : 0;

  return (
    <div className="min-h-screen space-y-5">
      {/* Back */}
      <button
        className="flex items-center gap-2 text-[14px] font-medium text-blue-700 hover:text-blue-800 transition-colors"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft size={13} />
        Back to Group Details
      </button>
{/* <pre>{JSON.stringify(transactionData, null, 2)}</pre> */}
      {/* Header */}
      <div>
        <h1 className="text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight">
          Round {roundNumber} Overview
        </h1>

        <p className="flex items-center gap-2 text-[14px] text-slate-500 mt-1">
          Status :
          <span
            className={`h-2 w-2 rounded-full ${
              isCompleted || isLive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span
            className={`font-medium ${
              isCompleted || isLive ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {roundStatus}
          </span>
        </p>
      </div>

      {isCompleted ? (
        /* Winner Summary */
        <div className={`${cardCls} relative overflow-hidden p-5`}>
          <div className="flex items-start gap-4 mb-4">
            <span className="w-1 self-stretch rounded-full bg-indigo-600" />
            <LuTrophy className="text-indigo-700 text-[24px] mt-0.5" />
            <div>
              <h3 className="text-[17px] font-bold text-slate-900">
                Winner Summary
              </h3>
              <p className="text-[12px] text-slate-500">
                Round {roundNumber} completed successfully
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:pr-48">
            <div className="flex items-center gap-6 lg:pr-8 lg:border-r lg:border-slate-200">
              <div className="h-24 w-24 shrink-0 rounded-full bg-white shadow-md p-1.5">
                {winnerImage ? (
                  <img
                    src={winnerImage}
                    alt={winnerName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                    {getInitials(winnerName)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[13px] text-slate-500">Winner Name</p>
                <p className="text-[24px] font-bold text-slate-900 leading-tight">
                  {winnerName}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[13px] font-medium capitalize">
                  <LuCircleCheck size={15} />
                  {roundStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              <SummaryItem icon={LuWallet} label="Payout" value={money(settlementAmount)} />
              <SummaryItem icon={LuLayers} label="Group Value" value={money(totalFundValue)} />
              <SummaryItem icon={LuUsers} label="Members" value={totalMember} />
            </div>
          </div>

          <TrophyDecor />
        </div>
      ) : (
        /* Current Round Status */
        <div className={`${cardCls} p-3`}>
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/30 px-5 py-4 xl:w-[400px] shrink-0">
              <span className="h-14 w-14 shrink-0 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-emerald-100">
                <LuRadio size={24} />
              </span>
              <div>
                <p className="text-[12px] text-slate-600">Current Round Status</p>
                <p className="text-[22px] font-bold text-emerald-600 capitalize leading-tight">
                  {roundStatus}
                </p>
                <p className="text-[12px] text-slate-500">
                  {isLive
                    ? "Contributions are open for this round."
                    : "This round has not started yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-4 px-4 xl:border-r xl:border-slate-200">
              <IconBubble icon={LuUsers} tint="bg-blue-50 text-blue-600" />
              <div>
                <p className="text-[12px] text-slate-600">Members</p>
                <p className="text-[20px] font-bold text-slate-900 tabular-nums">
                  {totalMember}
                </p>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${memberPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {completeContribution ?? 0} / {totalMember} contributed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 px-4 pb-2 xl:pb-0">
              <SummaryItem icon={LuWallet} tint="bg-rose-50 text-rose-500" label="Payout" value={money(settlementAmount)} small />
              <SummaryItem icon={LuDatabase} label="Group Value" value={money(totalFundValue)} small />
              <SummaryItem icon={LuGift} tint="bg-indigo-50 text-indigo-600" label="Bonus" value={money(dividendAmount)} small />
            </div>
          </div>
        </div>
      )}

      {/* Rotation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Rotation Info */}
          <div className={`${cardCls} p-5`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <CardTitle
                icon={LuChartColumn}
                title="Rotation Summary"
                subtitle={
                  isCompleted
                    ? "Overview of this rotation round"
                    : "Real-time overview of this rotation round."
                }
              />
              {isCompleted && (
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[12px] font-medium">
                  Round {roundNumber}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={LuUsers} label="Total Members" value={totalMember} bg="bg-slate-50" tint="bg-blue-100 text-blue-600" />

              <Stat
                icon={LuCheck}
                label="Completed"
                value={completeContribution}
                bg="bg-emerald-50/60"
                tint="bg-emerald-100 text-emerald-600"
              />

              <Stat
                icon={LuClock3}
                label="Pending"
                value={pendingContribution}
                bg="bg-amber-50/60"
                tint="bg-amber-100 text-amber-500"
              />

              <Stat
                icon={LuDatabase}
                label="Group Value"
                value={money(totalFundValue)}
                bg="bg-violet-50/60"
                tint="bg-violet-100 text-violet-600"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className={`${cardCls} relative overflow-hidden p-5`}>
            <CardTitle
              icon={LuClock3}
              title="Transaction Timeline"
              subtitle={
                isCompleted
                  ? "Key events in this rotation round"
                  : "Live updates for this round."
              }
            />

            <div className="relative mt-4 ml-3 pl-8">
              <span className="absolute left-[5px] top-3 bottom-8 border-l-2 border-dashed border-slate-200" />

              <div className="relative pb-5">
                <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <p className="text-[14px] font-semibold text-slate-900">
                  Transaction Started
                </p>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {fmtDate(timeLine?.transactionStartDate)}
                </p>
              </div>

              <div className="relative">
                <span
                  className={`absolute -left-8 top-1 h-3 w-3 rounded-full ring-4 ${
                    isCompleted
                      ? "bg-indigo-600 ring-indigo-100"
                      : "bg-slate-400 ring-slate-100"
                  }`}
                />
                <p className="text-[14px] font-semibold text-slate-900">
                  {isCompleted ? "Transaction Completed" : "Waiting for Contributions"}
                </p>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {isCompleted
                    ? fmtDate(timeLine?.transactionEndDate)
                    : "Members can now make contributions."}
                </p>
              </div>
            </div>

            <CalendarDecor live={!isCompleted} />
          </div>
        </div>

        {/* Contribution Card */}
        <div className={`${cardCls} p-5 flex flex-col`}>
          <div className="flex items-start justify-between gap-3">
            <CardTitle
              icon={LuLoaderCircle}
              title="Contribution Status"
              subtitle="Member contribution progress"
            />
            {isLive && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[12px] font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live
              </span>
            )}
          </div>

          <div className="flex flex-1 justify-center items-center py-6">
            <ProgressRing pct={contributionPct}>
              <p className="text-[32px] font-extrabold text-slate-900 leading-none tabular-nums">
                {completeContribution}
              </p>
              <p className="text-[13px] text-slate-600 mt-1.5">Completed</p>
              {!isCompleted && (
                <p className="text-[14px] font-bold text-emerald-600 mt-0.5">
                  {contributionPct}%
                </p>
              )}
            </ProgressRing>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/70 rounded-xl p-4">
              <p className="flex items-center gap-2 text-[11px] font-medium text-emerald-700">
                <LuCircleCheck className="text-emerald-600 text-[16px] shrink-0" />
                Completed Contributions
              </p>
              <p className="text-[22px] font-bold text-emerald-800 mt-1 pl-6 tabular-nums">
                {completeContribution}
              </p>
            </div>

            <div className="bg-amber-50/70 rounded-xl p-4">
              <p className="flex items-center gap-2 text-[11px] font-medium text-amber-700">
                <LuClock3 className="text-amber-500 text-[16px] shrink-0" />
                Pending Contributions
              </p>
              <p className="text-[22px] font-bold text-amber-800 mt-1 pl-6 tabular-nums">
                {pendingContribution}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className={`${cardCls} p-5`}>
        <div className="mb-4">
          <CardTitle
            icon={LuFileText}
            title="Transaction Details"
            subtitle="All member contributions for this round."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide rounded-l-xl">
                  Member
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Amount
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide rounded-r-xl">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {transactionDetails?.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    index % 2 === 1 ? "bg-slate-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {item.userProfileImage ? (
                        <img
                          src={item.userProfileImage}
                          alt={item.userName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {item.userName?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="text-[14px] font-medium text-slate-800">
                          {item.userName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-[14px] font-medium text-slate-800 tabular-nums">
                    {currencySymbol} {item.memberContributeAmount ?? 0}
                  </td>

                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium ${
                        item.status === "Received"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.status === "Received" ? (
                        <LuCircleCheck className="text-emerald-600" size={14} />
                      ) : item.status === "Pending" ? (
                        <LuClock3 size={14} />
                      ) : null}
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-[13px] text-slate-500 tabular-nums">
                    {new Date(item.transactionDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!transactionDetails?.length && (
            <div className="py-10 text-center">
              <LuInbox className="mx-auto text-slate-300 text-[36px]" />
              <p className="mt-2 text-[14px] font-medium text-slate-600">
                No transactions yet
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Transaction details will appear here once members make
                contributions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

const cardCls =
  "bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const IconBubble = ({ icon: Icon, tint = "bg-slate-100 text-indigo-700", size = "h-11 w-11" }) => (
  <span className={`${size} shrink-0 rounded-xl flex items-center justify-center ${tint}`}>
    <Icon size={20} />
  </span>
);

const CardTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <IconBubble icon={Icon} tint="bg-indigo-50 text-indigo-700" size="h-10 w-10" />
    <div>
      <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
      <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const SummaryItem = ({ icon, tint, label, value, small = false }) => (
  <div className="flex items-start gap-3">
    <IconBubble icon={icon} tint={tint ?? "bg-blue-50 text-indigo-700"} />
    <div>
      <p className={`${small ? "text-[12px]" : "text-[14px]"} text-slate-500`}>{label}</p>

      <p
        className={`${
          small ? "text-[16px]" : "text-[20px]"
        } font-bold text-slate-900 leading-tight tabular-nums whitespace-nowrap`}
      >
        {value}
      </p>
    </div>
  </div>
);

const Stat = ({ icon, label, value, bg, tint }) => (
  <div className={`${bg} rounded-xl p-3.5 flex items-center gap-3`}>
    <IconBubble icon={icon} tint={tint} />
    <div className="min-w-0">
      <p className="text-[12px] text-slate-600">{label}</p>

      <p className="font-bold text-[18px] text-slate-900 tabular-nums truncate">
        {value}
      </p>
    </div>
  </div>
);

const ProgressRing = ({ pct, children }) => {
  const r = 66;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-40 w-40">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#eef2f7" strokeWidth="12" />
        {pct > 0 && (
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * c} ${c}`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Decorative trophy + confetti for the winner card
const TrophyDecor = () => (
  <div
    className="pointer-events-none absolute right-0 top-0 bottom-0 hidden lg:block w-56 bg-gradient-to-bl from-indigo-50/80 via-white to-transparent"
    aria-hidden="true"
  >
    <span className="absolute left-12 top-10 h-2 w-3 rotate-45 rounded-sm bg-rose-400" />
    <span className="absolute right-10 top-6 h-2 w-2 rounded-full bg-violet-400" />
    <span className="absolute right-16 top-14 h-2 w-2 rotate-12 bg-emerald-400" />
    <span className="absolute left-10 bottom-14 h-2 w-2 rotate-45 bg-amber-400" />
    <span className="absolute right-6 bottom-16 h-2 w-2 rotate-45 bg-sky-400" />
    <span className="absolute left-16 bottom-8 h-1.5 w-3 -rotate-12 rounded-sm bg-emerald-300" />
    <LuTrophy className="absolute right-14 top-1/2 -translate-y-1/2 text-amber-400 text-[96px] drop-shadow-lg" />
  </div>
);

// Decorative calendar for the timeline card
const CalendarDecor = ({ live }) => (
  <div
    className="pointer-events-none absolute right-5 top-5 bottom-5 hidden md:flex w-60 items-center justify-center rounded-2xl bg-gradient-to-bl from-indigo-50 via-slate-50/60 to-transparent"
    aria-hidden="true"
  >
    <div className="relative">
      <LuCalendarDays className="text-indigo-300 text-[72px]" />
      {live && (
        <span className="absolute -right-2 -bottom-2 h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
          <LuClock3 size={18} />
        </span>
      )}
    </div>
  </div>
);

const Button = ({ label }) => (
  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-5 py-3 rounded-xl text-sm font-medium">
    <FaDownload />
    {label}
  </button>
);
