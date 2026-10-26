import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  X,
  SlidersHorizontal,
  Users,
  Clock,
  Coins,
  RotateCcw,
  Filter,
  ChevronLeft,
  ChevronRight,
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

/* 6 card colour themes, cycled by card index (full class strings so Tailwind keeps them) */
const CARD_THEMES = [
  { // blue
    bar: "from-sky-300 via-blue-400 to-sky-300",
    bg: "from-white via-white to-blue-50/80",
    avatar: "from-sky-400 to-blue-600",
    ring: "ring-blue-100",
    blob: "bg-blue-100/60",
    icon: "text-blue-300",
    wave: ["#bfdbfe", "#60a5fa"],
  },
  { // orange
    bar: "from-amber-300 via-orange-400 to-amber-300",
    bg: "from-white via-white to-orange-50/80",
    avatar: "from-amber-400 to-orange-500",
    ring: "ring-orange-100",
    blob: "bg-orange-200/70",
    icon: "text-white",
    wave: ["#fed7aa", "#fb923c"],
  },
  { // purple
    bar: "from-violet-300 via-indigo-400 to-violet-300",
    bg: "from-white via-white to-violet-50/80",
    avatar: "from-indigo-400 to-violet-600",
    ring: "ring-violet-100",
    blob: "bg-violet-100/60",
    icon: "text-violet-200",
    wave: ["#ddd6fe", "#a78bfa"],
  },
  { // green
    bar: "from-emerald-300 via-green-400 to-emerald-300",
    bg: "from-white via-white to-emerald-50/80",
    avatar: "from-emerald-400 to-green-600",
    ring: "ring-emerald-100",
    blob: "bg-emerald-100/60",
    icon: "text-emerald-300",
    wave: ["#a7f3d0", "#34d399"],
  },
  { // pink
    bar: "from-pink-300 via-rose-400 to-pink-300",
    bg: "from-white via-white to-pink-50/80",
    avatar: "from-orange-400 to-rose-500",
    ring: "ring-pink-100",
    blob: "bg-pink-100/60",
    icon: "text-pink-200",
    wave: ["#fbcfe8", "#f472b6"],
  },
  { // sky
    bar: "from-blue-400 via-sky-400 to-blue-400",
    bg: "from-white via-white to-sky-50/80",
    avatar: "from-blue-500 to-sky-500",
    ring: "ring-sky-100",
    blob: "bg-sky-100/60",
    icon: "text-sky-300",
    wave: ["#bae6fd", "#38bdf8"],
  },
];

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* strip empty strings so payload stays clean */
const buildPayload = (filters, page) => ({
  filters: Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v.trim() !== "")
  ),
  page,
});

const FieldLabel = ({ children }) => (
  <label className="block text-sm font-semibold text-slate-800 mb-2">
    {children}
  </label>
);

