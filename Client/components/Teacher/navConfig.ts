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
} from "lucide-react"

export interface NavItem {
  name: string
  href: string
  icon: any
  subItems?: {
    name: string
    href: string
    icon: any
  }[]
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
      { name: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
      { name: "Student Remarks", href: "/teacher/students/remarks", icon: MessageSquare },
    ],
  },

  {
    name: "Academics",
    href: "/teacher/academics",
    icon: BookOpen,
    subItems: [
      { name: "Classes & Sections", href: "/teacher/classes", icon: School },
      { name: "Timetable", href: "/teacher/timetable", icon: CalendarDays },
      { name: "Lesson Plan", href: "/teacher/lesson-plan", icon: BookCheck },
      { name: "Live Classes", href: "/teacher/live-classes", icon: Video },
    ],
  },

  {
    name: "Coursework",
    href: "/teacher/coursework",
    icon: FileQuestion,
    subItems: [
      { name: "Assignments", href: "/teacher/assignments", icon: FileQuestion },
      { name: "Study Materials", href: "/teacher/materials", icon: Download },
    ],
  },

  {
    name: "Examinations",
    href: "/teacher/exams",
    icon: GraduationCap,
    subItems: [
      { name: "Marks Entry", href: "/teacher/exams/marks", icon: FileText },
      { name: "Results", href: "/teacher/exams/results", icon: GraduationCap },
    ],
  },

  {
    name: "Communication",
    href: "/teacher/communication",
    icon: Megaphone,
    subItems: [
      { name: "Notice Board", href: "/teacher/notices", icon: Megaphone },
      { name: "Messages", href: "/teacher/messages", icon: MessageSquare },
    ],
  },

  {
    name: "Leave & HR",
    href: "/teacher/leaves",
    icon: CalendarOff,
    subItems: [
      { name: "Apply Leave", href: "/teacher/leaves/apply", icon: CalendarOff },
      { name: "My Leaves", href: "/teacher/leaves/history", icon: ClipboardList },
    ],
  },

  { name: "Profile", href: "/teacher/profile", icon: User },
  { name: "Settings", href: "/teacher/settings", icon: Settings },
]
