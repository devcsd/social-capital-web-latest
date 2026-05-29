import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { getAllMemberPageId } from "../api/api";
import { useAuth } from "../Auth/AuthContext";
import EmptyState from "../AdminComponent/EmptyState";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredMembers = members.filter(
  (member) =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobileNumber?.includes(searchTerm)
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
              <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse">
                {/* Top Gradient Placeholder */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200" />

                {/* Profile Section */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-40 bg-gray-100 rounded mb-2" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-xl bg-gray-100 p-3">
                      <div className="h-3 w-12 bg-gray-200 rounded mx-auto mb-2" />
                      <div className="h-5 w-10 bg-gray-300 rounded mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState message="Oops! No members found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <pre>{JSON.stringify(members, null, 2)}</pre> */}
            {members.map((member) => (
              <div
                key={member.userId}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5"
              >
                {/* Top Accent */}
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
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                      {member.profileName || member.name?.charAt(0) || "M"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-base">
                      {member.name}
                    </h3>

                    <p className="text-xs text-gray-500 truncate">
                      {member.emailId}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <FaPhone className="inline-block mr-1" /> {member.mobileNumber||"NA"}
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

                {/* Footer */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100"></div>
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
