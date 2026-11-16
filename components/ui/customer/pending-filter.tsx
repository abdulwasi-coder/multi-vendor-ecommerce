"use client";

import type { ReactNode } from "react";
import { useLinkStatus } from "next/link";
import { Check } from "lucide-react";

export function PendingLabel({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return <span className={pending ? "opacity-60" : undefined}>{children}</span>;
}

// for toggle filters (brands, colors, attributes): clicking flips the state,
// so while the navigation is pending show the opposite of the current state
export function PendingCheckbox({
  selected,
  className = "size-4.25",
}: {
  selected: boolean;
  className?: string;
}) {
  const { pending } = useLinkStatus();
  const checked = pending ? !selected : selected;
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[3px] border ${className} ${
        checked
          ? "border-[#007185] bg-[#007185] text-white"
          : "border-[#888c8c] bg-white"
      }`}
    >
      {checked && <Check className="size-3.5" aria-hidden="true" />}
    </span>
  );
}

// for single-select filters (categories): clicking always selects that option,
// so while pending show it as selected
export function PendingRadio({ selected }: { selected: boolean }) {
  const { pending } = useLinkStatus();
  const checked = pending ? true : selected;
  return (
    <span
      className={`grid size-4 shrink-0 place-items-center rounded-full border ${
        checked ? "border-[#007185]" : "border-[#888c8c]"
      }`}
    >
      {checked && <span className="size-2 rounded-full bg-[#007185]" />}
    </span>
  );
}

