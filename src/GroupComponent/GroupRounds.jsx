import React, { useState, useEffect, useCallback } from "react";
import { getGroupDataById, postGroupActivity } from "../api/api";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import Upcoming from "../images/upcoming.png";
import Live from "../images/live.png";
import EmptyState from "../AdminComponent/EmptyState";
import PauseGroupCard from "../AdminComponent/PauseResumeForm";
import { IoWarningOutline, IoPlayOutline } from "react-icons/io5";
import { message } from "antd";

export const GroupRounds = () => {
  const { groupId } = useParams();
  const [groupRound, setGroupRound] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // modal state
  const [openPauseModal, setOpenPauseModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const fetchGroupData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupDataById(groupId);
      const data = response.data;
      setGroupRound(data.data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      message.error("Unable to fetch group details.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchGroupData();
  }, [fetchGroupData]);

  const progressPercent = groupRound
    ? Math.min(
        (groupRound.completedRounds / groupRound.rounds.length) * 100,
        100
      )
    : 0;

  // Close modal helper (clears selected fund)
  const closePauseModal = () => {
    setOpenPauseModal(false);
    setSelectedFund(null);
  };

  // Parent handler: child sends only reason (string)
  const handleConfirm = async (reason) => {
    if (!groupId) {
      setStatusMessage("Group ID missing. Cannot proceed.");
      setStatusType("error");
      return false;
    }

    const actionType = groupRound?.isPause ? "resumed" : "paused";
    const payload = { groupId, reason, actionType };

    setIsSubmitting(true);
    try {
      const res = await postGroupActivity(payload);

      if (res?.status === 200) {
        setStatusMessage(
          actionType === "resumed"
            ? "Group resumed successfully."
            : "Group paused successfully."
        );
        setStatusType("success");

        // close modal, then refresh page so the UI shows updated data
        closePauseModal();

        // short delay so the modal close animation & success message can appear briefly
        setTimeout(async () => {
          await fetchGroupData();
        }, 600);

        return true;
      } else {
        setStatusMessage("Unexpected server response. Try again.");
        setStatusType("error");
        return false;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong.";
      setStatusMessage(msg);
      setStatusType("error");
      return false;
    } finally {
      // only matters if we do not reload; helpful for error cases
      setIsSubmitting(false);
    }
  };

  // Status pill + Action button UI (unchanged)
  const StatusPill = ({ isPause }) => (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-sm select-none ${
        isPause
          ? "bg-red-50 text-red-700 border border-red-100"
          : "bg-green-50 text-green-700 border border-green-100"
      }`}
      aria-hidden>
      {isPause ? (
        <span className="flex items-center gap-2">
          <CiPlay1 className="w-4 h-4" /> Paused
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <IoPlayOutline className="w-4 h-4" /> Active
        </span>
      )}
    </div>
  );

  const ActionButton = ({ isPause }) => (
    <button
      onClick={() => setOpenPauseModal(true)}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold shadow transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isPause ? "bg-primary text-white" : "bg-secondary text-white"
      }`}>
      {isPause ? (
        <>
          <CiPlay1 size={18} />
          <span>Resume Group</span>
        </>
      ) : (
        <>
          <CiPause1 size={18} />
          <span>Pause Group</span>
        </>
      )}
    </button>
  );

  return (
    <div className="p-6 overflow-auto scrollbar-hide">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-4 cursor-pointer">
        <ArrowLeftOutlined />
       Back to Groups 
      </button>

      {/* <div>
        {groupRound ? (
          <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg">
            <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-sm text-green-300">
              {JSON.stringify(groupRound, null, 2)}
            </pre>
          </div>
        ) : null}
      </div> */}

      {loading ? (
        <div className="space-y-6">{/* existing skeleton UI kept as-is */}</div>
      ) : !groupRound ? (
        <EmptyState message="No members have joined this group yet." />
      ) : (
        <>
          {/* Members Section */}
          <div className="mb-6 mt-10">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <div className="hidden sm:flex items-center gap-3">
                <StatusPill isPause={!!groupRound?.isPause} />
                <div className="text-xs text-gray-400">
                  {groupRound?.isPause
                    ? "Group is currently paused"
                    : "Group is running"}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div className="sm:hidden">
                  <StatusPill isPause={!!groupRound?.isPause} />
                </div>

                <ActionButton isPause={!!groupRound?.isPause} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-primary mb-4">Members</h3>

            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {groupRound?.members?.map((m) => (
                <div
                  key={m.userId}
                  className="flex flex-col items-center p-4 rounded-xl border border-secondary bg-gradient-to-b from-[#fff8e1] to-[#fff] min-w-[120px] shadow-sm">
                  {m.profileImage ? (
                    <img
                      src={m.profileImage}
                      alt={m.name}
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-white flex items-center justify-center font-semibold">
                      {m.profileName}
                    </div>
                  )}
                  <p className="mt-2 font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.emailId}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-primary">
                {groupRound.completedRounds}/{groupRound.rounds.length} Rounds
                Completed
              </p>
              <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden shadow-inner">
                <div
                  className="h-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rounds Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary mb-3">
              Group Rounds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupRound?.rounds?.map((val) => {
                const isWinner = val?.status === "completed" && val?.winner;
                const isLive = val?.status === "live";

                return (
                  <div
                    key={val.roundNumber}
                    className={`p-5 rounded-2xl shadow-md text-center relative overflow-hidden transition transform hover:scale-[1.02] ${
                      isWinner
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : isLive
                        ? "bg-gradient-to-r from-secondary/20 to-primary/10 border border-primary/40"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}>
                    <p className="font-bold text-lg">Round {val.roundNumber}</p>

                    {isWinner && val?.winner && (
                      <>
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white text-primary text-xs font-bold px-2 py-1 rounded-full shadow">
                          🏆 Winner
                        </div>

                        <div className="flex flex-col items-center mt-4">
                          {val.winner.profileImage ? (
                            <img
                              src={val.winner.profileImage}
                              alt={val.winner.name}
                              className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center text-lg font-semibold border-2 border-white shadow-lg">
                              {val.winner.profileName}
                            </div>
                          )}
                          <p className="mt-2 font-semibold text-lg">
                            {val.winner.name}
                          </p>
                          <p className="text-xs opacity-80">
                            {val.winner.emailId}
                          </p>
                        </div>
                      </>
                    )}

                    {isLive && (
                      <div className="flex flex-col items-center mt-4">
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#e60000] text-white text-xs font-bold px-2 py-1 rounded-full shadow animate-pulse">
                          🔴 Live Now
                        </div>

                        <img
                          src={Live}
                          alt="Live Round"
                          className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                        />

                        <p className="mt-3 font-semibold text-primary text-lg">
                          Round in Progress
                        </p>
                        <p className="text-xs text-gray-600 italic">
                          Stay tuned for results!
                        </p>
                      </div>
                    )}

                    {!isWinner && !isLive && (
                      <div className="flex flex-col items-center mt-4">
                        <img
                          src={Upcoming}
                          alt="Upcoming Round"
                          className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-lg opacity-80"
                        />
                        <p className="mt-2 font-semibold text-gray-500">
                          Upcoming
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Modal popup (renders once) */}
      {openPauseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePauseModal}
          />

          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <div className="w-full max-w-lg">
              <PauseGroupCard
                initialGroupName={groupRound?.groupName || ""}
                onCancel={closePauseModal}
                onConfirm={handleConfirm} // child sends reason string
                isPause={!!groupRound?.isPause}
                statusMessage={statusMessage}
                statusType={statusType}
                isSubmitting={isSubmitting}
                title={groupRound?.isPause ? "Resume Group" : "Pause Group"}
                icon={groupRound?.isPause ? IoPlayOutline : IoWarningOutline}
                subtitle={
                  groupRound?.isPause
                    ? "This will restore all transactions and resume rounds for this group."
                    : "This action will temporarily pause all transactions and rounds for this group."
                }
                warning={
                  groupRound?.isPause
                    ? "Resuming will restore all group activities and send notifications to members."
                    : "Pausing will suspend all payments, rounds, and member transactions for the group until resumed."
                }
                warningColor={groupRound?.isPause ? "resume" : "pause"}
                buttonTitle={
                  groupRound?.isPause ? "Confirm Resume" : "Confirm Pause"
                }
                buttonColor={groupRound?.isPause ? "resume" : "pause"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupRounds;
