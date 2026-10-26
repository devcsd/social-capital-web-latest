import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  LuUserRound,
  LuUserPlus,
  LuUserX,
  LuSearch,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuCrown,
} from "react-icons/lu";
import { IoPeopleSharp } from "react-icons/io5";
import EmptyState from "./EmptyState";
import { getInitials } from "../utils/getInitials";

const MEMBERS_PER_PAGE = 6;

/* ---------- Members drawer (right-side panel) ---------- */
const GroupMembersDrawer = ({ open, onClose, group }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Members come from getGroupByID's memberDetails
  const members = (group?.memberDetails || []).map((m) => ({
    ...m,
    name: [m.firstName, m.lastName].filter(Boolean).join(" "),
  }));
  // Non-members (e.g. an admin who isn't participating) don't take a slot
  const memberCount = members.filter((m) => m.isMember !== false).length;
  const capacity = group?.totalMember || 0;
  const remaining = Math.max(capacity - memberCount, 0);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => setPage(1), [search]);

  const query = search.trim().toLowerCase();
  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query) ||
      m.emailId?.toLowerCase().includes(query),
  );

  // Open slots are listed after the joined members, hidden while searching
  const showSlots = !query && remaining > 0;
  const items = [
    ...filtered,
    ...(showSlots
      ? Array.from({ length: remaining }, (_, i) => ({
          slot: memberCount + i + 1,
        }))
      : []),
  ];
  const totalPages = Math.max(1, Math.ceil(items.length / MEMBERS_PER_PAGE));
  const start = (page - 1) * MEMBERS_PER_PAGE;
  const pageItems = items.slice(start, start + MEMBERS_PER_PAGE);

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Group Members"
        className={`absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center bg-rose-100 text-rose-500">
              <IoPeopleSharp size={24} />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
                Group Members
              </h2>
              <p className="text-[14px] text-slate-500">
                {capacity ? `${memberCount} / ${capacity}` : memberCount} members
              </p>
              {capacity > 0 && (
                <span
                  className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                    remaining === 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      remaining === 0 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {remaining === 0
                    ? "Group is full"
                    : `${remaining} more ${remaining === 1 ? "member" : "members"} needed to fill`}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 rounded-xl ring-1 ring-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 mt-6">
          <div className="relative">
            <LuSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full h-12 pl-11 pr-4 rounded-xl ring-1 ring-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {items.length === 0 ? (
            query ? (
              <p className="text-center text-[14px] text-slate-500 py-10">
                No members match your search.
              </p>
            ) : (
              <EmptyState
                message="No members have joined yet."
                subtitle="Members will appear here once they join the group"
              />
            )
          ) : (
            pageItems.map((m) =>
              m.slot ? (
                <EmptySlotCard key={`slot-${m.slot}`} slot={m.slot} />
              ) : (
                <MemberCard key={m.id} member={m} />
              ),
            )
          )}
        </div>

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
            <p className="text-[13px] text-slate-500">
              Showing {start + 1} – {Math.min(start + MEMBERS_PER_PAGE, items.length)} of{" "}
              {items.length} {showSlots ? "slots" : "members"}
            </p>
            <div className="flex items-center gap-1.5">
              <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}>
                <LuChevronLeft size={16} />
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>
                  {n}
                </PageBtn>
              ))}
              <PageBtn disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <LuChevronRight size={16} />
              </PageBtn>
            </div>
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
};

const MemberCard = ({ member: m }) => (
  <div className="flex items-center gap-4 rounded-2xl ring-1 ring-slate-100 shadow-sm p-4">
    {m.profileImage ? (
      <img
        src={m.profileImage}
        alt={m.name}
        className="w-12 h-12 shrink-0 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-semibold">
        {m.profileName || getInitials(m.name) || "M"}
      </div>
    )}

    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold text-slate-900 truncate">
        {m.name || "—"}
      </p>
      {m.emailId && (
        <p className="mt-0.5 text-[13px] text-slate-500 truncate">{m.emailId}</p>
      )}
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
        {m.isAdmin ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[12px] font-medium rounded-full bg-blue-50 text-blue-700">
            <LuCrown size={13} />
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[12px] font-medium rounded-full bg-slate-100 text-slate-600">
            <LuUserRound size={13} />
            Member
          </span>
        )}
        {m.isMember === false && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[12px] font-medium rounded-full bg-rose-50 text-rose-600">
            <LuUserX size={13} />
            Not a Member
          </span>
        )}
      </div>
    </div>

    <span className="flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded-full bg-emerald-50 text-emerald-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      Active
    </span>
  </div>
);

const EmptySlotCard = ({ slot }) => (
  <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4">
    <div className="w-14 h-12 shrink-0 rounded-full bg-white ring-1 ring-slate-200 text-slate-400 flex items-center justify-center">
      <LuUserPlus size={20} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold text-slate-400">Open Slot</p>
      <p className="mt-0.5 text-[12px] text-slate-400">
        Waiting for a member to join
      </p>
    </div>
  </div>
);

const PageBtn = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`h-8 min-w-[2rem] px-2 rounded-lg text-[13px] font-medium flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? "bg-blue-700 text-white"
        : "ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

export default GroupMembersDrawer;
