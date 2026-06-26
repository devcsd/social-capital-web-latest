import { useEffect, useState, useCallback } from "react";
import EmptyState from "../AdminComponent/EmptyState";
import ManualPagination from "../AdminComponent/Pagination";
import { currencyMeta } from "../utils/currencyMeta";
import { formatCurrency } from "../utils/formatCurrency";
import { Dropdown, Button } from "antd";
import { getInitials } from "../utils/getInitials";
import { getRotationGroups } from "../api/api";
import ReactCountryFlag from "react-country-flag";

const PAGE_SIZE = 6;

const Card = ({ group }) => {
  const currencyKey = group?.currency?.toUpperCase();
  const currencyData = currencyMeta?.[currencyKey];
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-4 hover:shadow-md transition cursor-pointer"
      onClick={() => {
        window.location.href = `/adminPanel/GroupDetails/${group.groupId}`;
      }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {group.groupName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {group.groupStartDate ? (
              <>
                Started on {new Date(group.groupStartDate).toLocaleDateString()}
              </>
            ) : (
              <span className="text-yellow-600 font-medium">Not Started</span>
            )}
          </p>
        </div>
        <span>
          {currencyData?.flag && (
            <ReactCountryFlag
              svg
              countryCode={currencyData.flag}
              style={{ fontSize: "2em" }}
            />
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* <span className=" inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium">
        {group.fundType}
      </span> */}

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-medium">
          {group.frequency}
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between">
        <span>Total Rounds</span>
        <span className="font-semibold">{group.totalRound}</span>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between">
        <span>Members</span>
        <span className="font-semibold">{group.totalMember}</span>
      </div>

      <div className="bg-yellow-400 rounded-xl px-4 py-3 flex justify-between font-semibold">
        <span>Total Group Value</span>
        {formatCurrency(group?.currency, group?.totalFundAmount)}
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="bg-white rounded-2xl border p-6 animate-pulse space-y-4">
    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
    <div className="h-6 bg-gray-200 rounded w-24 mx-auto" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-10 bg-gray-100 rounded-xl" />
    ))}
    <div className="h-12 bg-gray-200 rounded-xl" />
  </div>
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
    <div className="p-3 w-56 bg-white rounded-xl shadow-lg border">
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition
              ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rotation Overview</h1>
          <p className="text-gray-500">
            Monitor all rotation-based chit groups
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by group name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-lg
               focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 📅 Frequency */}
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white
             focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="ALL">All Frequency</option>

            {frequencyOptions.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>

          {/* 💱 Currency Filter (Antd Dropdown) */}
          <Dropdown
            overlay={filterMenu}
            trigger={["click"]}
            placement="bottomRight">
            <Button className="flex items-center gap-2 rounded-lg">
              Currency
              {selectedCurrencies.length > 0 && (
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  {selectedCurrencies.length}
                </span>
              )}
            </Button>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <EmptyState
          message="No Auction Groups Found"
          subtitle="Create a new auction group to get started"
        />
      ) : (
        <>
          {/* <pre>Groups : {JSON.stringify(paginatedData, null, 2)}</pre> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((group) => (
              <Card key={group.id} group={group} />
            ))}
          </div>

          <ManualPagination
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
