// components/layout/NavBar.jsx
//
// Same structure, styling, and behavior as your existing NavBar.
// ONLY CHANGE: added a profile avatar button in the right-side cluster
// (between the "Welcome, username" text and the Logout button) that
// links to /homepage/profile and shows the live profileImage from
// profileSlice. Everything else — logout, nav links, header styling — untouched.

import { useEffect } from "react";
import logoImg from "../../../public/assets/favicon-32x32.png";
import defaultAvatar from "../../../public/assets/default-avatar.svg";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../state-management/authSlice";
import { fetchProfile } from "../../state-management/profileSlice";

export default function NavBar() {
  const { user } = useSelector((state) => state.auth);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = user.username;

  // Fetch the profile image once on app load so it's available for the
  // avatar without waiting for the user to visit the Profile page.
  useEffect(() => {
    if (user?.id && !profile) {
      dispatch(fetchProfile(user.id));
    }
  }, [user?.id, profile, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const linkClass = ({ isActive }) =>
    `inline-block rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 ${
      isActive ? "bg-blue-100 text-blue-600" : "text-gray-900 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-5 shrink-0">
              <a aria-current="page" className="flex items-center" onClick={handleLogout}>
                <img className="h-7 w-auto" src={logoImg} alt="" />
              </a>
              <h2 className="text-gray-900 font-bold">Librio</h2>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center md:gap-10">
              <NavLink aria-current="page" className={linkClass} to="/homepage/author">
                Authors
              </NavLink>

              <NavLink to="/homepage/Book" className={linkClass}>
                Books
              </NavLink>
            </div>
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Welcome,
                  <span className="text-blue-600 font-semibold">
                    {user?.username || "User"}
                  </span>
                </span>
              </div>

              {/* NEW: profile avatar — links to /homepage/profile */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                aria-label="Go to profile"
                className="rounded-full focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <img
                  src={profile?.profileImage || defaultAvatar}
                  alt="Your profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mt-32">
        <Outlet />
      </main>
    </>
  );
}
