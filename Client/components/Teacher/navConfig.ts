import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  School,
  ClipboardList,
  User,
  UserPlus,
  CalendarDays,
  FileText,
  FileQuestion,
  Download,
  BookCheck,
  Video,
  MessageSquare,
  Megaphone,
  CalendarOff,
  EyeIcon,
  Edit,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },

  {
    name: "Students",
    href: "/teacher/students",
    icon: Users,
    subItems: [
      { name: "All Students", href: "/teacher/students/show", icon: Users },
      { name: "Add Student", href: "/teacher/students/create", icon: UserPlus },
      {
        name: "Attendance",
        href: "/teacher/attendance/create",
        icon: ClipboardList,
      },
      {
        name: "View Attendance",
        href: "/teacher/attendance/read",
        icon: EyeIcon,
      },
    ],
  },

  {
    name: "Academics",
    href: "/teacher/academics",
    icon: BookOpen,
    subItems: [
      { name: "Classes & Sections", href: "/teacher/classes", icon: School },
      //{ name: "Lesson Plan", href: "/teacher/lesson-plan", icon: BookCheck },
      // { name: "Live Classes", href: "/teacher/live-classes", icon: Video },
      {
        name: "Add Subjects",
        href: "/teacher/assign-class-subject",
        icon: BookOpen,
      },
    ],
  },
  {
    name: "Time Table",
    href: "/teacher/timetable",
    icon: CalendarDays,
    subItems: [
      {
        name: "My Timetable",
        href: "/teacher/timetable/my",
        icon: CalendarDays,
      },
      {
        name: "Class Timetable",
        href: "/teacher/timetable/class",
        icon: School,
      },
    ],
  },

  {
    name: "Coursework",
    href: "/teacher/coursework",
    icon: FileQuestion,
    subItems: [
      {
        name: "Create Homework",
        href: "/teacher/homework/create",
        icon: FileQuestion,
      },
      { name: "View Homework", href: "/teacher/homework/view", icon: EyeIcon },
      // {
      //   name: "Study Materials",
      //   href: "/teacher/homework/materials",
      //   icon: Download,
      // },
    ],
  },

  {
    name: "Examinations",
    href: "/teacher/exams",
    icon: GraduationCap,
    subItems: [
      { name: "Marks Entry", href: "/teacher/exams/marks", icon: FileText },
      { name: "Edit Marks", href: "/teacher/exams/edit-marks", icon: Edit },
      { name: "Results", href: "/teacher/exams/results", icon: GraduationCap },
    ],
  },

  {
    name: "Communication",
    href: "/teacher/communication",
    icon: Megaphone,
    subItems: [
      { name: "Notice Board", href: "/teacher/notices", icon: Megaphone },
    ],
  },

  {
    name: "Leave & HR",
    href: "/teacher/leaves",
    icon: CalendarOff,
    subItems: [
      { name: "Apply Leave", href: "/teacher/leaves/apply", icon: CalendarOff },
      {
        name: "My Leaves",
        href: "/teacher/leaves/history",
        icon: ClipboardList,
      },
    ],
  },

  { name: "Profile", href: "/teacher/profile", icon: User },
  {
    name: "Student Data",
    href: "/teacher/student-data",
    icon: User,
  },
];
