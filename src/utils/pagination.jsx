export default function Paginator({
  data,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) {
   const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

 
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);


  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors
            ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed bg-white border-gray-200"
                : "text-sky-600 border-sky-300 bg-sky-50 hover:bg-sky-100"
            }`}
        >
          Prev
        </button>
              <span className="text-base font-semibold text-sky-600 mb-3 mt-2">
                {startIndex} - {endIndex} of {totalItems}
              </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors
            ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed bg-white border-gray-200"
                : "text-sky-600 border-sky-300 bg-sky-50 hover:bg-sky-100"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
