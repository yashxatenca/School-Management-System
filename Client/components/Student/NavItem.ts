import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  FileQuestion,
  GraduationCap,
  Download,
  MessageSquare,
  CalendarOff,
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
export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },

  {
    name: "Academics",
    href: "/student/academics",
    icon: BookOpen,
    subItems: [
      // { name: "Attendance", href: "/student/attendance", icon: ClipboardList },
      { name: "Timetable", href: "/student/timetable", icon: CalendarDays },
      { name: "Assignments", href: "/student/assignments", icon: FileQuestion },
      { name: "Results", href: "/student/results", icon: GraduationCap },
      //{ name: "Study Materials", href: "/student/materials", icon: Download },
    ],
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: ClipboardList,
  },
  {
    name: "Communication",
    href: "#",
    icon: MessageSquare,
    subItems: [
      //  { name: "Messages", href: "/student/messages", icon: MessageSquare },
      { name: "Notices", href: "/student/notices", icon: ClipboardList },
    ],
  },
  {
    name: "Leave",
    href: "/student/leaves",
    icon: CalendarOff,
    subItems: [
      { name: "Apply Leave", href: "/student/leaves/apply", icon: CalendarOff },
      {
        name: "My Leaves",
        href: "/student/leaves/history",
        icon: ClipboardList,
      },
    ],
  },

  { name: "Profile", href: "/student/profile", icon: User },
];
