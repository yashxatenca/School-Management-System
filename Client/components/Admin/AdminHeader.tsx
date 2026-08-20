"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface AdminHeaderProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

export default function AdminHeader({ setOpen, isOpen }: AdminHeaderProps) {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.authstate,
  );

  if (!isAuthenticated || !user) return null;

  return (
    <header
      className="
        flex-shrink-0 z-20
        flex h-20 items-center justify-between
        bg-[#e6eaf0] border-b border-[#d1d9e6]/60 px-4 sm:px-6 lg:px-8
        relative text-slate-700
      "
    >
      {/* Toggle sidebar button (Mobile) */}
      <button
        onClick={() => setOpen(!isOpen)}
        className="
          lg:hidden p-2.5 bg-[#e6eaf0] rounded-xl text-slate-700
          shadow-[-3px_-3px_6px_#ffffff,_3px_3px_6px_rgba(166,180,200,0.5)]
          hover:text-indigo-600
          active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),_inset_-2px_-2px_4px_#ffffff]
          transition-all duration-150 focus:outline-none
        "
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-slate-700" />
        ) : (
          <Menu className="h-5 w-5 text-slate-700" />
        )}
      </button>

      {/* Title */}
      <h1
        className="
          flex-1 text-center lg:text-left
          text-xl font-bold tracking-wide text-slate-800
        "
      >
        {user.name}
      </h1>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3 p-1.5 pr-3 bg-[#e6eaf0] rounded-2xl shadow-[-3px_-3px_6px_#ffffff,_3px_3px_6px_rgba(166,180,200,0.5)]">
          <div className="p-0.5 rounded-full bg-[#e6eaf0] shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),_inset_-2px_-2px_4px_#ffffff]">
            <Image
              src={user.photoURL || "/avatar.png"}
              alt={user.name || "Principal"}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user.name || "Principal"}
            </p>
            <p className="text-xs text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
