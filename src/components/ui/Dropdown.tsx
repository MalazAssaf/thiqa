"use client";

import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DropdownProps = {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  function choose(option: Option) {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div className="relative flex flex-col gap-1.25">
      <label htmlFor={id} className="text-2xs leading-[1.3] text-neutral-500">
        {label}
      </label>

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 rounded-md border px-2.5 text-left text-base outline-none sm:h-9 sm:text-sm ${
          disabled
            ? "cursor-not-allowed border-divider bg-neutral-900 text-neutral-700"
            : open
              ? "border-accent bg-surface ring-3 ring-accent-800"
              : "border-divider bg-surface focus-visible:border-accent"
        }`}
      >
        <span
          className={`flex-1 truncate ${selected && !disabled ? "text-text" : ""} ${!selected && !disabled ? "text-neutral-600" : ""}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        {open ? (
          <KeyboardArrowUpIcon
            sx={{ fontSize: 16 }}
            className="text-neutral-600"
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ fontSize: 16 }}
            className={disabled ? "text-neutral-700" : "text-neutral-600"}
          />
        )}
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-20 mt-1.5 flex max-h-64 w-full flex-col gap-0.5 overflow-y-auto rounded-md border border-divider bg-surface p-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] scrollbar-thin [scrollbar-color:var(--color-divider)_transparent]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => choose(option)}
                className={`flex shrink-0 items-center gap-2 rounded-sm px-2.5 text-sm ${
                  option.disabled
                    ? "cursor-not-allowed text-neutral-700"
                    : isSelected
                      ? "cursor-pointer bg-accent-900 font-medium text-accent"
                      : "cursor-pointer text-text hover:bg-neutral-900"
                }`}
              >
                <span className="flex-1">{option.label}</span>
                {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
