import React, { useEffect, useState, useCallback } from "react";
import { Card, Radio, Input, Checkbox, Button, Table, Tag } from "antd";
import { Select } from "antd";
import debounce from "lodash/debounce";
import { useAuth } from "../Auth/AuthContext";
import { getBoardcastMasterData, createBroadcast } from "../api/api";
import { message } from "antd";

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

  return (
    <div className="min-h-screen p-6 space-y-6 ">
      <div>
        {!loading ? (
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2 ">
                <h1 className="text-3xl font-bold text-slate-800">Broadcast</h1>
                <div className="hidden sm:block text-sm text-gray-600">
                  Create and send announcements to users, groups or managers.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
          </div>
        )}
      </div>

      {/* Layout – Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-2">
          {/* --- Target Audience panel (replace your existing panel) --- */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <SkeletonLine width="w-40" />
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Target Audience
                </h2>
                <div className="text-xs text-gray-400">
                  Choose who receives this
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {/* Simple radios */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  <Radio
                    value="ALL_USERS"
                    checked={audience === "ALL_USERS"}
                    onChange={(e) => handleAudienceChange(e.target.value)}>
                    All Users
                  </Radio>

                  <Radio
                    value="ALL_FUND_MANAGERS"
                    checked={audience === "ALL_FUND_MANAGERS"}
                    onChange={(e) => handleAudienceChange(e.target.value)}>
                    All Fund Managers
                  </Radio>

                  <Radio
                    value="ALL_MEMBERS"
                    checked={audience === "ALL_MEMBERS"}
                    onChange={(e) => handleAudienceChange(e.target.value)}>
                    All Group Members
                  </Radio>
                </div>

                {/* Specific Groups (Radio + Select inline) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Radio
                        value="SPECIFIC_GROUPS"
                        checked={audience === "SPECIFIC_GROUPS"}
                        onChange={(e) => handleAudienceChange(e.target.value)}>
                        Specific Groups
                      </Radio>
                    </div>

                    {audience === "SPECIFIC_GROUPS" && (
                      <Select
                        mode="multiple"
                        allowClear
                        labelInValue
                        placeholder="Select groups"
                        className="w-60"
                        value={selectedGroups}
                        onChange={setSelectedGroups}
                        optionFilterProp="label"
                        options={groupData}
                        maxTagPlaceholder={null}
                        maxTagCount={0}
                      />
                    )}
                  </div>
                  {selectedGroups.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-400 mb-1">
                        Selected Groups
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedGroups.map((g) => (
                          <Tag
                            key={g.value}
                            closable
                            onClose={(e) => {
                              e.preventDefault();
                              setSelectedGroups(
                                selectedGroups.filter(
                                  (s) => s.value !== g.value,
                                ),
                              );
                            }}>
                            {g.label}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Specific Users (Radio + Select inline) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Radio
                        value="SPECIFIC_USERS"
                        checked={audience === "SPECIFIC_USERS"}
                        onChange={(e) => handleAudienceChange(e.target.value)}>
                        Specific Users
                      </Radio>
                    </div>

                    {audience === "SPECIFIC_USERS" && (
                      <Select
                        mode="multiple"
                        allowClear
                        labelInValue
                        placeholder="Select users"
                        className="w-60"
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        optionFilterProp="label"
                        options={userData}
                        maxTagPlaceholder={null}
                        maxTagCount={0}
                      />
                    )}
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-400 mb-1">
                        Selected Groups
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((g) => (
                          <Tag
                            key={g.value}
                            closable
                            onClose={(e) => {
                              e.preventDefault();
                              setSelectedUsers(
                                selectedUsers.filter(
                                  (s) => s.value !== g.value,
                                ),
                              );
                            }}>
                            {g.label}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Channels */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <SkeletonLine width="w-36" />
              <div className="flex gap-6">
                <SkeletonLine width="w-40" />
                <SkeletonLine width="w-40" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Delivery Channels
                </h2>
                <div className="text-xs text-gray-400">
                  Multi-channel support
                </div>
              </div>

              {/* Horizontal options */}
              <div className="mt-4 flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <Checkbox
                    checked={pushChecked}
                    onChange={(e) => setPushChecked(e.target.checked)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Push Notification
                    </span>
                    <span className="text-xs text-gray-400">
                      Instant in-app delivery
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <Checkbox
                    checked={emailChecked}
                    onChange={(e) => setEmailChecked(e.target.checked)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Email</span>
                    <span className="text-xs text-gray-400">
                      Send to user inbox
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Message Composer */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <SkeletonLine width="w-48" />
              <SkeletonLine height="h-10" />
              <SkeletonBlock height="h-28" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Message Composer
                </h2>
                <div className="text-xs text-gray-400">
                  Preview on the right after send
                </div>
              </div>

              <div className="mt-3 space-y-4">
                <div>
                  <label className="text-sm font-medium block">Title</label>
                  <Input
                    placeholder="Enter broadcast title"
                    className="mt-1 rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block">
                    Message Body
                  </label>
                  <Input.TextArea
                    rows={6}
                    placeholder="Enter your message here"
                    className="mt-1 rounded-md"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-3 mt-5">
                <div className="text-sm text-gray-500">
                  Tip: Keep messages short and actionable.
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      setTitle("");
                      setBody("");
                    }}>
                    Cancel
                  </Button>

                  <button
                    disabled={!title || !body || !isAudienceValid || sending}
                    onClick={sendBoardcast}
                    className={`
    transform transition-all shadow-md p-2 rounded-md
    hover:scale-105
    bg-primary text-white
    hover:bg-primary-hover
    disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
    border-none
    flex items-center gap-2
  `}>
                    {sending && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {sending ? "Sending..." : "Send Broadcast"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel – History Table */}
        <div className="space-y-6 h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Recent Broadcast History
              </h2>
              <div className="text-xs text-gray-400">Showing latest first</div>
            </div>

            <div className="mt-4 h-full w-full flex-1">
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
                  className="broadcast-table"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center shadow-inner">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">
                    No broadcasts yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Compose a message on the left and press{" "}
                    <span className="font-semibold">Send Broadcast</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Auto-saved drafts and delivery receipts will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
