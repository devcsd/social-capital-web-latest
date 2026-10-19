import { useEffect, useState, useCallback } from "react";
import EmptyState from "../AdminComponent/EmptyState";
import {
  OverviewCard,
  OverviewSkeleton,
  OverviewHeader,
  SearchInput,
  FrequencySelect,
  CurrencyTrigger,
  OverviewPagination,
} from "./GroupOverviewUI";
import { currencyMeta } from "../utils/currencyMeta";
import { formatCurrency } from "../utils/formatCurrency";
import { Dropdown, Button } from "antd";
import { getRotationGroups } from "../api/api";
import ReactCountryFlag from "react-country-flag";

const PAGE_SIZE = 6;

const Card = ({ group }) => (
  <OverviewCard
    type="Rotation"
    group={group}
    flag={currencyMeta?.[group?.currency?.toUpperCase()]?.flag}
    totalValue={formatCurrency(group?.currency, group?.totalFundAmount)}
    onClick={() => {
      window.location.href = `/adminPanel/RotationGroupDetails/${group.groupId}`;
    }}
  />
);

export default function RotationOverview() {
  const [loading, setLoading] = useState(true);
  const [Groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [frequency, setFrequency] = useState("ALL");
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);

  const fetchAuctionGroup = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRotationGroups();
      const Data = response.data;
      setGroups(Data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const frequencyOptions = Array.from(
    new Set(Groups.map((g) => g.frequency).filter(Boolean)),
  );

  const filteredGroups = Groups.filter((group) => {
    /* 🔍 Search by group name */
    const matchesSearch = group.groupName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    /* 📅 Filter by frequency */
    const matchesFrequency =
      frequency === "ALL" || group.frequency === frequency;

    /* 💱 Filter by currency (multi-select) */
    const matchesCurrency =
      selectedCurrencies.length === 0 ||
      selectedCurrencies.includes(group.currency);

    return matchesSearch && matchesFrequency && matchesCurrency;
  });

  const filterMenu = (
    <div className="p-4 w-60 bg-white rounded-2xl shadow-xl border border-slate-100">
      <p className="text-xs text-slate-500 mb-3">Filter by currency earning</p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(currencyMeta).map((currency) => {
          const isSelected = selectedCurrencies.includes(currency);

          return (
            <button
              key={currency}
              onClick={() =>
                setSelectedCurrencies((prev) =>
                  prev.includes(currency)
                    ? prev.filter((c) => c !== currency)
                    : [...prev, currency],
                )
              }
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
              ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "bg-sc-blue-100/70 text-sc-ink-900 hover:bg-sc-blue-100"
              }`}>
              {currency}
            </button>
          );
        })}
      </div>

      {selectedCurrencies.length > 0 && (
        <Button
          type="link"
          danger
          size="small"
          className="mt-3 p-0"
          onClick={() => setSelectedCurrencies([])}>
          Clear filter
        </Button>
      )}
    </div>
  );

  useEffect(() => {
    fetchAuctionGroup();
  }, [fetchAuctionGroup]);

  useEffect(() => {
    console.log("Groups : ", Groups);
  }, [Groups]);

  useEffect(() => {
    console.log("Groups : ", Groups);
  }, [Groups]);

  const total = filteredGroups.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const paginatedData = filteredGroups.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, frequency, selectedCurrencies]);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <OverviewHeader
        type="Rotation"
        title="Rotation Overview"
        subtitle="Monitor all rotation-based chit groups"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        {/* 🔍 Search */}
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 📅 Frequency */}
          <FrequencySelect
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            options={frequencyOptions}
          />

          {/* 💱 Currency Filter (Antd Dropdown) */}
          <Dropdown
            overlay={filterMenu}
            trigger={["click"]}
            placement="bottomRight">
            <CurrencyTrigger count={selectedCurrencies.length} />
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <OverviewSkeleton key={i} />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <EmptyState
          message="No Rotation Groups Found"
          subtitle="Create a new rotation group to get started"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedData.map((group) => (
              <Card key={group.id} group={group} />
            ))}
          </div>

          <OverviewPagination
            total={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
