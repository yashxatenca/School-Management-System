"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { RootState } from "@/app/redux/store";
import { logoutAdmin } from "@/app/redux/Slice/authSlice";
import FullScreenLoader from "../ui/FullScreenLoader";
import { LogoutUser } from "@/lib/Admin/User.Api";
import { AdminUrl as navItems } from "./AdminUrl";
import { LogOut, GraduationCap, ChevronRight, X } from "lucide-react";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useSelector((state: RootState) => state.authstate);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      dispatch(logoutAdmin());
      router.replace("/");
    },
    onError: () => {
      dispatch(logoutAdmin());
      router.replace("/");
    },
  });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {logoutMutation.isPending && <FullScreenLoader />}

      {/* 1. Mobile Background Blur & Dark Dim Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 2. Sidebar Container */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-72 h-dvh lg:h-full bg-[#e6eaf0] border-r border-[#cbd5e1]
          transform transition-transform duration-300 ease-in-out 
          flex flex-col flex-shrink-0 p-4 gap-4 text-slate-800 shadow-2xl lg:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Brand Header & Mobile Close Button */}
        <div className="p-3 bg-[#e6eaf0] rounded-2xl shadow-[-4px_-4px_8px_#ffffff,_4px_4px_8px_rgba(166,180,200,0.6)] flex items-center justify-between flex-shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="p-2 rounded-xl bg-[#e6eaf0] shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),_inset_-2px_-2px_4px_#ffffff]">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-wide">
              School
            </span>
          </Link>

          {/* Close button for Mobile View */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-[#e6eaf0] text-slate-800 shadow-[-3px_-3px_6px_#ffffff,_3px_3px_6px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),_inset_-2px_-2px_4px_#ffffff]"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Menu - Clean Scroll without visible scrollbar */}
        <nav className="p-1 space-y-3 overflow-y-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const hasSub = !!item.subItems;
            const isOpen = openMenu === item.name;
            const itemActive = isActive(item.href);

            return (
              <div key={item.name} className="space-y-2">
                <div
                  onClick={() => {
                    if (hasSub) {
                      setOpenMenu(isOpen ? null : item.name);
                    } else {
                      router.push(item.href);
                      setOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    itemActive
                      ? "bg-[#e6eaf0] text-indigo-700 font-bold shadow-[inset_3px_3px_6px_rgba(166,180,200,0.6),_inset_-3px_-3px_6px_#ffffff]"
                      : "bg-[#e6eaf0] text-slate-800 font-semibold shadow-[-4px_-4px_8px_#ffffff,_4px_4px_8px_rgba(166,180,200,0.45)] hover:shadow-[-2px_-2px_5px_#ffffff,_2px_2px_5px_rgba(166,180,200,0.6)] hover:text-indigo-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-slate-700" />
                    <span className="text-sm">{item.name}</span>
                  </div>

                  {hasSub && (
                    <ChevronRight
                      className={`h-4 w-4 text-slate-600 transition-transform duration-300
                      ${isOpen ? "rotate-90 text-indigo-600" : ""}`}
                    />
                  )}
                </div>

                {hasSub && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-2 p-2 bg-[#dbe1ea] rounded-xl shadow-[inset_3px_3px_6px_rgba(166,180,200,0.6),_inset_-3px_-3px_6px_#ffffff] space-y-1.5">
                      {item.subItems!.map((sub) => {
                        const subActive = isActive(sub.href);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200
                            ${
                              subActive
                                ? "bg-[#e6eaf0] text-indigo-700 font-bold shadow-[-2px_-2px_5px_#ffffff,_2px_2px_5px_rgba(166,180,200,0.5)]"
                                : "text-slate-800 font-medium hover:text-indigo-600 hover:bg-[#e6eaf0]/60"
                            }`}
                          >
                            <sub.icon className="h-4 w-4" />
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile fixed at bottom */}
        <div className="p-4 bg-[#e6eaf0] rounded-2xl shadow-[-4px_-4px_8px_#ffffff,_4px_4px_8px_rgba(166,180,200,0.6)] mt-auto flex-shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-[#e6eaf0] shadow-[-3px_-3px_6px_#ffffff,_3px_3px_6px_rgba(166,180,200,0.5)]">
              <Image
                src={user?.photoURL || "/avatar.png"}
                alt="Profile Picture"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-600 font-medium truncate">
                {user?.role || "Principal"}
              </p>
            </div>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-semibold text-red-600 bg-[#e6eaf0] rounded-xl shadow-[-4px_-4px_8px_#ffffff,_4px_4px_8px_rgba(166,180,200,0.45)] hover:text-red-700 active:shadow-[inset_2px_2px_5px_rgba(166,180,200,0.5),_inset_-2px_-2px_5px_#ffffff] transition-all duration-150"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
