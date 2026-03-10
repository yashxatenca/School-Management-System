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
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
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
      { name: "Read Teacher", href: "/admin/teachers/read", icon: Eye }
    ],
  },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Sections", href: "/admin/sections", icon: School },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Profile", href: "/admin/profile", icon: UserCog }
];

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { user } = useSelector((state: RootState) => state.authstate);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      dispatch(logoutAdmin());
      router.replace("/");
    },
    onError: () => {
      alert("Logout failed. Try again!");
    },
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

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
        className={`
          fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          bg-white border-r border-gray-200 flex flex-col
        `}
      >
        <div className="p-6 border-b">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">School Name</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const hasSubItems = !!item.subItems;
              const isItemActive = isActive(item.href);
              const isSubmenuOpen = mobileOpenItem === item.name;

              return (
                <li key={item.name} className="group relative">
                  <div
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition font-medium cursor-pointer
                      ${isItemActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"}
                    `}
                    onClick={() => {
                      if (hasSubItems) {
                        setMobileOpenItem(isSubmenuOpen ? null : item.name);
                      } else {
                        router.push(item.href);
                        setOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>

                    {hasSubItems && (
                      <div className="lg:hidden">
                        {isSubmenuOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {hasSubItems && (
                    <ul
                      className={`
                        overflow-hidden transition-all duration-300
                        ${isSubmenuOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                        lg:max-h-none lg:opacity-100 lg:static lg:block
                        ${!isSubmenuOpen && "lg:hidden"} 
                      `}
                    >
                      <div className="pl-4 lg:pl-0">
                        {item.subItems!.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className={`
                                flex items-center gap-3 px-4 py-2.5 text-sm transition rounded-lg mt-1
                                ${isActive(sub.href)
                                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                }
                              `}
                            >
                              <sub.icon className="h-4 w-4" />
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user?.photoURL || "/avatar.png"}
              alt="User"
              className="h-10 w-10 rounded-full ring-2 ring-white shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "Principal"}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "Administrator"}</p>
            </div>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}