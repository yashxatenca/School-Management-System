"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Copy,
  MoreHorizontal,
  User,
  AtSign,
  CalendarDays,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use the exact interface from your folder
// Adjust the import path according to your project structure
import { Teacher } from "@/interface/teacher/Teacher.interface"; // ← your real path

export default function TeacherProfilePage() {
  const user = useSelector((state: RootState) => state.teacherauthstate.user) as Teacher | null;

  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "settings">("overview");

  // Handlers
  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      toast.success("Email copied to clipboard", {
        position: "bottom-right",
        autoClose: 2500,
      });
    }
  };

  const handleEditProfile = () => {
    toast.info("Edit profile (coming soon)", { position: "bottom-right" });
  };

  // Avatar with fallback
  const avatarSrc = user?.avatar || "/teacherdefault.png";

  // Format dates safely
  const formatDate = (date?: Date | string) => {
    if (!date) return "Not provided";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 sm:p-6 lg:p-8">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                <Image
                  src={avatarSrc}
                  alt={`${user?.name || "Teacher"} profile`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {user?.role && (
                <span className="absolute -bottom-1 -right-1 px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border-2 border-white shadow-sm">
                  {user.role}
                </span>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user?.name || "Teacher Name"}
              </h1>
              <p className="text-gray-600 font-medium text-lg">
                {user?.role || "Faculty Member"}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                  <AtSign className="w-4 h-4 text-gray-600" />
                  <span>ID: {user?.staff_id || "—"}</span>
                </div>
                {user?.gender && (
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="capitalize">{user.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5 sm:mt-0">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="p-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 overflow-x-auto">
            {["overview", "schedule", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-sm sm:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column – Contact & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-gray-900 font-medium break-all">
                        {user?.email || "Not provided"}
                      </p>
                      {user?.email && (
                        <button
                          onClick={handleCopyEmail}
                          className="text-gray-400 hover:text-indigo-600 transition"
                          aria-label="Copy email"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-gray-900 font-medium mt-0.5">
                      {user?.contact || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* You can add address field later if added to interface */}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Account Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formatDate(user?.dateOfBirth)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(user?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(user?.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column – Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
                <div className="prose text-gray-700 max-w-none">
                  <p>
                    Welcome, {user?.name || "Teacher"}. This is your profile page.
                  </p>
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Staff ID:</strong> {user?.staff_id || "—"}</li>
                    <li><strong>Email:</strong> {user?.email || "—"}</li>
                    <li><strong>Contact:</strong> {user?.contact || "—"}</li>
                    <li><strong>Gender:</strong> {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not specified"}</li>
                    <li><strong>Date of Birth:</strong> {formatDate(user?.dateOfBirth)}</li>
                    <li><strong>Account Created:</strong> {formatDate(user?.createdAt)}</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center py-16">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule</h3>
                <p className="text-gray-600">
                  Class schedule integration coming soon...
                </p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600">
                  Account preferences & security settings coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}