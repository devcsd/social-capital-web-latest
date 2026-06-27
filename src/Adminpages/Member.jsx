import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight,FaMapMarkerAlt} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { getAllMemberPageId } from "../api/api";
import EmptyState from "../AdminComponent/EmptyState";

/* ─── update your api.js to support POST with filters ─────────────────
   export const getAllMemberPageId = async (pageId, filters = {}) => {
     return apiService.post(`admin/getAllMemberData/${pageId}`, {
       filters,
       page: pageId,
     });
   };
──────────────────────────────────────────────────────────────────────── */

const EMPTY_FILTERS = {
  name: "",
  emailId: "",
  mobileNumber: "",
  country: "",
  state: "",
  city: "",
};

const FILTER_FIELDS = [
  { key: "name",         label: "Name",          icon: User,      placeholder: "Search by name..."   },
  { key: "emailId",        label: "Email",         icon: Mail,      placeholder: "Search by email..."  },
  { key: "mobileNumber", label: "Mobile",        icon: Phone,     placeholder: "Search by mobile..." },
  { key: "country",      label: "Country",       icon: Globe,     placeholder: "Type country..."     },
  { key: "state",        label: "State",         icon: MapPin,    placeholder: "Type state..."       },
  { key: "city",         label: "City",          icon: Building2, placeholder: "Type city..."        },
];

/* strip empty strings so payload stays clean */
const buildPayload = (filters, page) => ({
  filters: Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v.trim() !== "")
  ),
  page,
});

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
    {children}
  </label>
);

const IconInput = ({ icon: Icon, value, onChange, placeholder }) => (
  <div className="relative flex items-center">
    <Icon size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-slate-200
                 bg-white text-slate-800 placeholder-slate-400
                 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300
                 transition"
    />
    {value && (
      <button
        onClick={() => onChange({ target: { value: "" } })}
        className="absolute right-2 text-slate-300 hover:text-slate-500 transition"
      >
        <X size={13} />
      </button>
    )}
  </div>
);

const Members = () => {
  const [members, setMembers]       = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  /* draft = what user is typing; applied = what was last searched */
  const [draft, setDraft]       = useState(EMPTY_FILTERS);
  const [applied, setApplied]   = useState(EMPTY_FILTERS);

  const hasAnyFilter = Object.values(applied).some((v) => v.trim() !== "");
  const hasDraftChange = JSON.stringify(draft) !== JSON.stringify(applied);

  /* ── fetch ── */
  const fetchMembers = useCallback(async (pageNumber, filters) => {
    setLoading(true);
    try {
      const payload = buildPayload(filters, pageNumber);
      const response = await getAllMemberPageId(pageNumber, payload.filters);
      const data = response.data.data;
      setMembers(data.members || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || pageNumber);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* fetch on page change (with already-applied filters) */
  useEffect(() => {
    fetchMembers(page, applied);
  }, [page, applied, fetchMembers]);

  /* ── filter handlers ── */
  const setDraftField = (key) => (e) =>
    setDraft((prev) => ({ ...prev, [key]: e.target.value }));

  const applyFilters = () => {
    setApplied(draft);
    setPage(1);
  };

  const clearAll = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  /* apply on Enter key in any field */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") applyFilters();
  };

  /* ── skeleton ── */
  const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200" />
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-40 bg-gray-100 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-gray-100 p-3">
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-5 w-10 bg-gray-300 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[96vh] p-2 md:p-6 flex flex-col">

      {/* Page header */}
      <div className="flex justify-between items-center mb-5 flex-shrink-0">
        {loading ? (
          <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
        ) : (
          <h1 className="text-2xl font-bold text-primary">Members overview</h1>
        )}
      </div>

      {/* ══════════════════ FILTER PANEL ══════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex-shrink-0">

        {/* Panel header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Filter members</span>
          </div>

          <div className="flex items-center gap-2">
            {hasAnyFilter && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                           bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition"
              >
                <X size={11} /> Clear all
              </button>
            )}
            <button
              onClick={applyFilters}
              disabled={!hasDraftChange}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition
                ${hasDraftChange
                  ? "bg-primary text-white hover:opacity-90"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              Apply filters
            </button>
          </div>
        </div>

        {/* Row 1 — Name · Email · Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {FILTER_FIELDS.slice(0, 3).map(({ key, label, icon, placeholder }) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <IconInput
                icon={icon}
                value={draft[key]}
                onChange={setDraftField(key)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        {/* Row 2 — Country · State · City */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"
             onKeyDown={handleKeyDown}>
          {FILTER_FIELDS.slice(3).map(({ key, label, icon, placeholder }) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <IconInput
                icon={icon}
                value={draft[key]}
                onChange={setDraftField(key)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        {/* active filter chips */}
        {hasAnyFilter && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
            {Object.entries(applied)
              .filter(([, v]) => v.trim())
              .map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                             bg-blue-50 text-blue-600 border border-blue-100"
                >
                  <span className="capitalize font-medium">{key}:</span> {value}
                  <button
                    onClick={() => {
                      const next = { ...applied, [key]: "" };
                      setApplied(next);
                      setDraft(next);
                      setPage(1);
                    }}
                    className="text-blue-400 hover:text-blue-600 transition ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>
      {/* ════════════════ END FILTER PANEL ════════════════ */}

      {/* Members grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <EmptyState message="No members match your filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100
                           shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

                {/* Profile */}
                <div className="flex items-center gap-4">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary
                                    text-white flex items-center justify-center font-bold text-lg">
                      {member.profileName || member.name?.charAt(0) || "M"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-base">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{member.emailId}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <FaPhone className="inline-block" />
                      {member.mobileNumber || "NA"}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-500 mb-1">Groups</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {member.participateGroup || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-500 mb-1">Pending</p>
                    <p className="font-bold text-red-600 text-sm">
                      ₹{member.pendingDueAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-500 mb-1">Paid</p>
                    <p className="font-bold text-green-600 text-sm">
                      ₹{member.completedDueAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100" />
                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
    <FaMapMarkerAlt className="text-red-500" />
    <span>
      {[
        member.city,
        member.state,
        member.country,
      ]
        .filter(Boolean)
        .join(", ") || "Location Not Available"}
    </span>
  </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-3 flex-shrink-0">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            <FaChevronLeft /> Prev
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Members;