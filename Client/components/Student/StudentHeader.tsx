"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Bell, Menu, X } from "lucide-react";

interface StudentHeaderProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

export default function StudentHeader({ setOpen, isOpen }: StudentHeaderProps) {
  const { user } = useSelector((state: RootState) => state.studentauthstate);

  if (!user) return null;

  return (
    <header
      className="
      flex-shrink-0 z-40
      flex h-16 items-center justify-between
      border-b bg-white px-4 sm:px-6 lg:px-8
      shadow-sm relative
    "
    >
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Title */}
      <h1 className="flex-1 text-center lg:text-left text-xl font-semibold tracking-tight text-gray-900">
        Welcome, {user.name || user.name || "Student"}
      </h1>

      {/* Right side icons */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
            {(user.name || user.name || "S").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
