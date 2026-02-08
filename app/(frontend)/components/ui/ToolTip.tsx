"use client";

import { ReactNode, useState } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({
  content,
  children,
  position = "top"
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}

      {open && (
        <div
          className={`absolute z-50 ${positionClasses[position]}`}
        >
          <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 shadow-lg whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