const IconInput = ({ icon: Icon, value, onChange, placeholder }) => (
  <div className="relative flex items-center group">
    <Icon
      size={17}
      className="absolute left-4 text-slate-500 pointer-events-none z-10 transition-colors group-focus-within:text-blue-600"
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-11 pr-9 py-3 text-sm rounded-xl border border-slate-200
                 bg-white text-slate-800 placeholder-slate-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400
                 hover:border-slate-300
                 transition-all duration-150"
    />
    {value && (
      <button
        onClick={() => onChange({ target: { value: "" } })}
        className="absolute right-3 text-slate-300 hover:text-slate-500 transition-colors"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

const StatBox = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    blue:  { box: "bg-blue-50/80 border-blue-100",   icon: "text-blue-600",  value: "text-blue-600"  },
    red:   { box: "bg-red-50/80 border-red-100",     icon: "text-red-500",   value: "text-red-600"   },
    green: { box: "bg-green-50/80 border-green-100", icon: "text-green-600", value: "text-green-600" },
  }[tone];

  return (
    <div className={`rounded-xl border px-3 py-3 ${tones.box}`}>
      <div className="flex items-center gap-2">
        <Icon size={18} className={tones.icon} />
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <p className={`mt-1.5 text-center text-xl font-extrabold leading-tight truncate ${tones.value}`}>
        {value}
      </p>
    </div>
  );
};

const Wave = ({ colors, id }) => (
  <svg
    viewBox="0 0 200 60"
    preserveAspectRatio="none"
    className="absolute bottom-0 right-0 w-3/5 h-12 pointer-events-none"
  >
    <defs>
      <linearGradient id={`wave-${id}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor={colors[0]} stopOpacity="0" />
        <stop offset="100%" stopColor={colors[1]} stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <path
      d="M0,60 C40,55 60,20 100,30 C130,38 150,55 175,35 C185,27 195,15 200,12 L200,60 Z"
      fill={colors[0]}
      opacity="0.45"
    />
    <path
      d="M20,60 C60,58 90,30 125,38 C150,44 165,56 185,40 C192,34 197,28 200,26 L200,60 Z"
      fill={`url(#wave-${id})`}
    />
  </svg>
);

const MemberCard = ({ member, index }) => {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const location =
    [member.city, member.state, member.country].filter(Boolean).join(", ") ||
    "Location Not Available";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} border border-slate-100
                  shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.bar}`} />

      {/* Decorative blob + icon */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${theme.blob} pointer-events-none`} />
      <Users
        size={52}
        strokeWidth={0}
        fill="currentColor"
        className={`absolute top-6 right-7 ${theme.icon} opacity-90 pointer-events-none`}
      />

      <div className="relative p-5 pb-0">
        {/* Profile */}
        <div className="flex items-center gap-4 pr-16">
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={member.name}
              className={`w-[72px] h-[72px] rounded-full object-cover ring-4 ${theme.ring} shadow-md flex-shrink-0`}
            />
          ) : (
            <div
              className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${theme.avatar} ring-4 ${theme.ring}
                          text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0`}
            >
              {getInitials(member.name)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate text-lg">{member.name}</h3>
            <p className="text-sm text-slate-500 truncate flex items-center gap-2 mt-0.5">
              <Mail size={14} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{member.emailId}</span>
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
              <Phone size={14} className="text-slate-400 flex-shrink-0" />
              {member.mobileNumber || "NA"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <StatBox icon={Users} label="Groups"  tone="blue"  value={member.participateGroup || 0} />
          <StatBox icon={Clock} label="Pending" tone="red"   value={member.pendingDueAmount?.toLocaleString() || "0"} />
          <StatBox icon={Coins} label="Paid"    tone="green" value={member.completedDueAmount?.toLocaleString() || "0"} />
        </div>
      </div>

      {/* Location */}
      <div className="relative mt-4 border-t border-slate-100 px-5 py-3.5">
        <Wave colors={theme.wave} id={`${member.userId}-${index}`} />
        <p className="relative text-sm text-slate-700 flex items-center gap-2 pr-24">
          <MapPin size={16} className="text-red-500 fill-red-500 [&>circle]:fill-white flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      </div>
    </div>
  );
};

const Members = () => {
  const [members, setMembers]       = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(null);
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
      setTotalMembers(data.totalMembers ?? data.totalCount ?? data.total ?? null);
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
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-200" />
      <div className="flex items-center gap-4">
        <div className="w-[72px] h-[72px] rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-40 bg-slate-100 rounded mb-2" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-slate-100 p-3">
            <div className="h-3 w-12 bg-slate-200 rounded mx-auto mb-2" />
            <div className="h-5 w-10 bg-slate-300 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-3 w-28 bg-slate-100 rounded mt-6" />
    </div>
  );

  const subtitle = `${hasAnyFilter ? "Filtered results" : "All registered members"}${
    totalMembers != null ? ` (${totalMembers})` : ""
  }`;

  return (
    <div className="h-[96vh] p-2 md:p-6 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">

      {/* Page header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Users size={30} fill="currentColor" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Members Overview
            </h1>
            {loading && totalMembers == null ? (
              <div className="h-4 w-48 mt-1 rounded bg-slate-200 animate-pulse" />
            ) : (
              <p className="text-base text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {totalMembers != null && (
          <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm pl-4 pr-8 py-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Members</p>
              <p className="text-3xl font-extrabold text-slate-900 leading-tight">{totalMembers}</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════ FILTER PANEL ══════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex-shrink-0">

        {/* Panel header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-blue-600" />
            <span className="text-base font-bold text-slate-900">Filter members</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              disabled={!hasAnyFilter && !hasDraftChange}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                         bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={applyFilters}
              disabled={!hasDraftChange}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${hasDraftChange
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 shadow-md shadow-blue-500/30"
                  : "bg-blue-500/70 text-white cursor-not-allowed"
                }`}
            >
              <Filter size={15} /> Apply filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4" onKeyDown={handleKeyDown}>
          {FILTER_FIELDS.map(({ key, label, icon, placeholder }) => (
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
                             bg-blue-50 text-blue-600 border border-blue-100 hover:border-blue-200 transition-colors"
                >
                  <span className="capitalize font-semibold">{key}:</span> {value}
                  <button
                    onClick={() => {
                      const next = { ...applied, [key]: "" };
                      setApplied(next);
                      setDraft(next);
                      setPage(1);
                    }}
                    className="text-blue-400 hover:text-blue-600 transition-colors ml-0.5"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <EmptyState message="No members match your filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member, index) => (
              <MemberCard key={member.userId} member={member} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-3 flex-shrink-0">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 font-semibold border transition-colors ${
              page === 1
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30"
            }`}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 shadow-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 font-semibold border transition-colors ${
              page === totalPages
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Members;
