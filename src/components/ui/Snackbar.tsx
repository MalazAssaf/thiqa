"use client";

import { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Snackbar({ type, message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const isError = type === "error";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        role={isError ? "alert" : "status"}
        className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
          isError
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-[#0f6b5f]/30 bg-accent-900 text-[#0f6b5f]"
        }`}
      >
        {isError ? (
          <ErrorIcon sx={{ fontSize: 20 }} className="shrink-0" />
        ) : (
          <CheckCircleIcon sx={{ fontSize: 20 }} className="shrink-0" />
        )}
        <p className="flex-1 text-sm font-medium leading-normal">{message}</p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
}
