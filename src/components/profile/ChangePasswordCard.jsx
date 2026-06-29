

import { useState } from "react";
import { Button } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PasswordField from "./PasswordField";
import { updatePassword } from "../../state-management/profileSlice";

export default function ChangePasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: profile } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    currentPassword:  "", 
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    console.log(profile);
    
  };

  const validate = () => {
    const errs = {};
    if (!form.newPassword || form.newPassword.length < 8) {
      errs.newPassword = "New password must be at least 8 characters.";
    }
    if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await dispatch(
      updatePassword({
        userId: user.id,
        currentPassword: form.currentPassword, 
        newPassword: form.newPassword,
      })
    );
    setSubmitting(false);

    if (updatePassword.fulfilled.match(result)) {
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/homepage"), 1200);
    } else {
      toast.error(result.payload || "Failed to update password.");
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 max-w-md mx-auto mt-10">
      <Toaster position="top-right" />

      <div className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-lg p-6 md:p-8 shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to profile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordField
            id="currentPassword"
            name="currentPassword"
            label="Current password"
            placeholder='Enter Your Current Password'
            value={form.currentPassword}
            onChange={() => {}}
          />
          <PasswordField
            id="newPassword"
            name="newPassword"
            label="New password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            error={errors.newPassword}
          />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}