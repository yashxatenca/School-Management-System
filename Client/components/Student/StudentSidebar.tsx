"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/app/redux/store";
import { logoutStudent } from "@/app/redux/Slice/student.auth.slice";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LogoutStudent } from "@/lib/student_api/StudentApi";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  FileQuestion,
  GraduationCap,
  Download,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: { name: string; href: string; icon: any }[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },

  {
    name: "Academics",
    href: "/student/academics",
    icon: BookOpen,
    subItems: [
      { name: "Attendance", href: "/student/attendance", icon: ClipboardList },
      { name: "Timetable", href: "/student/timetable", icon: CalendarDays },
      { name: "Assignments", href: "/student/assignments", icon: FileQuestion },
      { name: "Results", href: "/student/results", icon: GraduationCap },
      { name: "Study Materials", href: "/student/materials", icon: Download },
    ],
  },

  {
    name: "Communication",
    href: "/student/communication",
    icon: MessageSquare,
    subItems: [
      { name: "Messages", href: "/student/messages", icon: MessageSquare },
      { name: "Notices", href: "/student/notices", icon: ClipboardList },
    ],
  },

  { name: "Profile", href: "/student/profile", icon: User },
  { name: "Settings", href: "/student/settings", icon: Settings },
];

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
    mutationFn: LogoutStudent,
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

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3"
          >
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              Student Portal
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
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

                  {hasSubItems && isSubmenuOpen && (
                    <ul className="pl-6 mt-1 space-y-1">
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
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile + Logout */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "Student"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role || "Student"}
          </p>

          <button
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium mt-3"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
