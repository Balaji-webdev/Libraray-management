import React, { useEffect, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { FiFilter } from "react-icons/fi";
import Paginator from "../../utils/pagination";
import { useDataFetch } from "../../hooks/useDataFetch";
import { useDebounce } from "../../hooks/useBounce";
import { AiOutlineSortAscending } from "react-icons/ai";
import { TbSortDescendingLetters } from "react-icons/tb";

export default function Author() {
  const [search, setSearch] = useState("");
  const [pagedBooks, setPagedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ key: null, direction: "asc" });

  const itemsPerPage = 20;

  const debouncedValue = useDebounce(search, 500);

  const { books } = useDataFetch("http://localhost:3000/booklist");

  const handleChange = (e) => setSearch(e.target.value);

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue, sort]);

  const filterData = useMemo(() => {
    const q = (debouncedValue || "").toLowerCase().trim();

    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
    );

    if (sort.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sort.key] ?? "";
        const bValue = b[sort.key] ?? "";

         if (sort.key === "copiesAvailable") {
      const numA = Number(aValue);
      const numB = Number(bValue);
      return sort.direction === "asc" ? numA - numB : numB - numA;
    }

    
    return sort.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
    }

    return filtered;
  }, [books, debouncedValue, sort]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPagedBooks(filterData.slice(startIndex, endIndex));
  }, [filterData, currentPage, itemsPerPage]);

  return (
    <div className="bg-white rounded-xl h-[640px] w-[1450px] ml-10 ">
      <h1 className="text-3xl font-bold p-4">Author</h1>

      <div className="flex justify-evenly items-center mb-7">
        <div className="relative mr-230">
          <input
            type="text"
            placeholder="Search books"
            onChange={handleChange}
            value={search}
            className="mt-2 block w-90 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <CiSearch className="absolute top-5 left-80 text-xl" />
        </div>
      </div>

      <div className="ml-5 relative overflow-x-auto shadow-lg sm:rounded-lg border mr-6 border-gray-200">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">No</th>

                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("author")}
                >
                  <div className="flex items-center gap-2">
                    <span>Author Name</span>
                    <FiFilter className="text-gray-500 text-lg" />
                    {sort.key === "author" &&
                      (sort.direction === "asc" ? (
                        <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                      ) : (
                        <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                      ))}
                  </div>
                </th>

                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("copiesAvailable")}
                >
                  <div className="flex items-center gap-2">
                    <span>Book Count</span>
                    <FiFilter className="text-gray-500 text-lg" />
                    {sort.key === "copiesAvailable" &&
                      (sort.direction === "asc" ? (
                        <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                      ) : (
                        <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                      ))}
                  </div>
                </th>

                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("country")}
                >
                  <div className="flex items-center gap-2">
                    <span>Country</span>
                    <FiFilter className="text-gray-500 text-lg" />
                    {sort.key === "country" &&
                      (sort.direction === "asc" ? (
                        <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                      ) : (
                        <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedBooks.map((author, index) => (
                <tr
                  key={index}
                  className={`text-gray-900 border-b border-b-blue-50 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">{author.author}</td>
                  <td className="px-6 py-4">{author.copiesAvailable}</td>
                  <td className="px-6 py-4">{author.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Paginator
        data={filterData}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
