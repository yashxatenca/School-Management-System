"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/app/redux/store";
import { logoutAdmin } from "@/app/redux/Slice/authSlice";
import FullScreenLoader from "../ui/FullScreenLoader";
import { LogoutUser } from "@/lib/admin_api/User.Api";
import { useState } from "react";
import {
  User,
  UserCheck,
  LayoutDashboard,
  Users,
  UserCog,
  Eye,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  School,
  Plus,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: { name: string; href: string; icon: any }[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },

  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: UserCog,
    subItems: [
      { name: "Create Teacher", href: "/admin/teachers/create", icon: Plus },
      { name: "View Teachers", href: "/admin/teachers/read", icon: Eye },
    ],
  },

  {
    name: "Students", href: "/admin/students", icon: Users,

    subItems: [{
      name: "Add Student", href: "/admin/students/add", icon: Plus
    },
    {
      name: "View Students", href: "/admin/students/read", icon: Eye
    }
    ]
  },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },

  // ✅ Assign Section
  {
    name: "Assign",
    href: "#",
    icon: LinkIcon,
    subItems: [
      { name: "Assign Class", href: "/admin/assign/class", icon: School },
      { name: "Assign Subject", href: "/admin/assign/subject", icon: BookOpen },
    ],
  },

  {
    name: "Attendance", href: "#", icon: UserCheck,

    subItems: [{
      name: "Mark Attendance", href: "/admin/attendance/add", icon: Plus
    },
    {
      name: "View Attendance", href: "/admin/attendance/read", icon: Eye
    }
    ]
  },

  { name: "Profile", href: "/admin/profile", icon: User },

  { name: "Settings", href: "/admin/settings", icon: Settings },
];

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
  });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {logoutMutation.isPending && <FullScreenLoader />}

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r z-30 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="p-5 border-b">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            <span className="font-bold text-lg">School</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasSub = !!item.subItems;
            const isOpen = openMenu === item.name;

            return (
              <div key={item.name}>
                {/* Main Item */}
                <div
                  onClick={() => {
                    if (hasSub) {
                      setOpenMenu(isOpen ? null : item.name);
                    } else {
                      router.push(item.href);
                      setOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition
                  ${isActive(item.href)
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-indigo-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>

                  {hasSub && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-300
                      ${isOpen ? "rotate-90" : ""}`}
                    />
                  )}
                </div>

                {/* Submenu (Accordion) */}
                {hasSub && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-40 mt-1" : "max-h-0"}`}
                  >
                    <div className="pl-6 ml-3 border-l border-gray-200 space-y-1">
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition
                          ${isActive(sub.href)
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                            }`}
                        >
                          <sub.icon className="h-4 w-4" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.photoURL || "/avatar.png"}
              className="h-9 w-9 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "Principal"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-2 text-red-600 text-sm hover:bg-red-50 w-full px-3 py-2 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}