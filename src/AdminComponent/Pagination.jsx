const ManualPagination = ({ total, pageSize, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-10">
      {/* PREV */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className={`px-3 py-1.5 rounded-md text-sm transition ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-hover"
        }`}>
        Prev
      </button>

      {/* PAGE INFO */}
      <span className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-slate-700">
        Page <span className="text-primary font-semibold">{currentPage}</span>{" "}
        of <span className="font-semibold">{totalPages}</span>
      </span>

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className={`px-3 py-1.5 rounded-md text-sm transition ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-hover"
        }`}>
        Next
      </button>
    </div>
  );
};

export default ManualPagination;
