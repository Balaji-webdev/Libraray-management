import React, { useEffect, useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Paginator from "../../utils/pagination";
import { Link, Outlet } from "react-router-dom";
import Dialogs from "../../utils/dialog";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useDataFetch } from "../../hooks/useDataFetch";
import { useDebounce } from "../../hooks/useBounce";
import { AiOutlineSortAscending } from "react-icons/ai";
import { TbSortDescendingLetters } from "react-icons/tb";

export default function BookList() {
  const [sort, setSort] = useState({ key: "", direction: "" });
  const [pagedBooks, setPagedBooks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useSelector((state) => state.auth);


  const itemsPerPage = 20;

  const { books, error, setBooks,} = useDataFetch(
    "https://libraray-management-4ikn.onrender.com/booklist",20
  );

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDialogOpen(true);
  };

  const debouncedValue = useDebounce(inputValue, 500);

  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    handleDelete(bookToDelete.id);
    setDialogOpen(false);
    setBookToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://libraray-management-4ikn.onrender.com/booklist/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setBooks((prev) => prev.filter((book) => book.id != id));
      toast.success("Data Successfully Deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sort.key === key && sort.direction === "asc") direction = "desc";
    setSort({ key, direction });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue, sort]);

  const filterData = useMemo(() => {
    const q = (debouncedValue || "").toLowerCase().trim();
    let filtered = books.filter((book) => {
      const title = (book.title || "").toString().toLowerCase();
      const author = (book.author || "").toString().toLowerCase();
      const genre = (book.genre || "").toString().toLowerCase();
      return title.includes(q) || author.includes(q) || genre.includes(q);
    });

    if (sort.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sort.key] ?? "";
        const bValue = b[sort.key] ?? "";

        if (sort.key === "isbn" || sort.key === "copiesAvailable") {
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
  }, [filterData, currentPage,itemsPerPage]);


  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white text-slate-800 border border-slate-200 rounded-xl shadow-lg px-6 py-4 text-base ",
          style: { fontSize: "1rem", height: "80px", width: "300px" },
        }}
      />
      <div className="bg-white rounded-xl h-[640px]  w-[1450px] ml-10">
        <h1 className="text-3xl font-bold p-4">BookList</h1>
        <div className="flex justify-evenly items-center">
          <div className="mr-230 mb-7 relative">
            <input
              type="text"
              placeholder="Search books"
              value={inputValue}
              onChange={handleChange}
              className="mt-2 block w-90 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <CiSearch className="absolute top-5 left-80 text-xl" />
          </div>
          <div className="mb-7">
            <Link
              to={"/homepage/booklist/booklistform"}
              className="w-full mt-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Create
            </Link>
          </div>
        </div>

        <div className="ml-5 relative overflow-x-auto shadow-lg sm:rounded-lg border mr-6 border-gray-100">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">No</th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Title</span>
                      <FiFilter className="text-gray-500 text-lg" />
                      {sort.key === "title" &&
                        (sort.direction === "asc" ? (
                          <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                        ) : (
                          <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Author</span>
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
                    onClick={() => handleSort("isbn")}
                  >
                    <div className="flex items-center gap-2">
                      <span>ISBN</span>
                      <FiFilter className="text-gray-500 text-lg" />
                      {sort.key === "isbn" &&
                        (sort.direction === "asc" ? (
                          <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                        ) : (
                          <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("genre")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Genre</span>
                      <FiFilter className="text-gray-500 text-lg" />
                      {sort.key === "genre" &&
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
                      <span>Copies Available</span>
                      <FiFilter className="text-gray-500 text-lg" />
                      {sort.key === "copiesAvailable" &&
                        (sort.direction === "asc" ? (
                          <AiOutlineSortAscending className="text-blue-600 text-2xl" />
                        ) : (
                          <TbSortDescendingLetters className="text-blue-600 text-2xl" />
                        ))}
                    </div>
                  </th>

                  {(user.role === "admin" || user.role === "librarian") && (
                    <th className="py3 px3 text-center">
                      <span>Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pagedBooks.map((book, index) => (
                  <tr
                    key={book.id}
                    className={`text-gray-900 border-b border-b-blue-50 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {book.title}
                    </th>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.isbn}</td>
                    <td className="px-6 py-4">{book.genre}</td>
                    <td className="px-6 py-4">{book.copiesAvailable}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {(user.role === "admin" || user.role === "librarian") && (
                        <Link
                          to={`/homepage/book/bookform/${book.id}`}
                          state={{ book }}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Dialogs
            isOpen={dialogOpen}
            isClose={() => {
              setDialogOpen(false);
              setBookToDelete(null);
            }}
            onconfirm={handleConfirmDelete}
            title="Confirm Delete"
            description={`Are you sure you want to delete "${bookToDelete?.title}"?`}
          />
        </div>
  

        <Paginator
          data={filterData}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Outlet />
      </div>
    </>
  );
}
