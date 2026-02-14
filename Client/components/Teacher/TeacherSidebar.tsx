"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/app/redux/store";
import { logoutTeacher } from "@/app/redux/Slice/teacher.auth.slice";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LogoutUser } from "@/lib/admin_api/TeacherApi"; 
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  School,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  User,
  // CRUD Icons
  UserPlus,      
  UserCog,       
  Trash2,        
  // Management Icons
  CalendarDays,  
  FileText,
  // New Features Icons
  FileQuestion,   // Assignments
  Download,       // Study Materials
  BookCheck,      // Lesson Plan
  Video,          // Live Class
  MessageSquare,  // Remarks/Chat
  Megaphone,      // Notices
  CalendarOff     // Leaves
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: { name: string; href: string; icon: any }[];
}

/* ================= MENU CONFIGURATION ================= */

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },

  // --- STUDENT MANAGEMENT ---
  { 
    name: "Students", 
    href: "/teacher/students", 
    icon: Users,
    subItems: [
      { name: "All Students", href: "/teacher/students/show", icon: Users }, 
      { name: "Add Student", href: "/teacher/students/create", icon: UserPlus }, 
      { name: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
      { name: "Student Remarks", href: "/teacher/students/remarks", icon: MessageSquare }, // New: Behavior logs
    ],
  },

  // --- ACADEMICS (Classroom Management) ---
  { 
    name: "Academics", 
    href: "/teacher/academics", 
    icon: BookOpen,
    subItems: [
      { name: "Classes & Sections", href: "/teacher/classes", icon: School },
      { name: "Timetable", href: "/teacher/timetable", icon: CalendarDays },
      { name: "Lesson Plan", href: "/teacher/lesson-plan", icon: BookCheck }, // New: Teacher Diary
      { name: "Live Classes", href: "/teacher/live-classes", icon: Video },   // New: Online links
    ],
  },

  // --- COURSEWORK (Homework & Notes) ---
  {
    name: "Coursework",
    href: "/teacher/coursework",
    icon: FileQuestion,
    subItems: [
      { name: "Assignments", href: "/teacher/assignments", icon: FileQuestion }, // New: Homework
      { name: "Study Materials", href: "/teacher/materials", icon: Download },   // New: Notes/PDFs
    ]
  },

  // --- EXAMINATIONS ---
  {
    name: "Examinations",
    href: "/teacher/exams",
    icon: GraduationCap,
    subItems: [
        { name: "Marks Entry", href: "/teacher/exams/marks", icon: FileText },
        { name: "Results", href: "/teacher/exams/results", icon: GraduationCap },
    ]
  },

  // --- COMMUNICATION ---
  {
    name: "Communication",
    href: "/teacher/communication",
    icon: Megaphone,
    subItems: [
      { name: "Notice Board", href: "/teacher/notices", icon: Megaphone }, // New: Circulars
      { name: "Messages", href: "/teacher/messages", icon: MessageSquare }, // New: Chat
    ]
  },

  // --- HR & LEAVES ---
  {
    name: "Leave & HR",
    href: "/teacher/leaves",
    icon: CalendarOff,
    subItems: [
      { name: "Apply Leave", href: "/teacher/leaves/apply", icon: CalendarOff }, // New: Apply
      { name: "My Leaves", href: "/teacher/leaves/history", icon: ClipboardList }, // New: Status
    ]
  },

  { name: "Profile", href: "/teacher/profile", icon: User },
  { name: "Settings", href: "/teacher/settings", icon: Settings },
];

/* ================= COMPONENT ================= */

export default function TeacherSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useSelector((state: RootState) => state.teacherauthstate);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      dispatch(logoutTeacher());
      router.replace("/");
    },
    onError: () => {
      alert("Logout failed. Try again!");
    },
  });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {logoutMutation.isPending && <FullScreenLoader />}

      {/* Mobile Overlay */}
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
        {/* ===== Logo ===== */}
        <div className="p-6 border-b">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              Teacher Portal
            </span>
          </Link>
        </div>

        {/* ===== Menu ===== */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const hasSubItems = !!item.subItems;
              const isItemActive = isActive(item.href);
              const isSubmenuOpen = mobileOpenItem === item.name;

              return (
                <li key={item.name}>
                  <div
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition font-medium cursor-pointer
                      ${
                        isItemActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }
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
                    <div className="flex items-center gap-3">
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

                  {/* ===== Submenu ===== */}
                  {hasSubItems && (
                    <ul
                      className={`overflow-hidden transition-all duration-300
                        ${
                          isSubmenuOpen
                            ? "max-h-96 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }
                        lg:max-h-none lg:opacity-100 lg:block
                      `}
                    >
                      <div className="pl-4">
                        {item.subItems!.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition rounded-lg mt-1
                                ${
                                  isActive(sub.href)
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

        {/* ===== Profile + Logout ===== */}
        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "Teacher"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "Faculty"}
              </p>
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