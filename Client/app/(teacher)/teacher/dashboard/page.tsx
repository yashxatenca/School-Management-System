"use client";
import React from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  ClipboardList,
  FileQuestion,
  GraduationCap,
  CalendarDays,
  Megaphone,
  CalendarOff,
  UserRound,
  ArrowRight,
} from "lucide-react";
import TeacherProfileCard from "../../(components)/TeacherProfileCard";

// Real routes directly mapped from your navItems
const quickLinks = [
  {
    title: "Mark Attendance",
    desc: "Take daily student attendance",
    href: "/teacher/attendance/create",
    icon: ClipboardList,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Create Homework",
    desc: "Assign coursework to classes",
    href: "/teacher/homework/create",
    icon: FileQuestion,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Marks Entry",
    desc: "Upload exam & test results",
    href: "/teacher/exams/marks",
    icon: GraduationCap,
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
  {
    title: "My Timetable",
    desc: "Check your daily period schedule",
    href: "/teacher/timetable/my",
    icon: CalendarDays,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Notice Board",
    desc: "View or post announcements",
    href: "/teacher/notices",
    icon: Megaphone,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "Apply Leave",
    desc: "Submit leave applications",
    href: "/teacher/leaves/apply",
    icon: CalendarOff,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
];

export default function TeacherDashboardPage() {
  const { user } = useSelector((state: RootState) => state.teacherauthstate);

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            👋 Welcome back, {user?.name || "Teacher"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Teacher Portal & Quick Access Overview
          </p>
        </div>
        <Link
          href="/teacher/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3.5 py-2 rounded-lg w-fit transition-colors"
        >
          <UserRound className="h-4 w-4" /> View Profile
        </Link>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Quick Action Hub */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⚡ Quick Actions
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              Frequently Used
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-lg border ${item.color} shrink-0`}
                  >
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

        {/* Right Sidebar - Profile Info */}
        <div className="space-y-6">
          {user && <TeacherProfileCard user={user} />}
        </div>
      </div>
    </div>
  );
}
