"use client";

import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  GraduationCap, 
  Megaphone, 
  Video,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usedispatch, useSelector } from "react-redux";
import { RootState } from '@/app/redux/store'

// --- 1. MOCK DATA (Ensure this is present!) ---
const stats = [
  { label: "Attendance", value: "85%", icon: Video, color: "text-green-600", bg: "bg-green-50" },
  { label: "Pending Tasks", value: "4", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Exams", value: "2", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Notices", value: "3 New", icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50" },
];

const todaysClasses = [
  { time: "09:00 AM", subject: "Mathematics", teacher: "Mr. Sharma", status: "Live", link: "#" },
  { time: "10:00 AM", subject: "Physics", teacher: "Ms. Verma", status: "Upcoming", link: "#" },
  { time: "11:30 AM", subject: "English", teacher: "Mrs. Das", status: "Upcoming", link: "#" },
];

const assignments = [
  { subject: "Physics", title: "Thermodynamics", due: "Tomorrow", status: "Pending" },
  { subject: "Math", title: "Algebra Ex 12.1", due: "2 Days", status: "Pending" },
];

const notices = [
  { id: 1, title: "Sports Day Registration", date: "Today", tag: "Event", color: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Mid-Term Exam Schedule", date: "Yesterday", tag: "Exam", color: "bg-red-100 text-red-700" },
  { id: 3, title: "Holiday on Monday", date: "2 days ago", tag: "General", color: "bg-gray-100 text-gray-700" },
];

export default function StudentDashboard() {

    const user = useSelector((state:RootState) => state.studentauthstate.user);
    console.log(user)
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.fullName}!</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">October 24, 2025</span>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">{stat.label}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Timeline & Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Today&apos;s Schedule
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {todaysClasses.map((cls, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="text-center w-14">
                      <p className="text-xs text-gray-500 font-bold">{cls.time.split(' ')[1]}</p>
                      <p className="text-sm font-bold text-gray-900">{cls.time.split(' ')[0]}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{cls.subject}</h4>
                      <p className="text-xs text-gray-500">{cls.teacher}</p>
                    </div>
                  </div>
                  {cls.status === "Live" ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse" /> Live
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Upcoming</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Pending Homework
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {assignments.map((hw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:border-indigo-200 transition">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">{hw.title}</h4>
                      <p className="text-xs text-gray-500">{hw.subject} • Due: {hw.due}</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Submit</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Notice Board & Actions) */}
        <div className="space-y-6">
          
          {/* NOTICE BOARD (Fixed Visibility) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full max-h-[400px]">
            <div className="p-4 border-b flex items-center justify-between bg-yellow-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-yellow-600" />
                Notice Board
              </h2>
              <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">New</span>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
              {notices.map((notice) => (
                <div key={notice.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-indigo-500 transition-all">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${notice.color}`}>
                      {notice.tag}
                    </span>
                    <span className="text-[10px] text-gray-400">{notice.date}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mt-1 group-hover:text-indigo-600 transition">
                    {notice.title}
                  </h3>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t bg-gray-50 text-center">
               <Link href="/student/notices" className="text-xs font-medium text-indigo-600 hover:underline flex items-center justify-center gap-1">
                 View All Notices <ChevronRight className="h-3 w-3" />
               </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/student/results" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-center transition backdrop-blur-sm">
                 <GraduationCap className="h-5 w-5 mx-auto mb-1 text-indigo-200" />
                 <span className="text-xs font-medium">Results</span>
              </Link>
              <Link href="/student/leave" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-center transition backdrop-blur-sm">
                 <AlertCircle className="h-5 w-5 mx-auto mb-1 text-indigo-200" />
                 <span className="text-xs font-medium">Apply Leave</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}