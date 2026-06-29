import {
  User,
  UserCheck,
  LayoutDashboard,
  Users,
  UserCog,
  Eye,
  BookOpen,
  Plus,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: { name: string; href: string; icon: any }[];
}

export const AdminUrl: NavItem[] = [
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
    name: "Students",
    href: "/admin/students",
    icon: Users,
    subItems: [
      { name: "Add Student", href: "/admin/students/add", icon: Plus },
      { name: "View Students", href: "/admin/students/read", icon: Eye },
    ],
  },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Subjects", href: "/admin/subject", icon: BookOpen },

  {
    name: "Attendance",
    href: "#",
    icon: UserCheck,
    subItems: [
      //{ name: "Mark Attendance", href: "/admin/attendance/add", icon: Plus },
      { name: "View Attendance", href: "/admin/attendance/read", icon: Eye },
    ],
  },
  // {
  //   name: "Homework",
  //   href: "#",
  //   icon: BookOpen,
  //   subItems: [
  //    // { name: "Create Homework", href: "/admin/homework/create", icon: Plus },
  //     { name: "View Homework", href: "/admin/homework/read", icon: Eye },
  //   ],
  // },
  {
    name: "Exams",
    href: "#",
    icon: BookOpen,
    subItems: [
      { name: "Create Exam", href: "/admin/exam/add", icon: Plus },
      { name: "View Exams", href: "/admin/exam/read", icon: Eye },
    ],
  },
  {
    name: "Marks",
    href: "#",
    icon: BookOpen,
    subItems: [
      // { name: "Create Marks", href: "/admin/marks/add", icon: Plus },
      { name: "View Marks", href: "/admin/marks/read", icon: Eye },
    ],
  },

  { name: "Profile", href: "/admin/profile", icon: User },
];
