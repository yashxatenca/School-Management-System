"use client";

import React from "react";
import {
  Users,
  BookOpen,
  ClipboardList,
  School,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "320",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Classes",
    value: "8",
    icon: BookOpen,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Sections",
    value: "16",
    icon: School,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Today's Attendance",
    value: "85%",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">

      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          👋 Welcome back, Teacher
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s your teaching overview and daily activity
        </p>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>

              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${item.color}`}
              >
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Classes Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📚 My Classes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Class 6-A", "Class 7-B", "Class 8-A", "Class 9-C"].map(
                (cls) => (
                  <div
                    key={cls}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <p className="font-medium text-gray-900">{cls}</p>
                    <p className="text-sm text-gray-500">
                      Students: 40 | Subject: Maths
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Attendance Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📝 Today's Attendance
            </h2>

            <div className="space-y-3">
              {[
                { cls: "Class 6-A", percent: "90%" },
                { cls: "Class 7-B", percent: "82%" },
                { cls: "Class 8-A", percent: "88%" },
              ].map((item) => (
                <div
                  key={item.cls}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">{item.cls}</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: item.percent }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {item.percent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <img
              src="/avatar.png"
              className="h-20 w-20 rounded-full mx-auto ring-2 ring-indigo-500"
              alt="Teacher"
            />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Teacher Name
            </h3>
            <p className="text-sm text-gray-500">Mathematics Teacher</p>

            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              View Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ⚡ Quick Actions
            </h2>

            <div className="space-y-3">
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-left">
                ➕ Mark Attendance
              </button>
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-left">
                📢 Post Notice
              </button>
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-left">
                📚 Add Homework
              </button>
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-left">
                🧾 Upload Marks
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📅 Today’s Schedule
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Class 6-A</span>
                <span className="text-gray-500">09:00 - 09:45</span>
              </li>
              <li className="flex justify-between">
                <span>Class 7-B</span>
                <span className="text-gray-500">10:00 - 10:45</span>
              </li>
              <li className="flex justify-between">
                <span>Class 8-A</span>
                <span className="text-gray-500">11:00 - 11:45</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
