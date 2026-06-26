import { useState, useEffect, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { IoFilterSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Dropdown, Input, Badge, Button, Tag } from "antd";
import { currencyMeta } from "../utils/currencyMeta";
import { formatCurrency } from "../utils/formatCurrency";
import { getAllFundManager } from "../api/api";
import ReactCountryFlag from "react-country-flag";
import EmptyState from "../AdminComponent/EmptyState";
import ManualPagination from "../AdminComponent/Pagination";
import { getInitials } from "../utils/getInitials";

export default function ManagerDetails() {
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [fundManager, setFundManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FILTER LOGIC (UNCHANGED) ---------------- */
  const filteredFundManagers = fundManager.filter((fm) => {
    const matchesSearch = fm.fundManagerName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCurrency =
      selectedCurrencies.length === 0 ||
      (fm.earnings &&
        selectedCurrencies.every((currency) => fm.earnings[currency]));

    return matchesSearch && matchesCurrency;
  });

  const totalPages = Math.ceil(filteredFundManagers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredFundManagers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  /* ---------------- API FETCH ---------------- */
  const fetchFundManager = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFundManager();
      const Data = response.data;
      setFundManager(Data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFundManager();
  }, [fetchFundManager]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCurrencies]);
  useEffect(() => {
    console.log("managers", fundManager);
  }, [fundManager]);

  /* ---------------- ANT D FILTER MENU ---------------- */
  const filterMenu = (
    <div className="p-3 w-56 bg-white rounded-xl">
      <p className="text-xs text-slate-500 mb-3">Filter by currency Earning</p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(currencyMeta).map((currency) => {
          const isSelected = selectedCurrencies.includes(currency);

          return (
            <button
              key={currency}
              onClick={() => {
                setSelectedCurrencies((prev) =>
                  prev.includes(currency)
                    ? prev.filter((c) => c !== currency)
                    : [...prev, currency],
                );
              }}
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

  /* ---------------- SKELETON CARD ---------------- */
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />

      <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-200 rounded mb-4" />

      <div className="w-full mt-4 space-y-3">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>

      <div className="w-full mt-4 h-20 bg-slate-200 rounded-xl" />
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-7xl mx-auto  min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Group Managers Overview
          </h1>
          <p className="text-sm text-slate-500">
            Manage and monitor all Group managers
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
          {/* Search */}
          <Input
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            prefix={<BsSearch className="text-primary" />}
            className="w-full sm:w-64 rounded-xl border-blue-200"
          />

          {/* Filter */}
          <Dropdown
            overlay={filterMenu}
            trigger={["click"]}
            placement="bottomRight">
            <Badge count={selectedCurrencies.length} size="small">
              <Button className="flex items-center gap-2 rounded-xl border border-blue-200 text-primary bg-white hover:bg-blue-50">
                <IoFilterSharp className="w-4 h-4" />
                Filter
              </Button>
            </Badge>
          </Dropdown>
        </div>
      </div>

      {/* Selected Filters */}
      {selectedCurrencies.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {selectedCurrencies.map((currency) => (
            <Tag
              key={currency}
              closable
              onClose={() =>
                setSelectedCurrencies((prev) =>
                  prev.filter((c) => c !== currency),
                )
              }
              className="px-3 py-1 rounded-full text-sm bg-blue-50 text-primary border border-blue-200">
              {currency}
            </Tag>
          ))}

          <button
            onClick={() => setSelectedCurrencies([])}
            className="text-xs text-red-500 hover:underline ml-2">
            Clear all
          </button>
        </div>
      )}
      {/* <pre>Groups : {JSON.stringify(currentData, null, 2)}</pre> */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading &&
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {/* Empty State */}
        {!loading && currentData.length === 0 && (
          <EmptyState message="No Group managers available yet" />
        )}
        {!loading &&
          currentData.map((fm) => {
            const isActive = fm.managedGroups > 0;

            return (
              <div
                key={fm.fundManagerId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center cursor-pointer"
                onClick={() =>
                  navigate(`/adminPanel/FundManager/${fm.fundManagerId}`)
                }>
                {fm.profileImage ? (
                  <img
                    src={fm.profileImage}
                    alt={fm.fundManagerName}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mb-4 bg-primary text-white text-xl font-semibold flex items-center justify-center">
                    {getInitials(fm.fundManagerName)}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-primary-hover">
                  {fm.fundManagerName}
                </h3>

                <span
                  className={`mt-2 px-4 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {isActive ? "Active" : "Inactive"}
                </span>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-slate-600">Groups</span>
                    <span className="font-semibold text-primary">
                      {fm.managedGroups}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-slate-600">Members</span>
                    <span className="font-semibold text-primary">
                      {fm.groupMembers}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 bg-secondary rounded-xl px-4 py-3">
                  <p className="text-sm font-medium text-primary-hover mb-2 text-left">
                    Earnings
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {fm.earnings && Object.keys(fm.earnings).length > 0 ? (
                      Object.entries(fm.earnings).map(([currency, amount]) => {
                        const meta = currencyMeta[currency];

                        if (!meta) return null; // safety guard

                        return (
                          <div
                            key={currency}
                            className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              <ReactCountryFlag
                                svg
                                countryCode={meta.flag}
                                style={{ fontSize: "1.2em" }}
                              />
                            </span>

                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(currency, amount)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 text-left">
                        No earnings yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {!loading && filteredFundManagers.length > itemsPerPage && (
        <ManualPagination
          total={filteredFundManagers.length}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
