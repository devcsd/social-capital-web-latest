import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coins,
  Gavel,
  Layers,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { currencyMeta } from "../utils/currencyMeta";
import ReactCountryFlag from "react-country-flag";
import EmptyState from "../AdminComponent/EmptyState";
import { getGroupByID } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitials } from "../utils/getInitials";
import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

/* ---------------- GROUP CARD ---------------- */

/* decorative laurel + trophy */
const LaurelTrophy = ({ muted }) => (
  <div className="relative w-16 h-14 shrink-0 flex items-center justify-center">
    <svg
      viewBox="0 0 64 56"
      className={`absolute inset-0 w-full h-full ${muted ? "text-slate-300" : "text-green-400/80"}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <ellipse cx={10 + i * 1.2} cy={44 - i * 8} rx="3" ry="6" transform={`rotate(${-35 + i * 12} ${10 + i * 1.2} ${44 - i * 8})`} />
          <ellipse cx={54 - i * 1.2} cy={44 - i * 8} rx="3" ry="6" transform={`rotate(${35 - i * 12} ${54 - i * 1.2} ${44 - i * 8})`} />
        </g>
      ))}
    </svg>
    <Trophy
      size={26}
      strokeWidth={2}
      className={`relative ${muted ? "text-slate-400" : "text-amber-500 fill-amber-400"}`}
    />
  </div>
);

const RoundCard = ({ round, index }) => {
  const isCompleted = round.status === "completed";
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer flex flex-col gap-2"
      onClick={() => navigate(`/adminPanel/GroupsRound/${round.id}`)}
    >
      {/* Round Header */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-bold text-sc-ink-900">Round {index + 1}</h3>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isCompleted
              ? "bg-green-50 text-green-700"
              : "bg-sc-blue-100 text-primary"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={15} className="fill-green-600 text-white" />
          ) : (
            <Clock size={14} />
          )}
          {isCompleted ? "Completed" : "Upcoming"}
        </span>
      </div>

      {/* Date */}
      <div className="rounded-xl bg-sc-blue-100/70 px-3 py-2.5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
          <CalendarDays size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Group Date</p>
          <p className="text-sm font-bold text-sc-ink-900">
            {round.date
              ? new Date(round.date).toLocaleDateString()
              : "Not Scheduled"}
          </p>
        </div>
      </div>

      {/* Winner */}
      <div
        className={`rounded-xl px-3 py-2.5 flex items-center gap-4 ${
          isCompleted
            ? "bg-gradient-to-r from-green-50 to-emerald-100/80"
            : "bg-slate-50"
        }`}
      >
        {isCompleted ? (
          round?.winnerImage ? (
            <img
              src={round.winnerImage}
              alt="Winner"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-600 ring-2 ring-white flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              {round?.profileName || "W"}
            </div>
          )
        ) : (
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
            <Trophy size={24} className="text-slate-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-600">
            {isCompleted ? "Round Winner" : "Winner Status"}
          </p>
          <h3
            className={`font-bold truncate mt-0.5 ${
              isCompleted ? "text-base text-sc-ink-900" : "text-sm text-slate-500"
            }`}
          >
            {isCompleted && round?.winnerName
              ? round.winnerName
              : "This round is not completed "}
          </h3>
        </div>

        <LaurelTrophy muted={!isCompleted} />
      </div>

      {/* Settlement */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/80 px-3 py-2.5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
          <Coins size={20} className="text-sc-gold-600" />
        </div>
        <div>
          <p className="text-xs text-slate-600">Payout Amount</p>
          <p className="text-xl font-bold text-sc-ink-900 leading-tight">
            {formatCurrency(round.currencyLabel, round.payoutAmount)}
          </p>
        </div>
      </div>

      <button className="w-full mt-1 bg-primary hover:bg-sc-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
        View Details
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

const GroupHeaderSkeleton = () => (
  <div className="mb-5 animate-pulse">
    <div className="h-9 w-1/3 bg-slate-200 rounded mb-2" />
    <div className="h-4 w-1/4 bg-slate-200 rounded mb-5" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[84px] rounded-2xl bg-slate-200" />
      ))}
    </div>
  </div>
);

const RoundCardSkeleton = () => (
  <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm animate-pulse space-y-2">
    <div className="flex justify-between mb-2">
      <div className="h-6 w-24 bg-slate-200 rounded" />
      <div className="h-6 w-24 bg-slate-200 rounded-full" />
    </div>
    <div className="h-14 bg-slate-200 rounded-xl" />
    <div className="h-[72px] bg-slate-200 rounded-xl" />
    <div className="h-16 bg-slate-200 rounded-xl" />
    <div className="h-10 bg-slate-300 rounded-xl" />
  </div>
);

/* summary stat tile */
const StatTile = ({ bg, iconBg, icon, label, value }) => (
  <div className={`rounded-2xl px-5 py-4 flex items-center gap-5 ${bg}`}>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-bold text-sc-ink-900 leading-tight mt-0.5 truncate">
        {value}
      </p>
    </div>
  </div>
);

/* ---------------- PAGE ---------------- */

export default function FundManagerGroupRound() {
  const canGoBackRef = useRef(false);
  const { groupID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [managerId, setManagerID] = useState("");
  const [rounds, SetRounds] = useState([]);
  const [group, setGroup] = useState(null);
  const [chartData, setChartData] = useState([]);

  const chartJsData = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Payout Amount",
        data: chartData.map((item) => item.payout),
        borderColor: "#1e4fe5",
        backgroundColor: "rgba(30, 79, 229, 0.10)",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#1e4fe5",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#eef2f7" },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 12 } },
      },
      y: {
        grid: { color: "#eef2f7" },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 12 },
          callback: (value) => `${value.toLocaleString()}`,
        },
      },
    },
  };

  const fetchFundManagerGroupsRound = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupByID(groupID);
      const Data = response.data.data;
      setGroup(Data);
      SetRounds(Data.rounds || []);
      setManagerID(group.groupData.fund_manager_id);
    } catch (error) {
      console.error("Error fetching group:", error);
    } finally {
      setLoading(false);
    }
  }, [groupID]);

  useEffect(() => {
    console.log(groupID);
    fetchFundManagerGroupsRound();
  }, [fetchFundManagerGroupsRound]);

  useEffect(() => {
    if (!rounds.length) return;

    const formattedChartData = [...rounds]
      .sort((a, b) => {
        const roundA = Number(a.round.replace("round_", ""));
        const roundB = Number(b.round.replace("round_", ""));
        return roundA - roundB;
      })
      .map((r) => ({
        label: `Round ${r.round.replace("round_", "")}`,
        payout: r.payoutAmount ?? 0,
      }));

    setChartData(formattedChartData);
  }, [rounds]);

  useEffect(() => {
    console.log("====", rounds);
    console.log("group", group);
    console.log("ManagerID", managerId);
  }, [rounds]);

  useEffect(() => {
    canGoBackRef.current = window.history.state && window.history.state.idx > 0;
  }, []);

  const typeIsAuction = group?.groupType === "Auction";
  const TypeIcon = typeIsAuction ? Gavel : RefreshCw;

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Back */}
      <button
        disabled={!group}
        onClick={() =>
          navigate(`/adminPanel/FundManager/${group.groupData.fund_manager_id}`)
        }
        className="flex items-center gap-2.5 text-sm font-semibold text-sc-ink-900 hover:text-primary mb-4 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-default"
      >
        <ArrowLeft size={16} className="text-primary" />
        Back to Groups
      </button>

      {loading ? (
        <GroupHeaderSkeleton />
      ) : (
        <div className="mb-5">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-5">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-sc-ink-900 tracking-tight">
                {group?.groupName}
              </h1>
              <p className="text-base text-slate-500 mt-1">
                {group?.transactionType}
              </p>
            </div>

            {group?.groupType && (
              <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2 shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    typeIsAuction ? "bg-purple-50" : "bg-sc-blue-100"
                  }`}
                >
                  <TypeIcon
                    size={16}
                    className={typeIsAuction ? "text-purple-600" : "text-primary"}
                  />
                </div>
                <span className="text-sm font-semibold text-sc-ink-900">
                  {group.groupType}
                </span>
                {currencyMeta?.[group?.currencyLabel]?.flag && (
                  <ReactCountryFlag
                    svg
                    countryCode={currencyMeta[group.currencyLabel].flag}
                    style={{ width: "1.7em", height: "1.25em", borderRadius: 2 }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatTile
              bg="bg-sc-blue-100/80"
              iconBg="bg-white"
              icon={<Layers size={24} className="text-primary" />}
              label="Total Rounds"
              value={rounds.length}
            />
            <StatTile
              bg="bg-amber-100/70"
              iconBg="bg-white"
              icon={<Coins size={24} className="text-sc-gold-600" />}
              label="Total Group Value"
              value={formatCurrency(group?.currencyLabel, group?.totalFund)}
            />
            <StatTile
              bg="bg-green-100/60"
              iconBg="bg-white"
              icon={
                <CheckCircle2 size={28} className="fill-green-600 text-white" />
              }
              label="Completed Rounds"
              value={group?.completedRoundCount}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, index) => <RoundCardSkeleton key={index} />)
        ) : rounds.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              message="No rounds available"
              subtitle="Rounds will appear once they are created"
            />
          </div>
        ) : (
          [...rounds]
            .sort((a, b) => {
              const roundA = Number(a.round.split("_")[1]);
              const roundB = Number(b.round.split("_")[1]);

              return roundA - roundB;
            })
            .map((round, index) => (
              <RoundCard key={round.id} round={round} index={index} />
            ))
        )}
      </div>
      {console.log("Round data", rounds)}

      {loading ? (
        <div className="h-[300px] mt-5 w-full rounded-2xl bg-slate-200 animate-pulse" />
      ) : rounds.length ? (
        <div className="mt-5 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sc-blue-100 flex items-center justify-center shrink-0">
                <BarChart3 size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-base font-bold text-sc-ink-900">
                  Payout Trend
                </p>
                <p className="text-xs text-slate-500">
                  Payout amount across rounds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative w-8 h-0.5 bg-primary rounded">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary" />
              </span>
              Payout Amount
            </div>
          </div>
          <div className="h-[220px]">
            <Line data={chartJsData} options={chartOptions} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
