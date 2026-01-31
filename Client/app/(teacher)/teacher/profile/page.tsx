"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Clock, 
  Award, 
  Edit, 
  Copy,
  CheckCircle,
  MoreHorizontal
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Mock Data Type Definition ---
type TeacherProfile = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "Active" | "On Leave";
  avatar: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  qualifications: string[];
  stats: {
    totalClasses: number;
    students: number;
    experience: string;
  };
  schedule: { day: string; time: string; class: string; subject: string }[];
};

// --- Mock Data ---
const teacherData: TeacherProfile = {
  id: "TCH-2024-001",
  name: "Sarah Jenkins",
  role: "Senior Mathematics Teacher",
  department: "Mathematics",
  status: "Active",
  avatar: "", // Placeholder image
  email: "sarah.jenkins@school.edu",
  phone: "+1 (555) 123-4567",
  address: "42 Willow Avenue, Springfield",
  joinDate: "August 15, 2018",
  qualifications: ["M.Sc Mathematics", "B.Ed", "Certified STEM Educator"],
  stats: {
    totalClasses: 5,
    students: 140,
    experience: "8 Years",
  },
  schedule: [
    { day: "Monday", time: "09:00 AM", class: "10-A", subject: "Algebra" },
    { day: "Monday", time: "11:00 AM", class: "9-B", subject: "Geometry" },
    { day: "Tuesday", time: "10:00 AM", class: "10-A", subject: "Trigonometry" },
    { day: "Wednesday", time: "01:00 PM", class: "11-C", subject: "Calculus" },
  ]
};

export default function TeacherProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // --- Handlers ---
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(teacherData.email);
    toast.success("Email copied to clipboard!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleEditProfile = () => {
    toast.info("Edit mode enabled (Demo only)", {
      position: "bottom-right",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* Toast Notification Container */}
      <ToastContainer />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
                <Image 
                  src={teacherData.avatar} 
                  alt={teacherData.name} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              </div>
              <span className={`absolute bottom-2 right-2 px-3 py-1 text-xs font-bold rounded-full border-2 border-white ${teacherData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {teacherData.status}
              </span>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{teacherData.name}</h1>
              <p className="text-gray-500 font-medium">{teacherData.role}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {teacherData.department}
                </span>
                <span>•</span>
                <span>ID: {teacherData.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button 
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- Navigation Tabs --- */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {['overview', 'schedule', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Personal Info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-medium truncate">{teacherData.email}</p>
                      <button onClick={handleCopyEmail} className="text-gray-400 hover:text-blue-600">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{teacherData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">{teacherData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{teacherData.stats.totalClasses}</p>
                  <p className="text-xs text-blue-600/80 font-medium uppercase mt-1">Classes</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{teacherData.stats.students}</p>
                  <p className="text-xs text-purple-600/80 font-medium uppercase mt-1">Students</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center col-span-2">
                  <p className="text-xl font-bold text-orange-600">{teacherData.stats.experience}</p>
                  <p className="text-xs text-orange-600/80 font-medium uppercase mt-1">Teaching Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Schedule */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Conditional Rendering based on Tab */}
            {activeTab === 'overview' && (
              <>
                {/* About / Qualifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Qualifications & Certifications</h3>
                  <div className="flex flex-wrap gap-3">
                    {teacherData.qualifications.map((qual, index) => (
                      <span key={index} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700">
                        <Award className="w-4 h-4 text-yellow-500" />
                        {qual}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                     <h4 className="text-sm font-semibold text-gray-900 mb-2">System Info</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Date Joined</p>
                          <p className="text-sm font-medium">{teacherData.joinDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Login</p>
                          <p className="text-sm font-medium">Today, 09:14 AM</p>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Recent Activity / Schedule Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-gray-900">Today's Schedule</h3>
                     <button onClick={() => setActiveTab('schedule')} className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                  </div>
                  
                  <div className="space-y-3">
                    {teacherData.schedule.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4">
                          {item.class.split('-')[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.subject}</h4>
                          <p className="text-sm text-gray-500">Class {item.class}</p>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-2" />
                          {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Schedule
                </h3>
                <div className="space-y-4">
                   {teacherData.schedule.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                             <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{item.day}</p>
                            <h4 className="text-base font-bold text-gray-900">{item.subject}</h4>
                            <p className="text-sm text-gray-600">Class {item.class}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg self-start sm:self-center">
                           <Clock className="w-4 h-4" />
                           {item.time}
                        </div>
                      </div>
                   ))}
                   {teacherData.schedule.length === 0 && (
                     <p className="text-center text-gray-500 py-10">No classes scheduled.</p>
                   )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}