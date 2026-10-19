import React, { useEffect, useState, useCallback } from "react";
import { Radio, Input, Checkbox, Table, Tag } from "antd";
import { Select } from "antd";
import debounce from "lodash/debounce";
import { useAuth } from "../Auth/AuthContext";
import { getBoardcastMasterData, createBroadcast } from "../api/api";
import { message } from "antd";
import {
  Bell,
  Clock,
  Eye,
  FileText,
  Info,
  Mail,
  Megaphone,
  Send,
  Users,
} from "lucide-react";

/* ── presentational helpers ── */
const PanelHeader = ({ icon: Icon, title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-sc-blue-100 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-primary" />
      </div>
      <div>
        <h2 className="text-base font-bold text-sc-ink-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

const ChannelTile = ({ checked, onChange, icon: Icon, iconWrap, title, subtitle }) => (
  <label
    className={`flex items-center gap-4 rounded-xl border px-4 py-3 cursor-pointer select-none transition-colors ${
      checked
        ? "border-primary bg-sc-blue-100/40"
        : "border-slate-100 bg-slate-50 hover:border-slate-200"
    }`}>
    <Checkbox checked={checked} onChange={onChange} />
    <div
      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconWrap}`}>
      <Icon size={20} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold text-sc-ink-900">{title}</span>
      <span className="text-xs text-slate-500">{subtitle}</span>
    </div>
  </label>
);

/* recipient multi-select (kept outside the page so it never remounts) */
const RecipientPicker = ({ label, placeholder, value, onChange, options }) => (
  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
    <Select
      mode="multiple"
      allowClear
      labelInValue
      placeholder={placeholder}
      className="w-full"
      value={value}
      onChange={onChange}
      optionFilterProp="label"
      options={options}
      maxTagPlaceholder={null}
      maxTagCount={0}
    />
    {value.length > 0 && (
      <div className="mt-3">
        <div className="text-xs font-medium text-slate-500 mb-1.5">
          {label}
        </div>
        <div className="flex flex-wrap gap-2">
          {value.map((g) => (
            <Tag
              key={g.value}
              closable
              className="m-0 rounded-full border-0 bg-sc-blue-100 text-primary px-3 py-0.5 font-medium"
              onClose={(e) => {
                e.preventDefault();
                onChange(value.filter((s) => s.value !== g.value));
              }}>
              {g.label}
            </Tag>
          ))}
        </div>
      </div>
    )}
  </div>
);

/* decorative megaphone for the page header */
const MegaphoneArt = () => (
  <svg
    viewBox="0 0 440 150"
    className="hidden xl:block absolute right-0 -top-6 h-[150px] w-auto pointer-events-none"
    aria-hidden="true">
    <defs>
      <linearGradient id="bc-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd54a" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="bc-blue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4c86ff" />
        <stop offset="1" stopColor="#1e4fe5" />
      </linearGradient>
    </defs>
    <circle cx="250" cy="70" r="70" fill="#e6ecff" opacity="0.7" />
    {/* cards */}
    <g transform="rotate(-12 60 60)">
      <rect x="20" y="50" width="52" height="16" rx="4" fill="url(#bc-blue)" />
    </g>
    <g transform="rotate(-8 130 80)">
      <rect x="90" y="58" width="64" height="48" rx="8" fill="#fff" stroke="#dbe4ff" />
      {[70, 80, 90].map((y) => (
        <rect key={y} x="100" y={y} width="44" height="4" rx="2" fill="#4c86ff" />
      ))}
    </g>
    <g transform="rotate(10 400 100)">
      <rect x="372" y="86" width="50" height="34" rx="6" fill="url(#bc-blue)" />
      {[96, 104, 112].map((y) => (
        <rect key={y} x="380" y={y} width="34" height="3" rx="1.5" fill="#fff" />
      ))}
    </g>
    {/* megaphone */}
    <g transform="rotate(-20 260 80)">
      <path d="M200 66 L290 26 L290 124 L200 92 Z" fill="url(#bc-gold)" />
      <ellipse cx="290" cy="75" rx="18" ry="50" fill="url(#bc-blue)" />
      <ellipse cx="292" cy="75" rx="10" ry="38" fill="#fde68a" />
      <rect x="182" y="64" width="24" height="30" rx="6" fill="url(#bc-blue)" />
      <path d="M222 92 L234 132 L250 128 L242 98 Z" fill="url(#bc-blue)" />
    </g>
    {/* sound marks */}
    <path d="M168 66 q-6 8 0 16" stroke="#1e4fe5" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M160 60 q-10 14 0 28" stroke="#1e4fe5" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="330" y="72" width="22" height="4" rx="2" fill="#fbbf24" transform="rotate(15 340 74)" />
    <rect x="340" y="120" width="20" height="3" rx="1.5" fill="#4c86ff" transform="rotate(20 350 121)" />
    <rect x="150" y="18" width="20" height="3" rx="1.5" fill="#4c86ff" transform="rotate(10 160 19)" />
  </svg>
);

export default function BroadcastStyled() {
  const [audience, setAudience] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pushChecked, setPushChecked] = useState(true);
  const [emailChecked, setEmailChecked] = useState(false);
  const [history, setHistory] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const { user } = useAuth();

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Audience", dataIndex: "audience" },
    { title: "Date Sent", dataIndex: "createdAt" },
  ];
  const fetchBoardcastData = useCallback(async () => {
    setLoading(true);
    setTableLoading(true);
    try {
      const response = await getBoardcastMasterData();
      const Data = response.data.data;
      setGroupData(
        Data.allGroup.map((g) => ({
          label: g.groupName,
          value: g.groupId,
        })),
      );

      setUserData(
        Data.allUsers.map((g) => ({
          label: g.userName,
          value: g.userId,
        })),
      );
      setHistory(
        Array.isArray(Data?.broadcastHistory)
          ? Data.broadcastHistory.map((item) => ({
              id: item.id,
              title: item.title,
              audience: getAudienceLabel(item), // 👈 computed audience
              createdAt: formatDate(item.createdAt), // 👈 formatted date
            }))
          : [],
      );
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoardcastData();
  }, [fetchBoardcastData]);

  const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
  );

  const SkeletonBlock = ({ height = "h-32" }) => (
    <div className={`${height} bg-gray-200 rounded-2xl animate-pulse`} />
  );

  const formatDate = (value) => {
    if (!value) return "—";

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date)) return "—";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAudienceLabel = (record) => {
    switch (record.targetAudienceType) {
      case "ALL_USERS":
        return "ALL_USERS";
      case "ALL_MEMBERS":
        return "ALL_MEMBERS";
      case "ALL_FUND_MANAGERS":
        return "ALL_FUND_MANAGERS";
      case "SPECIFIC_USERS":
        return record.targetAudiences?.length
          ? record.targetAudiences.join(", ")
          : "Specific Users";
      case "SPECIFIC_GROUPS":
        return record.targetAudiences?.length
          ? record.targetAudiences.join(", ")
          : "Specific Groups";
      default:
        return "—";
    }
  };

  const handleAudienceChange = (value) => {
    setAudience(value);

    if (value === "Specific Groups") {
      setSelectedUsers([]);
    } else if (value === "Specific Users") {
      setSelectedGroups([]); // clear groups
    } else {
      // All Users / All Fund Managers / All Group Members
      setSelectedGroups([]);
      setSelectedUsers([]);
    }
  };

  const isAudienceValid =
    audience === "SPECIFIC_GROUPS"
      ? selectedGroups.length > 0
      : audience === "SPECIFIC_USERS"
        ? selectedUsers.length > 0
        : !!audience;

  const sendBoardcast = async () => {
    try {
      setSending(true);
      let targetAudiences = [];

      if (audience === "SPECIFIC_GROUPS") {
        targetAudiences = selectedGroups.map((g) => g.value);
      }

      if (audience === "SPECIFIC_USERS") {
        targetAudiences = selectedUsers.map((u) => u.value);
      }

      const deliveryChannels = [];
      if (pushChecked) deliveryChannels.push("PUSH");
      if (emailChecked) deliveryChannels.push("MAIL");

      const payload = {
        title,
        message: body,
        target_audience_type: audience,
        target_audiences: targetAudiences,
        delivery_channels: deliveryChannels,
      };

      await createBroadcast(payload);

      message.success("Broadcast sent successfully");

      // Optional: reset form
      setTitle("");
      setBody("");
      setSelectedGroups([]);
      setSelectedUsers([]);

      fetchBoardcastData();
    } catch (error) {
      console.error("Broadcast failed", error);
      message.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  const audienceOptions = [
    { value: "ALL_USERS", label: "All Users" },
    { value: "ALL_FUND_MANAGERS", label: "All Group Admins" },
    { value: "ALL_MEMBERS", label: "All Group Members" },
    { value: "SPECIFIC_GROUPS", label: "Specific Groups" },
    { value: "SPECIFIC_USERS", label: "Specific Users" },
  ];

  const panel = "bg-white rounded-2xl shadow-sm border border-slate-100 p-5";

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="relative">
        {!loading ? (
          <div className="flex items-center gap-5">
            <div className="w-[72px] h-[72px] rounded-full bg-sc-blue-100 flex items-center justify-center shrink-0">
              <Megaphone size={32} className="text-primary fill-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-sc-ink-900 tracking-tight">
                Broadcast
              </h1>
              <p className="hidden sm:block text-base text-slate-600 mt-0.5">
                Create and send announcements to users, groups or admins.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="w-[72px] h-[72px] rounded-full bg-gray-200 animate-pulse" />
            <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
          </div>
        )}
        <MegaphoneArt />
      </div>

      {/* Layout – Two Column */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* Target Audience */}
          {loading ? (
            <div className={`${panel} space-y-4`}>
              <SkeletonLine width="w-40" />
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </div>
          ) : (
            <div className={panel}>
              <PanelHeader
                icon={Users}
                title="Target Audience"
                subtitle="Choose who receives this broadcast"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 mt-5 px-1">
                {audienceOptions.map((opt) => (
                  <Radio
                    key={opt.value}
                    value={opt.value}
                    checked={audience === opt.value}
                    onChange={(e) => handleAudienceChange(e.target.value)}
                    className={`text-[15px] ${
                      audience === opt.value
                        ? "font-semibold text-sc-ink-900"
                        : "text-slate-700"
                    }`}>
                    {opt.label}
                  </Radio>
                ))}
              </div>

              {audience === "SPECIFIC_GROUPS" && (
                <RecipientPicker
                  label="Selected Groups"
                  placeholder="Select groups"
                  value={selectedGroups}
                  onChange={setSelectedGroups}
                  options={groupData}
                />
              )}
              {audience === "SPECIFIC_USERS" && (
                <RecipientPicker
                  label="Selected Users"
                  placeholder="Select users"
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  options={userData}
                />
              )}
            </div>
          )}

          {/* Delivery Channels */}
          {loading ? (
            <div className={`${panel} space-y-4`}>
              <SkeletonLine width="w-36" />
              <div className="flex gap-6">
                <SkeletonLine width="w-40" />
                <SkeletonLine width="w-40" />
              </div>
            </div>
          ) : (
            <div className={panel}>
              <PanelHeader
                icon={Send}
                title="Delivery Channels"
                subtitle="Select one or more channels"
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ChannelTile
                  checked={pushChecked}
                  onChange={(e) => setPushChecked(e.target.checked)}
                  icon={Bell}
                  iconWrap="bg-green-100 text-green-600"
                  title="Push Notification"
                  subtitle="Instant in-app delivery"
                />
                <ChannelTile
                  checked={emailChecked}
                  onChange={(e) => setEmailChecked(e.target.checked)}
                  icon={Mail}
                  iconWrap="bg-sc-blue-100 text-primary"
                  title="Email"
                  subtitle="Send to user inbox"
                />
              </div>
            </div>
          )}

          {/* Message Composer */}
          {loading ? (
            <div className={`${panel} space-y-4`}>
              <SkeletonLine width="w-48" />
              <SkeletonLine height="h-10" />
              <SkeletonBlock height="h-28" />
            </div>
          ) : (
            <div className={panel}>
              <PanelHeader
                icon={FileText}
                title="Message Composer"
                subtitle="Write a clear and concise message"
                right={
                  <span className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-sc-blue-100/70 px-3 py-2 text-sm font-medium text-primary shrink-0">
                    <Eye size={16} />
                    Preview on the right
                  </span>
                }
              />

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-sc-ink-900">
                      Title
                    </label>
                    <span className="text-xs text-slate-500">
                      {title.length}/100
                    </span>
                  </div>
                  <Input
                    placeholder="Enter broadcast title"
                    maxLength={100}
                    className="h-10 rounded-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-sc-ink-900 block mb-1.5">
                    Message Body
                  </label>
                  <div className="relative">
                    <Input.TextArea
                      rows={4}
                      maxLength={500}
                      placeholder="Enter your message here"
                      className="rounded-lg pb-6"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                    <span className="absolute right-3 bottom-2 text-xs text-slate-500 pointer-events-none">
                      {body.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Info size={16} className="text-white fill-primary shrink-0" />
                  Tip: Keep messages short and actionable.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setBody("");
                    }}
                    className="h-11 px-5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-sc-ink-900 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>

                  <button
                    disabled={!title || !body || !isAudienceValid || sending}
                    onClick={sendBoardcast}
                    className="h-11 px-5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm
                               hover:bg-sc-blue-700 transition-colors flex items-center gap-2
                               disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={16} className="fill-current" />
                    )}
                    {sending ? "Sending..." : "Send Broadcast"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel – History Table */}
        <div className="h-full">
          <div className={`${panel} h-full flex flex-col`}>
            <PanelHeader
              icon={Clock}
              title="Recent Broadcast History"
              right={
                <span className="text-xs text-slate-500 mt-1 shrink-0">
                  Showing latest first
                </span>
              }
            />

            <div className="mt-4 w-full flex-1">
              {tableLoading ? (
                <div className="space-y-3 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : history.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={history}
                  rowKey="id"
                  size="middle"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    position: ["bottomRight"],
                  }}
                  scroll={{ x: "max-content" }}
                  className="broadcast-table
                    [&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-sc-ink-900
                    [&_.ant-table-tbody>tr>td]:!py-3.5 [&_.ant-table-tbody>tr>td]:!text-sc-ink-900 [&_.ant-table-tbody>tr>td]:!border-slate-100
                    [&_.ant-pagination-item]:!border-0 [&_.ant-pagination-item]:!rounded-lg
                    [&_.ant-pagination-item-active]:!bg-primary [&_.ant-pagination-item-active_a]:!text-white"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-sc-blue-100 rounded-full flex items-center justify-center">
                    <Mail size={34} className="text-primary/60" />
                  </div>
                  <p className="mt-4 text-sc-ink-900 font-semibold">
                    No broadcasts yet
                  </p>
                  <p className="text-sm text-slate-500">
                    Compose a message on the left and press{" "}
                    <span className="font-semibold">Send Broadcast</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Auto-saved drafts and delivery receipts will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
