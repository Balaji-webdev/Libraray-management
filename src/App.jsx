import { Route, Routes } from "react-router-dom";
import Login from "./components/session/Login";
import Signin from "./components/session/sigin";
import NavBar from "./components/layout/navbar";
import BookList from "./components/views/booklist";
import BookListForm from "./components/views/booklistform.";
import React from "react";
import Author from "./components/views/author";
import ProtectedRoute from "./state-management/authGuard";
import ProfilePage from "./components/profile/ProfilePage";
import ChangePasswordPage from "./components/profile/ChangePasswordCard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="profile" element={<ProfilePage />} />
    <Route
  path="change-password"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <ChangePasswordPage />
    </ProtectedRoute>
  }
/>
      <Route
        path="/homepage"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian", "guest"]}>
            <NavBar />
          </ProtectedRoute>
        }
      >
        <Route index element={<BookList />} />
        <Route path="Book" element={<BookList />} />
        <Route
          path="Booklist/booklistform"
          element={
            <ProtectedRoute allowedRoles={["admin", "librarian"]}>
              <BookListForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="book/bookform/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "librarian"]}>
              <BookListForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="author"
          element={
            <ProtectedRoute allowedRoles={["admin", "librarian"]}>
              <Author />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
