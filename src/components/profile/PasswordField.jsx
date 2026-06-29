

import { Field, Input, Label } from "@headlessui/react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";

export default function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  canToggle = true,
}) {
  const [visible, setVisible] = useState(false);

  const isVisible = canToggle && visible;

  return (
    <Field>
      <Label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </Label>
      <div className="relative mt-2">
        <Input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="off"
          className="block w-full rounded-lg border border-slate-200 bg-white pr-10 px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
        />
        {canToggle && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {isVisible ? <LuEye /> : <LuEyeClosed />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </Field>
  );
}