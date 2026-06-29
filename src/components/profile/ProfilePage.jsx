

import { useEffect, useState } from "react";
import { Field, Input, Label } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "./ProfileImageUpolad";
import PasswordField from "./PasswordField";
import ProfileSkeleton from "./ProfileSkeleton";
import { fetchProfile, saveProfile } from "../../state-management/profileSlice";
import { syncIdentity } from "../../state-management/authSlice";

const ROLE_OPTIONS = ["admin", "librarian", "guest"];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: profile, status, error, saving, saveError } = useSelector(
    (state) => state.profile
  );

  const [form, setForm] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        email: profile.email || "",
        phone: profile.phone || "",
        username: profile.username || "",
        role: profile.role || "guest",
      });
    }
  }, [profile]);

  const isAdmin = user?.role === "admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    console.log(profile);

  };

  const validate = () => {
    const errs = {};
    if (!form.username?.trim()) errs.username = "Username is required.";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      errs.phone = "Enter a valid 10-digit phone number.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const changes = {};
    if (form.username !== profile.username) changes.username = form.username;
    if (form.email !== profile.email) changes.email = form.email;
    if (form.phone !== profile.phone) changes.phone = form.phone;
    if (isAdmin && form.role !== profile.role) changes.role = form.role;
    if (pendingImage) changes.profileImage = pendingImage;

    if (Object.keys(changes).length === 0) {
      toast("No changes to save.");
      return;
    }

    const result = await dispatch(saveProfile({ userId: user.id, changes }));

    if (saveProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setPendingImage(null);
      navigate("/homepage")
      dispatch(
        syncIdentity({
          username: result.payload.username,
          role: result.payload.role,
        })
      );
    } else {
      toast.error(result.payload || "Failed to update profile.");
    }
  };

  if (status === "loading" || !form) {
    return <ProfileSkeleton />;
  }

  if (status === "failed") {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-100 bg-white/80 p-6 shadow">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 max-w-5xl mx-auto mt-25">
      <Toaster position="top-right" />

      <div className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-lg p-6 md:p-10 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center md:text-left">
          Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
            <div className="flex flex-col items-center">
              <ProfileImageUpload
                currentImage={profile.profileImage}
                onImageReady={(img) => setPendingImage(img)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 content-start">
              <Field className="sm:col-span-2">
                <Label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </Field>

              <Field>
                <Label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </Field>

              <Field className="sm:col-span-2">
                <Label htmlFor="role" className="block text-sm font-medium text-slate-700">
                  Role
                </Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  aria-disabled={!isAdmin}
                  className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed sm:max-w-xs"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                {!isAdmin && (
                  <p className="mt-1 text-xs text-slate-500">Only admins can change roles.</p>
                )}
              </Field>

              <Field className="sm:col-span-2">
                {
                  isAdmin ?
                    <PasswordField
                      id="password"
                      name="password"
                      label="Password"
                      value={profile.confirmPassword || ""}
                      onChange={() => { }}
                      disabled
                      canToggle={isAdmin}
                    />
                    : null
                }

                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => navigate("/change-password")}
                    className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Change password
                  </button>
                ) : (
                  null
                )}
              </Field>

              {saveError && (
                <p className="sm:col-span-2 text-sm text-red-600">{saveError}</p>
              )}

              <div className="sm:col-span-2 flex justify-center md:justify-start">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}