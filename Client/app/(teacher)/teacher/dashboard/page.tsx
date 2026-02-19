"use client";
import React from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import {
  Users,
  BookOpen,
  ClipboardList,
  School,
  CalendarDays,
} from "lucide-react";
import TeacherProfileCard from "../../(components)/TeacherProfileCard";

const stats = [
  { title: "Total Students", value: "320", icon: Users,   color: "bg-blue-50 text-blue-700" },
  { title: "Classes",        value: "8",   icon: BookOpen, color: "bg-emerald-50 text-emerald-700" },
  { title: "Sections",       value: "16",  icon: School,   color: "bg-violet-50 text-violet-700" },
  { title: "Today's Attendance", value: "85%", icon: ClipboardList, color: "bg-amber-50 text-amber-700" },
];

export default function TeacherDashboardPage() {
  const { user } = useSelector((state: RootState) => state.teacherauthstate);
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          👋 Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here's your teaching overview and today's snapshot
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5">
                  {item.value}
                </p>
              </div>
              <div
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center ${item.color} shrink-0`}
              >
                <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – bigger area */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              📚 My Classes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Class 6-A", "Class 7-B", "Class 8-A", "Class 9-C"].map((cls) => (
                <div
                  key={cls}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                >
                  <p className="font-medium text-gray-900">{cls}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Students: 40 • Subject: Mathematics
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Attendance */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              📝 Today's Attendance
            </h2>
            <div className="space-y-4">
              {[
                { cls: "Class 6-A", percent: "90%" },
                { cls: "Class 7-B", percent: "82%" },
                { cls: "Class 8-A", percent: "88%" },
              ].map((item) => (
                <div key={item.cls} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{item.cls}</span>
                    <span className="text-gray-600 font-medium">{item.percent}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: item.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 lg:space-y-7">
          {/* Profile */}
          <TeacherProfileCard user={user}/>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              ⚡ Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Mark Attendance", emoji: "➕" },
                { label: "Post Notice",      emoji: "📢" },
                { label: "Add Homework",     emoji: "📚" },
                { label: "Upload Marks",     emoji: "🧾" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition font-medium text-gray-800 flex items-center gap-3"
                >
                  <span>{action.emoji}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              📅 Today's Schedule
            </h2>
            <ul className="space-y-3 text-sm">
              {[
                { cls: "Class 6-A", time: "09:00 – 09:45" },
                { cls: "Class 7-B", time: "10:00 – 10:45" },
                { cls: "Class 8-A", time: "11:00 – 11:45" },
              ].map((item) => (
                <li
                  key={item.cls}
                  className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0"
                >
                  <span className="font-medium text-gray-800">{item.cls}</span>
                  <span className="text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}