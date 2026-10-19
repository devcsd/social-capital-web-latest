import { useState, useMemo, useEffect } from "react";
import { Table } from "antd";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  Mail,
  MessageSquareMore,
  Phone,
  Search,
  X,
} from "lucide-react";
import {
  getContactEnquiries,
  getSignUpEnquiries,
  updateContactEnquiries,
} from "../api/api";
import toast from "react-hot-toast";

export default function SupportEnquiry() {
  const [activeTab, setActiveTab] = useState("contact");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  const byText = (key) => (a, b) =>
    String(a?.[key] ?? "").localeCompare(String(b?.[key] ?? ""));

  const baseColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: byText("name"),
      render: (text) => (
        <div className="flex items-center gap-3 min-w-[140px]">
          <span className="w-9 h-9 rounded-full bg-sc-blue-100 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {initialsOf(text)}
          </span>
          <span className="font-semibold text-primary cursor-pointer">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: byText("email"),
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      sorter: byText("mobile"),
    },
    {
      title: "Subject",
      dataIndex: "message",
      key: "message",
      sorter: byText("message"),
      render: (text) => (
        <span className="line-clamp-2 max-w-[200px]">{text}</span>
      ),
    },
  ];

  const contactExtraColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: byText("category"),
      render: (text) => (
        <span className="block truncate max-w-[150px]" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusPill status={status} />,
    },
    {
      title: "",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className={`inline-flex items-center gap-1.5 rounded-lg border border-sc-blue-100 bg-sc-blue-100/50 text-primary font-medium hover:bg-sc-blue-100 transition-colors ${
              record.status === "Pending"
                ? "px-2.5 py-1.5 text-xs"
                : "px-4 py-1.5 text-sm"
            }`}
            onClick={() => {
              setSelected(record);
              setSelectedId(record.id);
            }}>
            <Eye size={15} />
            View
          </button>

          {record.status === "Pending" && (
            <button
              className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-sc-blue-700 text-white text-xs font-medium transition-colors"
              onClick={() => {
                setSelectedRecord(record);
                setSelectedId(record.id);
                setConfirmOpen(true);
              }}>
              Resolve
            </button>
          )}
        </div>
      ),
    },
  ];

  const columns =
    activeTab === "contact"
      ? [...baseColumns, ...contactExtraColumns]
      : baseColumns;

  const [allData, setAllData] = useState({
    contact: [],
    signup: [],
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const currentData = allData[activeTab];

  const fetchData = async () => {
    setLoading(true);

    try {
      if (activeTab === "contact") {
        const res = await getContactEnquiries();

        const enquiries = res?.data?.data?.enquiries ?? [];

        setAllData((prev) => ({
          ...prev,
          contact: enquiries,
        }));

        setStats({
          total: res?.data?.data?.totalEnquiries ?? enquiries.length,
          pending: res?.data?.data?.totalPendingEnquiries ?? 0,
          resolved: res?.data?.data?.totalResolvedEnquiries ?? 0,
        });
      } else {
        const res = await getSignUpEnquiries();
        console.log("response", res);

        const enquiries = res?.data?.data ?? [];

        setAllData((prev) => ({
          ...prev,
          signup: Array.isArray(enquiries) ? enquiries : [],
        }));
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const total = stats.total;
  const pending = stats.pending;
  const resolved = stats.resolved;

  const filteredData = useMemo(() => {
    return currentData
      .filter((e) =>
        activeTab === "contact" && filter !== "All"
          ? e?.status === filter
          : true,
      )
      .filter((e) => {
        const searchValue = search.toLowerCase();

        return (
          e?.name?.toLowerCase().includes(searchValue) ||
          e?.email?.toLowerCase().includes(searchValue) ||
          e?.mobile?.includes(search)
        );
      })
      // Pending (unresolved) enquiries first; original order kept within each group
      .sort(
        (a, b) =>
          (a?.status === "Resolved" ? 1 : 0) -
          (b?.status === "Resolved" ? 1 : 0),
      );
  }, [currentData, search, filter, activeTab]);

  const handleResolve = async (id) => {
    try {
      console.log("Selected ID : ", id);
      setResolvingId(id); // disable button

      const res = await updateContactEnquiries(id);
      console.log(res, "responseeee");
      toast.success(
        res?.data?.message || "The Enquiry has been Successfully Resolved",
      );
      await fetchData();

      setConfirmOpen(false);
    } catch (error) {
      console.error("Error resolving enquiry:", error);
    } finally {
      setResolvingId(null); // enable button again
    }
  };

  const tableClass =
    "[&_.ant-table-thead>tr>th]:!bg-white [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-sc-ink-900 " +
    "[&_.ant-table-thead>tr>th]:!border-slate-100 [&_.ant-table-thead>tr>th::before]:!hidden " +
    "[&_.ant-table-tbody>tr>td]:!py-3 [&_.ant-table-tbody>tr>td]:!text-[13px] [&_.ant-table-tbody>tr>td]:!text-sc-ink-900 [&_.ant-table-tbody>tr>td]:!border-slate-100 " +
    "[&_.ant-pagination]:!px-4 [&_.ant-pagination-total-text]:!mr-auto [&_.ant-pagination-total-text]:!text-slate-600 " +
    "[&_.ant-pagination-item]:!rounded-lg [&_.ant-pagination-item]:!border-0 " +
    "[&_.ant-pagination-item-active]:!bg-primary [&_.ant-pagination-item-active_a]:!text-white";

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sc-ink-900 tracking-tight">
            {activeTab === "contact" ? "Contact Enquiries" : "Sign Up Enquiries"}
          </h1>

          <p className="mt-1.5 text-slate-500 text-sm max-w-2xl">
            {activeTab === "contact"
              ? "Manage and respond to customer contact enquiries. Review details, track their status, and resolve pending requests efficiently."
              : "Review and manage new user sign-up enquiries. Monitor registration interest and follow up when necessary."}
          </p>
        </div>

        {/* Sign Up tab hidden — page shows Contact enquiries only */}
      </div>

      {/* Stats */}
      {activeTab === "contact" && (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            title="Total Enquiries"
            value={total}
            caption="All contact enquiries received"
            icon={<MessageSquareMore size={22} />}
            color="blue"
          />
          <StatCard
            title="Pending Enquiries"
            value={pending}
            caption="Awaiting response or resolution"
            icon={<Clock size={22} />}
            color="yellow"
          />
          <StatCard
            title="Resolved Enquiries"
            value={resolved}
            caption="Successfully resolved"
            icon={<Check size={24} strokeWidth={3} />}
            color="green"
          />
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-100 bg-white shadow-sm text-sm
                       placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {activeTab === "contact" && (
          <div className="relative md:w-[150px]">
            <Filter
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
            />
            <select
              className="appearance-none w-full h-12 pl-11 pr-10 rounded-xl border border-slate-100 bg-white shadow-sm text-sm font-medium text-sc-ink-900 cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          loading={loading}
          dataSource={filteredData}
          rowKey="id"
          rowClassName={() => "custom-row"}
          scroll={{ x: "max-content" }}
          className={tableClass}
          pagination={{
            pageSize: 10, // ✅ 10 records per page
            showSizeChanger: false, // hide page size dropdown (optional)
            showTotal: (count, [from, to]) =>
              `Showing ${from} to ${to} of ${count} enquiries`,
          }}
        />
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-sc-ink-900/50 backdrop-blur-sm p-4">
          {/* Backdrop click to close (optional) */}
          <div
            className="absolute inset-0"
            onClick={() => setConfirmOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-8 pt-10 pb-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="mb-3 text-2xl font-bold text-sc-ink-900">
                Confirm Resolution
              </h2>

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to mark this enquiry as{" "}
                <span className="font-semibold text-primary">resolved</span>?
              </p>

              <p className="mt-2 text-sm text-slate-500">
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 h-11 px-6 rounded-lg font-medium text-sc-ink-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>

                <button
                  onClick={() => handleResolve(selectedId)}
                  disabled={resolvingId === selectedRecord?.id}
                  className="flex-1 h-11 px-6 rounded-lg font-semibold text-white bg-primary hover:bg-sc-blue-700 shadow-sm transition-colors
                             flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Check size={18} />
                  {resolvingId === selectedRecord?.id
                    ? "Resolving..."
                    : "Yes, Resolve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-sc-ink-900/30 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />

          <aside className="relative w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col animate-[slideIn_.25s_ease-out]">
            <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-lg font-bold text-sc-ink-900">
                {activeTab === "contact"
                  ? "Contact Enquiry Details"
                  : "Sign Up Enquiry Details"}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-sc-ink-900 transition-colors"
                aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
              {/* Identity */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <span className="w-14 h-14 rounded-full bg-sc-blue-100 text-primary text-lg font-bold flex items-center justify-center shrink-0">
                  {initialsOf(selected.name)}
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-sc-ink-900">
                      {selected.name || "-"}
                    </span>
                    {activeTab === "contact" && (
                      <StatusPill status={selected.status} />
                    )}
                  </div>
                  <InfoLine icon={Mail} value={selected.email} />
                  <InfoLine icon={Phone} value={selected.mobile} />
                  <InfoLine
                    icon={Calendar}
                    value={formatDateTime(
                      activeTab === "contact"
                        ? selected.enquirySentAt
                        : selected.signUpDate,
                    )}
                  />
                </div>
              </div>

              {/* Enquiry Information */}
              {activeTab === "contact" && (
                <div>
                  <h3 className="text-base font-bold text-sc-ink-900 mb-3">
                    Enquiry Information
                  </h3>
                  <div className="rounded-xl border border-slate-100 px-4 divide-y divide-slate-100">
                    {selected.subject && (
                      <DetailRow
                        icon={FileText}
                        label="Subject"
                        value={selected.subject}
                      />
                    )}
                    <DetailRow
                      icon={FileText}
                      label="Category"
                      value={selected.category}
                    />
                    <DetailRow
                      icon={Clock}
                      label="Status"
                      value={<StatusPill status={selected.status} />}
                    />
                    <DetailRow
                      icon={Clock}
                      label="Date & Time"
                      value={formatDateTime(selected.enquirySentAt)}
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-base font-bold text-sc-ink-900 mb-3">
                  Message
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words min-h-[90px]">
                  {selected.message}
                </div>
              </div>

              {/* Resolution History / Status */}
              {activeTab === "contact" &&
                (selected.status === "Resolved" ? (
                  <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle2
                      size={24}
                      className="text-white fill-green-600 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        This enquiry has been resolved
                      </p>
                      {(selected.resolvedAt || selected.resolvedBy) && (
                        <p className="text-xs text-green-700 mt-0.5">
                          Resolved
                          {selected.resolvedAt &&
                            ` on ${formatDateTime(selected.resolvedAt)}`}
                          {selected.resolvedBy && ` by ${selected.resolvedBy}`}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-base font-bold text-sc-ink-900 mb-3">
                      Resolution History
                    </h3>
                    <ol className="relative ml-2 border-l-2 border-slate-200 space-y-4">
                      <li className="relative pl-6">
                        <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-primary ring-4 ring-sc-blue-100" />
                        <p className="text-sm font-semibold text-sc-ink-900">
                          Enquiry Created
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatDateTime(selected.enquirySentAt)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Enquiry submitted by {selected.name}
                        </p>
                      </li>
                      <li className="relative pl-6">
                        <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                        <p className="text-sm font-semibold text-sc-ink-900">
                          Pending
                        </p>
                        <p className="text-xs text-slate-500">
                          Awaiting admin response
                        </p>
                      </li>
                    </ol>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 h-11 px-4 border border-slate-200 bg-white text-sc-ink-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Close
              </button>

              {activeTab === "contact" && selected.status === "Pending" && (
                <button
                  onClick={() => {
                    setSelected(null);
                    setSelectedRecord(selected.id);
                    setConfirmOpen(true);
                  }}
                  className="flex-[1.4] h-11 px-4 bg-primary hover:bg-sc-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Check size={18} />
                  Mark as Resolved
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const initialsOf = (name = "") => {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date)) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StatusPill({ status }) {
  const resolved = status === "Resolved";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
        resolved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          resolved ? "bg-green-600" : "bg-amber-500"
        }`}
      />
      {resolved ? "Resolved" : "Pending"}
    </span>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-600 break-all">
      <Icon size={15} className="text-primary shrink-0" />
      {value || "-"}
    </p>
  );
}

function TabButton({ label, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-slate-500 hover:text-primary"
      }`}>
      {label}
    </button>
  );
}

const STAT_COLORS = {
  blue: {
    card: "from-sc-blue-100/60 to-white",
    icon: "bg-primary/15 text-primary",
    line: "#4072ff",
  },
  yellow: {
    card: "from-amber-50 to-white",
    icon: "bg-amber-400 text-white",
    line: "#fbbf24",
  },
  green: {
    card: "from-green-50 to-white",
    icon: "bg-green-100 text-green-600",
    line: "#34d399",
  },
};

function StatCard({ title, value, caption, icon, color }) {
  const c = STAT_COLORS[color];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-gradient-to-br ${c.card} px-5 py-4 flex items-start gap-4`}>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-sm text-slate-600">{title}</p>
        <h2 className="text-3xl font-bold text-sc-ink-900 leading-tight mt-0.5">
          {value}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{caption}</p>
      </div>
      {/* decorative trend */}
      <svg
        viewBox="0 0 100 50"
        className="absolute right-4 top-6 w-24 h-12 pointer-events-none"
        aria-hidden="true">
        <defs>
          <linearGradient id={`se-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.line} stopOpacity="0.35" />
            <stop offset="1" stopColor={c.line} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 48 C30 46 45 40 60 28 S85 6 100 2 L100 50 L0 50 Z"
          fill={`url(#se-${color})`}
        />
        <path
          d="M0 48 C30 46 45 40 60 28 S85 6 100 2"
          fill="none"
          stroke={c.line}
          strokeWidth="2"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-7 h-7 rounded-lg bg-sc-blue-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-primary" />
      </div>
      <span className="w-24 shrink-0 text-sm text-slate-700">{label}</span>
      <div className="flex-1 text-sm text-sc-ink-900 break-words">
        {value || "-"}
      </div>
    </div>
  );
}
