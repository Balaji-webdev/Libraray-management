import { Button, Field, Input, Label } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


export default function BookListForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const book = location.state?.book ?? null;
  const [bookform, setBookForm] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    isbn: book?.isbn ?? "",
    genre: book?.genre ?? "",
    copies: book?.copiesAvailable ?? "",
    country: book?.country ?? "",
  });
  const [error, setError] = useState({});

  // useEffect(() => {
  //   if (book) {
  //     setBookForm({
  //       title: book.title ?? "",
  //       author: book.author ?? "",
  //       isbn: book.isbn ?? "",
  //       genre: book.genre ?? "",
  //       copies: book.copiesAvailable ?? "",
  //       country: book.country ?? "",
  //     });
  //   }
  // }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const validForm = () => {
    let errors = {};

    if (bookform.title.trim() === "") {
      errors.title = "Title should not be empty";
    }
    if (bookform.author.trim() === "") {
      errors.author = "Author should not be empty";
    }
    if (bookform.isbn.trim() === "") {
      errors.isbn = "ISBN should not be empty";
    } else if (bookform.isbn.trim().length > 13) {
      errors.isbn = "ISBN cannot exceed 13 characters";
    }
    if (bookform.genre.trim() === "") {
      errors.genre = "Genre should not be empty";
    }
    if (!bookform.copies || bookform.copies.toString().trim() === "") {
      errors.copies = "Copies should not be empty";
    }
    if (bookform.country.trim() === "") {
      errors.country = "Country should not be empty";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validForm()) return;
    const payload = {
      title: bookform.title,
      author: bookform.author,
      isbn: bookform.isbn,
      genre: bookform.genre,
      copiesAvailable: bookform.copies,
      country: bookform.country,
    };

    if (book?.id || params.id) {
      const id = book?.id || params.id;
      const res = fetch(`http://localhost:3001/booklist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setTimeout(() => {
        navigate("/homepage/book");
      }, 1000);
      toast.success("Book updated successfully");
    } else {
      fetch("http://localhost:3001/booklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setTimeout(() => {
        navigate("/homepage/book");
      }, 1000);
      toast.success("Book created successfully");
    }

    setBookForm({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      copies: "",
      country: "",
    });
  };
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white text-slate-800 border border-slate-200 rounded-xl shadow-lg px-6 py-4 text-base",
          style: { fontSize: "1rem", height: "80px", width: "300px" },
          duration: 3000,
        }}
      />

      <div className="w-[1000px] m-auto mb-10 mt-[60px] rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 shadow-2xl p-12 transition-all duration-300">
        <div className="max-w-4xl mx-auto relative">
          <Link
            to={"/homepage/book"}
            className="group absolute -left-4 -top-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-lg "
          >
            Back to List
          </Link>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">
              {book || params?.id ? "Edit Book Details" : "Add New Book"}
            </h2>
            <p className="text-sm text-slate-500">
              {book || params?.id
                ? "Update the information for this book in the library catalog"
                : "Enter the details to add a new book to the library catalog"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <Field className="group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Book Title
                </Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter the complete title"
                  value={bookform.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.title && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.title}
                  </p>
                )}
              </Field>

              <Field className="group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Author Name
                </Label>
                <Input
                  type="text"
                  name="author"
                  placeholder="Full name of the author"
                  value={bookform.author}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.author && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.author}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <Field className="col-span-5 group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ISBN Number
                </Label>
                <Input
                  type="text"
                  name="isbn"
                  placeholder="Enter 13-digit ISBN"
                  value={bookform.isbn}
                  maxLength={13}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.isbn && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.isbn}
                  </p>
                )}
              </Field>

              <Field className="col-span-5 group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Genre
                </Label>
                <Input
                  type="text"
                  name="genre"
                  placeholder="e.g. Fiction, Mystery"
                  value={bookform.genre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.genre && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.genre}
                  </p>
                )}
              </Field>

              <Field className="col-span-2 group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Copies
                </Label>
                <Input
                  type="number"
                  name="copies"
                  min="0"
                  placeholder="copies "
                  value={bookform.copies}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.copies && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.copies}
                  </p>
                )}
              </Field>
            </div>
            <div>
              <Field className="col-span-2 group">
                <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Country
                </Label>
                <Input
                  type="text"
                  name="country"
                  min="0"
                  placeholder="country "
                  value={bookform.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 group-hover:border-indigo-300"
                />
                {error.country && (
                  <p className="mt-1.5 text-sm text-red-600 animate-slideIn">
                    {error.country}
                  </p>
                )}
              </Field>
            </div>

            <Button
              type="submit"
              className="w-full  mt-10 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {book || params?.id ? "Save Changes" : "Add to Library"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
