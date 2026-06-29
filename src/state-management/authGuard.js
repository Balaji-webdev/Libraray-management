import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, auth } = useSelector((state) => state.auth);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4">
            Unauthorized Access
          </h1>
          <p className="text-gray-700 mb-6">
            Sorry, you don’t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
