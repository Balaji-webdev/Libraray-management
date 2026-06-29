import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";

export default function Dialogs({
  isOpen,
  isClose,
  title,
  onconfirm,
  description,
}) {
  return (
    <Dialog open={isOpen} onClose={isClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          <DialogTitle className="text-lg font-bold text-gray-900 mb-2">
            {title}
          </DialogTitle>

          <Description className="mt-2 text-sm text-gray-600">
            {description}
          </Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={isClose}
              className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onconfirm}
              className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
