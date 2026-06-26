import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupByTypeId, postGroupActivity } from "../api/api";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import EmptyState from "../AdminComponent/EmptyState";
import PauseGroupCard from "../AdminComponent/PauseResumeForm";
import { IoWarningOutline, IoPlayOutline } from "react-icons/io5";

export const GroupDetails = () => {
  const { typeId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [GrpDet, setGrpDet] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openPauseModal, setOpenPauseModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const navigate = useNavigate();

  const fetchGroupDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupByTypeId(typeId);
      const data = response.data;

      setSelectedCategory(data);
      setGrpDet(data?.data?.groups || []);
    } catch (err) {
      console.error("Error fetching group details:", err);
    } finally {
      setLoading(false);
    }
  }, [typeId]);

  useEffect(() => {
    if (!typeId) return;
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* ... your skeleton markup (unchanged) ... */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-8 w-32 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="flex flex-wrap gap-6">
            <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl shadow-lg border border-gray-200 animate-pulse space-y-4 h-60">
              {/* ... */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Close modal helper (clears selected fund)
  const closePauseModal = () => {
    setOpenPauseModal(false);
    setSelectedFund(null);
  };

  const handleConfirm = async (reason) => {
    const groupId =
      selectedFund?.groupId ?? selectedFund?.id ?? selectedFund?.group_id;

    if (!groupId) {
      setStatusMessage("Group ID missing. Cannot proceed.");
      setStatusType("error");
      return false;
    }

    const actionType = selectedFund?.isPause ? "resumed" : "paused";
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
        setTimeout(async () => {
          await fetchGroupDetails();
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

  return (
    <div className="p-6 ">
      {/* Back */}
      <div className="fixed flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-4 cursor-pointer">
          <ArrowLeftOutlined />
          Back
        </button>
      </div>

      {/* {selectedCategory?.data ? (
        <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg">
          <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-sm text-green-300">
            {JSON.stringify(selectedCategory.data, null, 2)}
          </pre>
        </div>
      ) : null} */}

      {/* Category Header */}
      <div className="mb-8 mt-10">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {selectedCategory?.data?.fundType ? (
            selectedCategory.data.fundType
          ) : (
            <span className="text-gray-400 italic">Group name unavailable</span>
          )}
        </h2>

        <div className="flex flex-wrap gap-6 text-gray-600">
          <p className="bg-gray-100 px-3 py-1 rounded-md shadow-sm">
            📊 Total Groups:{" "}
            <span className="font-semibold">
              {selectedCategory?.data?.totalGroups ?? (
                <span className="text-gray-400 italic">Not available</span>
              )}
            </span>
          </p>

          <p className="bg-gray-100 px-3 py-1 rounded-md shadow-sm">
            💰 Group Amount:{" "}
            <span className="font-semibold">
              {selectedCategory?.data?.totalFundAmount ? (
                selectedCategory.data.totalFundAmount.toLocaleString("en-IN")
              ) : (
                <span className="text-gray-400 italic">No Group data</span>
              )}
            </span>
          </p>
        </div>
      </div>

      {GrpDet.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {GrpDet.map((fund) => {
            return (
              <div
                key={fund.groupId}
                onClick={() =>
                  navigate(`/adminPanel/GroupData/${fund.groupId}`)
                }
                className="cursor-pointer w-full max-w-md rounded-2xl p-5 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {fund.fundManager.profileImage ? (
                      <img
                        src={fund.fundManager.profileImage}
                        alt="Admin"
                        className="w-10 h-10 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-white flex items-center justify-center">
                        <p>{fund.fundManager.profileName}</p>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-800">
                        {fund.fundManager.name}
                      </p>
                      <p className="text-sm text-gray-500">Admin</p>
                    </div>
                  </div>

                  <div className="bg-secondary text-primary px-4 py-1 rounded-lg font-semibold text-sm shadow">
                    {fund.totalFundAmount.toLocaleString()}
                  </div>

                  {/* Pause / Resume */}
                  <button
                    className={`px-4 py-1 rounded-lg font-semibold text-sm shadow cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                      fund.isPause
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click navigation
                      setSelectedFund(fund);
                      setOpenPauseModal(true);
                    }}>
                    {fund.isPause ? (
                      <CiPlay1 size={20} />
                    ) : (
                      <CiPause1 size={20} />
                    )}
                  </button>
                </div>

                {/* Group Info */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="bg-[#F6F5FF] p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-primary">
                      Frequency:
                    </span>{" "}
                    {fund.frequency}
                  </div>
                  <div className="bg-[#F6F5FF] p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-primary">
                      Group Type:
                    </span>{" "}
                    {fund.groupType}
                  </div>
                  <div className="bg-[#F6F5FF] p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-primary">Rounds:</span>{" "}
                    {fund.totalRounds}
                  </div>
                  <div className="bg-[#F6F5FF] p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-primary">
                      Transaction:
                    </span>{" "}
                    {fund.fundDistributionType ===
                    "Member → Group Manager → Winner"
                      ? "Member → Manager → Winner"
                      : "Member → Winner"}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${
                          (fund.completedRounds / fund.totalRounds) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState message="Oops! No groups are created by this Group type." />
      )}

      {/* Modal popup (renders once) */}
      {openPauseModal && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePauseModal}
          />

          <div className="relative z-10 w-full max-w-lg">
            <PauseGroupCard
              initialGroupName={selectedFund.groupName}
              onCancel={closePauseModal}
              onConfirm={handleConfirm}
              statusMessage={statusMessage}
              statusType={statusType}
              isSubmitting={isSubmitting} // <-- new
              title={selectedFund.isPause ? "Resume Group" : "Pause Group"}
              subtitle={
                selectedFund.isPause
                  ? "This will restore all transactions and resume rounds for this group."
                  : "This action will temporarily pause all transactions and rounds for this group."
              }
              icon={selectedFund.isPause ? IoPlayOutline : IoWarningOutline}
              warning={
                selectedFund.isPause
                  ? "Resuming will restore all group activities and send notifications to members."
                  : "Pausing will suspend all payments, rounds, and member transactions for the group until resumed."
              }
              warningColor={selectedFund.isPause ? "resume" : "pause"}
              buttonTitle={
                selectedFund.isPause ? "Confirm Resume" : "Confirm Pause"
              }
              buttonColor={selectedFund.isPause ? "resume" : "pause"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
