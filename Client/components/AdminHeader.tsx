"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import { Bell } from "lucide-react";

interface AdminHeaderProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

export default function AdminHeader({ setOpen, isOpen }: AdminHeaderProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.authstate);

  if (!isAuthenticated || !user) return null;

  return (
    <header className="
      sticky top-0 z-40
      flex h-16 items-center justify-between
      border-b bg-white/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8
      shadow-sm
    ">
      {/* Toggle sidebar */}
      <button
        onClick={() => setOpen(!isOpen)}
        className="
          lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Title */}
      <h1 className="
        flex-1 text-center lg:text-left
        text-xl font-semibold tracking-tight text-gray-900
      ">
       {user.name}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <button
          className="
            relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <Image
            src={user.photoURL || "/default-avatar.png"}
            alt={user.name || "Principal"}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user.name || "Principal"}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}