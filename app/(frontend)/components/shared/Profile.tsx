"use client";

import React, { useEffect, useState } from "react";

function Profile({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative mr-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="text-zinc-400"
        >
          <g fill="none">
            <path
              fill="currentColor"
              fillOpacity="0.16"
              d="M19.523 21.99H4.488c-1.503 0-2.663-1.134-2.466-2.624l.114-.869c.207-1.2 1.305-1.955 2.497-2.214L11.928 15h.144l7.295 1.283c1.212.28 2.29.993 2.497 2.214l.114.88c.197 1.49-.963 2.623-2.466 2.623z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 7A5 5 0 1 1 7 7a5 5 0 0 1 10 0"
            />
          </g>
        </svg>

        <span className="text-sm text-zinc-400">{name}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-max rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
