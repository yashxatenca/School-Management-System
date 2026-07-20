"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/app/redux/store";
import { logoutStudent } from "@/app/redux/Slice/student.authslice";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { logout } from "@/lib/Student/Student.auth.api";
import { useState } from "react";
import { GraduationCap, ChevronRight, LogOut, ChevronDown } from "lucide-react";
import { navItems } from "./NavItem";

export default function StudentSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useSelector((state: RootState) => state.studentauthstate);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(logoutStudent());
      router.replace("/");
    },
  });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {logoutMutation.isPending && <FullScreenLoader />}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30 w-72 bg-white border-r 
          transform transition-transform duration-300 ease-in-out 
          flex flex-col flex-shrink-0 h-full
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b flex-shrink-0">
          <Link href="/student/dashboard" className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              Student Portal
            </span>
          </Link>
        </div>

        {/* Menu (Scrollable inside sidebar) */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const hasSubItems = !!item.subItems;
              const isItemActive = isActive(item.href);
              const isSubmenuOpen = mobileOpenItem === item.name;

              return (
                <li key={item.name}>
                  <div
                    onClick={() => {
                      if (hasSubItems) {
                        setMobileOpenItem(isSubmenuOpen ? null : item.name);
                      } else {
                        router.push(item.href);
                        setOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition font-medium cursor-pointer
                      ${
                        isItemActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>

                    {hasSubItems &&
                      (isSubmenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </div>

                  {hasSubItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isSubmenuOpen ? "max-h-40 mt-1" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-6 space-y-1 border-l border-gray-200 ml-3 mt-1">
                        {item.subItems!.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition
                                ${
                                  isActive(sub.href)
                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                            >
                              <sub.icon className="h-4 w-4" />
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile + Logout (Fixed at bottom) */}
        <div className="p-4 border-t bg-gray-50 flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "Student"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role || "Student"}
          </p>

          <button
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition font-medium mt-3 border border-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
