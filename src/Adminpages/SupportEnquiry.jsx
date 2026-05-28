import { useState, useMemo, useEffect } from "react";
import { LuMessageSquareMore, LuClock10 } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { IoInformation } from "react-icons/io5";
import { Table, Tag, Button, Modal } from "antd";
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

  const baseColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ color: "#2563eb", fontWeight: 500, cursor: "pointer" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Subject",
      dataIndex: "message",
      key: "message",
    },
  ];

  const contactExtraColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Resolved" ? (
          <Tag
            style={{
              background: "#dcfce7",
              color: "#15803d",
              borderRadius: "999px",
              padding: "4px 16px",
              border: "none",
              fontWeight: 500,
            }}>
            Resolved
          </Tag>
        ) : (
          <Tag
            style={{
              background: "#fef9c3",
              color: "#a16207",
              borderRadius: "999px",
              padding: "4px 16px",
              border: "none",
              fontWeight: 500,
            }}>
            Pending
          </Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            gap: "12px",
            justifyContent: "center",
          }}>
          <button
            className=" p-2"
            style={{
              background: "#64748b",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
            }}
            onClick={() => {
              setSelected(record);
              setSelectedId(record.id);
            }}>
            View
          </button>

          {record.status === "Pending" && (
            <button
              className="bg-primary hover:bg-primary text-white p-2"
              style={{
                color: "#fff",
                borderRadius: "6px",
                border: "none",
              }}
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
      });
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

  return (
    <div className="min-h-screen  p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {activeTab === "contact" ? "Contact Enquiries" : "Sign Up Enquiries"}
        </h1>

        <p className="mt-2 text-slate-500 text-sm max-w-2xl">
          {activeTab === "contact"
            ? "Manage and respond to customer contact enquiries. Review details, track their status, and resolve pending requests efficiently."
            : "Review and manage new user sign-up enquiries. Monitor registration interest and follow up when necessary."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b pb-2">
        <TabButton
          label="Contact"
          value="contact"
          {...{ activeTab, setActiveTab }}
        />
        <TabButton
          label="Sign Up"
          value="signup"
          {...{ activeTab, setActiveTab }}
        />
      </div>

      {/* Stats */}
      {activeTab === "contact" && (
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title="Total Enquiries"
            value={total}
            icon={<LuMessageSquareMore />}
            color="blue"
          />
          <StatCard
            title="Pending Enquiries"
            value={pending}
            icon={<LuClock10 />}
            color="yellow"
          />
          <StatCard
            title="Resolved Enquiries"
            value={resolved}
            icon={<FaCheck />}
            color="green"
          />
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="flex-1 px-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {activeTab === "contact" && (
          <select
            className="px-6 py-2 rounded-xl  text-black shadow-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
        <Table
          columns={columns}
          loading={loading}
          dataSource={filteredData}
          rowKey="id"
          rowClassName={() => "custom-row"}
          pagination={{
            pageSize: 10, // ✅ 10 records per page
            showSizeChanger: false, // hide page size dropdown (optional)
          }}
        />
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 -top-10 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* Backdrop click to close (optional) */}
          <div
            className="absolute inset-0"
            onClick={() => setConfirmOpen(false)}
          />

          <div
            className={`
        relative bg-white rounded-2xl shadow-2xl max-w-md w-full
        overflow-hidden transform transition-all duration-300
        scale-100 opacity-100
      `}>
            <div className="px-8 pt-10 pb-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-800">
                Confirm Resolution
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to mark this enquiry as{" "}
                <span className="font-semibold text-primary">resolved</span>?
              </p>

              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className={`
              flex-1 sm:flex-none px-8 py-3.5 rounded-lg font-medium
              text-gray-700 bg-gray-100 hover:bg-gray-200
              border border-gray-300 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            `}>
                  Cancel
                </button>

                <button
                  onClick={() => handleResolve(selectedId)}
                  disabled={resolvingId === selectedRecord?.id}
                  className={`
    flex-1 sm:flex-none px-8 py-3.5 rounded-lg font-medium
    text-white bg-primary
    shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed
  `}>
                  {resolvingId === selectedRecord?.id
                    ? "Resolving..."
                    : "Yes, Resolve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 -top-10 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <IoInformation />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Enquiry Details
              </h2>
            </div>

            {/* Main content */}
            <div className="p-6 space-y-6">
              <DetailRow label="Name" value={selected.name} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Phone" value={selected.mobile} />

              {activeTab === "contact" && (
                <>
                  <DetailRow label="Category" value={selected.category} />
                  <DetailRow
                    label="Date"
                    value={new Date(selected.enquirySentAt).toLocaleString()}
                  />
                </>
              )}

              {activeTab === "signup" && (
                <DetailRow
                  label="Sign Up Date"
                  value={new Date(selected.signUpDate).toLocaleString()}
                />
              )}

              <hr className="border-gray-200 my-4" />

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 whitespace-pre-wrap min-h-[90px]">
                  {selected.message}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 px-4 border text-black font-medium rounded-lg">
                Back
              </button>

              {activeTab === "contact" && selected.status === "Pending" && (
                <button
                  onClick={() => {
                    setSelected(null);
                    setSelectedRecord(selected.id);
                    setConfirmOpen(true);
                  }}
                  className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg">
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ label, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`pb-2 font-semibold ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    yellow: "text-yellow-600 bg-yellow-100",
    green: "text-green-600 bg-green-100",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-slate-800 mt-1">{value}</h2>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-32 shrink-0">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
      <div className="flex-1 text-gray-900 text-base break-all">
        {value || "-"}
      </div>
    </div>
  );
}
