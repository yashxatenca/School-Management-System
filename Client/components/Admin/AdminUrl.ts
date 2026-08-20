import {
  User,
  UserCheck,
  LayoutDashboard,
  Users,
  UserCog,
  Eye,
  CalendarClock,
  BookOpen,
  Plus,
  FolderOpen,
  GraduationCap,
  Library,
  UserRound,
  CalendarOff,
  Presentation,
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
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Subjects", href: "/admin/subject", icon: BookOpen },

  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
    subItems: [
      { name: "Add Student", href: "/admin/students/add", icon: Plus },
      { name: "View Students", href: "/admin/students/read", icon: Eye },
      { name: "Bulk Update", href: "/admin/students/bulk-update", icon: Users },
    ],
  },
  {
    name: "Attendance",
    href: "/admin/attendance",
    icon: UserCheck,
  },

  // {
  //   name: "Attendance",
  //   href: "#",
  //   icon: UserCheck,
  //   subItems: [
  //     //{ name: "Mark Attendance", href: "/admin/attendance/add", icon: Plus },
  //     { name: "View Attendance", href: "/admin/attendance/read", icon: Eye },
  //   ],
  // },
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
  {
    name: "Essentails",
    href: "#",
    icon: FolderOpen,
    subItems: [
      {
        name: "Student Data",
        href: "/admin/essentials/students",
        icon: Users,
      },
      {
        name: "Teacher Data",
        href: "/admin/essentials/teachers",
        icon: GraduationCap,
      },
      {
        name: "Class Data",
        href: "/admin/essentials/classes",
        icon: Presentation,
      },
      {
        name: "Subject Data",
        href: "/admin/essentials/subjects",
        icon: Library,
      },
    ],
  },
  {
    name: "Timetable",
    href: "/admin/timetable",
    icon: CalendarClock,
    subItems: [
      {
        name: "Student Timetable",
        href: "/admin/timetable/student",
        icon: Users,
      },
      {
        name: "Teacher Timetable",
        href: "/admin/timetable/teacher",
        icon: GraduationCap,
      },
    ],
  },
  {
    name: "Leave",
    href: "/admin/leaves",
    icon: CalendarOff,
    subItems: [
      {
        name: "Faculty Leave",
        href: "/admin/leaves/teacher-leave",
        icon: UserRound,
      },
    ],
  },

  { name: "Profile", href: "/admin/profile", icon: User },
];
