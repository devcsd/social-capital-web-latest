import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuClock2, LuCalendarDays } from "react-icons/lu";
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
  <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-lg" />
    <div className="space-y-2 w-full">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-32" />
    </div>
  </div>
);

const GroupHeaderSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-indigo-50 rounded-xl p-5 flex justify-between items-center">
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
  <div className="bg-white rounded-2xl p-5 border shadow-sm space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>

    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-3">
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

export default function GroupDetails() {
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Back */}
      <button
        className="flex items-center gap-2 text-primary font-medium"
        onClick={() =>
          navigate(
            `/adminPanel/${groupType == "Auction" ? "Auction" : "Rotation"}`,
          )
        }>
        <LuArrowLeft size={18} />
        Back to {groupType} Overview
      </button>

      {loading ? (
        <div className="space-y-8">
          <GroupHeaderSkeleton />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RoundCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* <pre>Grousps : {JSON.stringify(group, null, 2)}</pre> */}
          {/* <pre>Rounds : {JSON.stringify(group.rounds, null, 2)}</pre> */}
          {/* Group Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Fund Manager Image */}
                {group?.admin?.profileImage ? (
                  <img
                    src={group.admin.profileImage}
                    alt="Fund Manager"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold border">
                    {getInitials(
                      `${group?.admin?.firstName ?? ""} ${group?.admin?.lastName ?? ""}`,
                    ) || "FM"}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {group?.groupName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Managed by{" "}
                    {group?.admin
                      ? `${group.admin.firstName || ""} ${group.admin.lastName || ""}`.trim()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Currency + Status */}
              <div className="flex items-center gap-3">
                {/* Active Badge */}
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    group?.groupData?.is_active
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                  {group?.groupData?.is_active ? "Active" : "Inactive"}
                </span>

                {/* Country Flag */}
                <ReactCountryFlag
                  svg
                  countryCode={currencyMeta?.[currencyLabel]?.flag || "US"}
                  style={{ fontSize: "1.8em" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Total Rounds */}
              <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-5 shadow-sm">
                <div>
                  <p className="text-sm text-gray-500">Total Rounds</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {group?.rounds?.length || 0}
                  </p>
                </div>
                <span className="text-indigo-500 text-3xl">
                  <LuClock2 />
                </span>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-5 shadow-sm">
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {group?.joinedMember || 0} / {group?.totalMember || 0}
                  </p>
                </div>
                <IoPeopleSharp className="text-indigo-500 text-3xl" />
              </div>
              {/*Transcation */}
              <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-5 shadow-sm">
                <div>
                  <p className="text-sm text-gray-500">Transcation Type</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {group?.transactionType || "—"}
                  </p>
                </div>
                <span className="text-indigo-500 text-3xl">
                  <CiCreditCard1 />
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Fund Value"
              value={formatCurrency(group?.currencyLabel, group?.totalFund)}
              iconBg="bg-primary/10"
              Icon={GiTakeMyMoney}
            />

            <StatCard
              title="Total Admin Commission"
              value={formatCurrency(
                group?.currencyLabel,
                group?.totalCommission,
              )}
              iconBg="bg-secondary/20"
              Icon={GiReceiveMoney}
            />

            <StatCard
              title="Member Contributions"
              value={formatCurrency(
                group?.currencyLabel,
                group?.groupData?.initial_member_contribution,
              )}
              iconBg="bg-primary/10"
              Icon={GiPayMoney}
            />
          </div>

          {/* Rounds */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Auction Rounds</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {rounds.map((r, index) => (
                <div
                  key={r.round}
                  className="bg-white rounded-2xl p-5 border shadow-sm space-y-4 hover:-translate-y-2
    hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/adminPanel/${groupType}Round/${group.groupId}`;
                  }}>
                  {/* Header */}
                  <div className="flex justify-between items-center ">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Round {index + 1}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {r.status}
                    </span>
                  </div>
                  {/* Info rows */}
                  <div className="space-y-3">
                    <InfoRow
                      icon={GiTrophyCup}
                      label="Winner"
                      value={r.winnerName ? r.winnerName : "-"}
                    />
                    <InfoRow
                      icon={LuCalendarDays}
                      label="Date"
                      value={formatDateTimeByCurrency(
                        r.roundCompletedDate,
                        r.currencyLabel,
                      )}
                    />
                    {groupType === "Auction" &&
                      r.maximumBidAmount &&
                      r.payoutAmount && (
                        <InfoRow
                          icon={MdGavel}
                          label="Winning Bid"
                          value={formatCurrency(
                            r.currencyLabel,
                            r.payoutAmount,
                          )}
                        />
                      )}
                  </div>
                  {/* Settlement */}
                  <div className="bg-yellow-400 rounded-xl px-4 py-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      Settlement Amount
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <GiMoneyStack size={16} />
                      {formatCurrency(r.currencyLabel, r.payoutAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

const StatCard = ({ title, value, iconBg, Icon }) => (
  <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center gap-4">
    {/* Icon box */}
    <div
      className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-primary" />
    </div>

    {/* Text */}
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-3">
    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);
