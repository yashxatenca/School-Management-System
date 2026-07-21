"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  FileQuestion,
  GraduationCap,
  MessageSquare,
  CalendarOff,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

// Mapped Quick Links for Student
const quickActions = [
  {
    title: "My Timetable",
    desc: "Check your daily class schedule",
    href: "/student/timetable",
    icon: CalendarDays,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Assignments",
    desc: "View and submit your homework",
    href: "/student/assignments",
    icon: FileQuestion,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Exam Results",
    desc: "Check your academic performance",
    href: "/student/results",
    icon: GraduationCap,
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
  {
    title: "Notice Board",
    desc: "View latest school announcements",
    href: "/student/notices",
    icon: MessageSquare,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Apply Leave",
    desc: "Submit a new leave request",
    href: "/student/leaves/apply",
    icon: CalendarOff,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "My Leaves",
    desc: "Track status of applied leaves",
    href: "/student/leaves/history",
    icon: ClipboardList,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
];

export default function StudentDashboard() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            ⚡ Quick Actions
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Portal Shortcuts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg border ${item.color} shrink-0`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
