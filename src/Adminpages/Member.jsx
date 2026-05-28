import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllMemberPageId } from "../api/api";
import { useAuth } from "../Auth/AuthContext";
import EmptyState from "../AdminComponent/EmptyState";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await getAllMemberPageId(pageNumber);
      const data = response.data.data;
      setMembers(data.members || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow p-4 animate-pulse flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div className="flex flex-col gap-1">
            <div className="w-24 h-4 bg-gray-300 rounded" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-12 h-5 bg-gray-300 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs md:text-sm mt-3">
        <div className="bg-gray-200 h-12 rounded-md" />
        <div className="bg-gray-200 h-12 rounded-md" />
        <div className="bg-gray-200 h-12 rounded-md col-span-2" />
      </div>
    </div>
  );

  return (
    <div className="h-[96vh]  p-2 md:p-6 flex flex-col">
      {/* Header */}
      {!loading ? (
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-primary">Members Overview</h1>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
        </div>
      )}
      {/* <div>
        {members ? (
          <pre>{JSON.stringify(members, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div> */}
      {/* Members Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm h-44 animate-pulse">
                {/* Top: Avatar + Name */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="w-28 h-4 bg-gray-300 rounded" />
                    <div className="w-36 h-3 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Middle: Stats */}
                <div className="flex justify-between text-xs my-3">
                  <div className="flex flex-col gap-1">
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                    <div className="w-8 h-4 bg-gray-300 rounded" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="w-14 h-3 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-300 rounded" />
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex justify-between items-center text-xs pt-2 border-t">
                  <div className="w-24 h-3 bg-gray-200 rounded" />
                  <div className="w-20 h-5 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState message="Oops! No members found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition h-44">
                {/* Top: Avatar + Name */}
                <div className="flex items-center gap-3 mb-2">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold uppercase">
                      {member.profileName || member.name?.charAt(0) || "M"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.emailId}
                    </p>
                  </div>
                </div>

                {/* Middle: Stats */}
                <div className="flex justify-between text-xs my-3">
                  <div>
                    <p className="text-gray-500">Groups</p>
                    <p className="font-semibold text-primary">
                      {member.participateGroup || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Pending</p>
                    <p className="font-semibold text-green-700">
                      ₹{member.pendingDueAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex justify-between items-center text-xs pt-2 border-t">
                  <span className="text-gray-600">
                    mobile: {member.mobileNumber || "N/A"}
                  </span>

                  <span className="bg-secondary text-gray-900 font-bold px-2 py-1 rounded">
                    Paid: ₹{member.completedDueAmount?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center relative mt-6 gap-3 flex-shrink-0">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}>
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
            }`}>
            Next <FaChevronRight />
          </button>
        </div>
      )}

      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default Members;
