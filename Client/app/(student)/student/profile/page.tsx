// src/app/student/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  useGetStudentProfile,
  useUpdateStudentProfile,
} from "./_components/useProfile";
import { StudentProfileData } from "./_components/profile.api";
import { User, MapPin, Users, Save, Loader2, Edit, X } from "lucide-react";

// Helper for dynamic age calculation
const calculateAge = (dobString?: string) => {
  if (!dobString) return "";
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function StudentProfilePage() {
  const user = useSelector((state: RootState) => state.studentauthstate.user);
  const studentId = user?._id;

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // 1. TanStack custom hook for GETting data
  const { profiledata, isLoading } = useGetStudentProfile(studentId);

  // 2. TanStack custom hook for UPDATEing data
  const { updateProfile, isUpdating } = useUpdateStudentProfile(studentId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentProfileData>();

  // Safely extract data handling any nesting level from the API response
  const profile =
    profiledata?.data?.data || profiledata?.data || profiledata || null;

  // Jab data server se aaye, form ko reset/populate kar dein
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      reset({
        student_id: profile.student_id || studentId,
        gender: profile.gender || "",
        dob: profile.dob || "",
        bloodGroup: profile.bloodGroup || "",
        phone: profile.phone || "",
        address: profile.address || "",
        fatherName: profile.fatherName || "",
        motherName: profile.motherName || "",
        contact: profile.contact || "",
      });
    }
  }, [profile, reset, studentId]);

  const dobValue = watch("dob");

  const onSubmit = (formData: StudentProfileData) => {
    updateProfile(formData);
    setIsEditing(false); // Save par click karte hi wapas view mode mein aa jaye
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      reset(profile); // Cancel karne par wapas original data fill ho jaye
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-sm text-gray-500">
            ID:{" "}
            <span className="font-mono text-indigo-600">
              {user?.name || "Student"}
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-indigo-900 mb-4 pb-2 border-b">
            <User className="h-5 w-5 text-indigo-600" /> Personal Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Gender
              </label>
              <select
                {...register("gender")}
                disabled={!isEditing}
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Date of Birth
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dob")}
                disabled={!isEditing}
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Age
              </label>
              <div className="w-full mt-1 p-2 border rounded-md bg-gray-50 text-gray-700 cursor-not-allowed">
                {calculateAge(dobValue)
                  ? `${calculateAge(dobValue)} Years`
                  : "N/A"}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Blood Group
              </label>
              <input
                type="text"
                {...register("bloodGroup")}
                disabled={!isEditing}
                placeholder="e.g. O+"
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Contact & Address Section */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-indigo-900 mb-4 pb-2 border-b">
            <MapPin className="h-5 w-5 text-indigo-600" /> Contact & Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone")}
                disabled={!isEditing}
                placeholder="Your Number"
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Emergency Contact
              </label>
              <input
                type="tel"
                {...register("contact")}
                disabled={!isEditing}
                placeholder="Emergency Number"
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Address
              </label>
              <textarea
                rows={3}
                {...register("address")}
                disabled={!isEditing}
                placeholder="Full Address"
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Family Details Section */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-indigo-900 mb-4 pb-2 border-b">
            <Users className="h-5 w-5 text-indigo-600" /> Family Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Father's Name
              </label>
              <input
                type="text"
                {...register("fatherName")}
                disabled={!isEditing}
                placeholder="Mr."
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Mother's Name
              </label>
              <input
                type="text"
                {...register("motherName")}
                disabled={!isEditing}
                placeholder="Mrs."
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 cursor-auto disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons (Edit / Save / Cancel) */}
        <div className="flex justify-end gap-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
            >
              <Edit className="h-5 w-5" /> Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <X className="h-5 w-5" /> Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 transition shadow-md"
              >
                {isUpdating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
