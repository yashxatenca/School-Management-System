"use client";

import { useForm } from "react-hook-form";
import {
  User, Mail, Hash, School, Calendar, Phone, MapPin,
  Save, Loader2, ShieldCheck, Heart, FileDigit, Users
} from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { StudentEditableData, StudentFormData } from "@/interface/student/Student";
import { useSelector } from "react-redux";
import { RootState } from '@/app/redux/store';

// Combined type for the Form
type ProfileFormValues = StudentFormData & StudentEditableData;

export default function StudentProfilePage() {
  const user = useSelector((state: RootState) => state.studentauthstate.user);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      ...user,
      rollNumber: user?.rollNumber?.toString() || "",
      // Ensure these exist even if DB returns null initially
      dob: user?.dob || "",
      bloodGroup: user?.bloodGroup || "",
      studentPhone: user?.studentPhone || "",
      fatherName: user?.fatherName || "",
      fatherPhone: user?.fatherPhone || "",
      motherName: user?.motherName || "",
      address: user?.address || ""
    } as any // Use `as any` or Partial<ProfileFormValues> if it complains about other missing fields like classSelect
  });

  const onSubmit = async (formData: ProfileFormValues) => {
    setIsSaving(true);

    const targetStudentId = user?._id;

    // Only send the fields that belong to StudentEditableData
    const updatePayload = {
      dob: formData.dob,
      bloodGroup: formData.bloodGroup,
      studentPhone: formData.studentPhone,
      fatherName: formData.fatherName,
      fatherPhone: formData.fatherPhone,
      motherName: formData.motherName,
      address: formData.address,
    };

    console.log("🚀 FIND BY ID:", targetStudentId);
    console.log("📦 DATA TO UPDATE:", updatePayload);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 1500);
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200 text-indigo-700 text-2xl font-bold uppercase">
          {user.fullName?.charAt(0) || "S"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500">
            Student ID: <span className="font-mono text-indigo-600">{user.studentId}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =========================================================
            LEFT COLUMN: ACADEMIC IDENTITY (LOCKED)
           ========================================================= */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6">

            {/* _id hidden input removed */}

            <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold border-b border-gray-200 pb-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h2>Academic Identity</h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Official school records. Contact admin to correct these.
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-3 mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-semibold">{user.fullName}</span>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email ID</label>
                <div className="flex items-center gap-3 mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              </div>

              {/* Class & Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class</label>
                  <div className="flex items-center gap-2 mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                    <School className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold">{user.classId}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section</label>
                  <div className="mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed text-center">
                    <span className="text-sm font-bold">Sec {user.sectionId}</span>
                  </div>
                </div>
              </div>

              {/* Roll No */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Roll No</label>
                  <div className="flex items-center gap-2 mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold">{user.rollNumber}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student ID</label>
                  <div className="flex items-center gap-2 mt-1 bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                    <FileDigit className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold">{user.studentId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: EDITABLE DETAILS (SPLIT INTO SECTIONS)
           ========================================================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* --- SECTION 1: PERSONAL INFORMATION --- */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <User className="h-5 w-5 text-indigo-600" />
                <h2>Personal Information</h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  {...register("dob", { required: "Date of Birth is required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.dob && <p className="text-xs text-red-500">{errors.dob.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Blood Group <span className="text-red-500">*</span></label>
                <select
                  {...register("bloodGroup", { required: "Required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                  <option value="Other">Other</option>
                </select>
                {errors.bloodGroup && <p className="text-xs text-red-500">{errors.bloodGroup.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Student Phone</label>
                <input
                  type="tel"
                  {...register("studentPhone")}
                  placeholder="Your Personal Mobile"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* --- SECTION 2: FAMILY DETAILS --- */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Users className="h-5 w-5 text-indigo-600" />
                <h2>Family Details</h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Father's Name <span className="text-red-500">*</span></label>
                <input
                  {...register("fatherName", { required: "Required" })}
                  placeholder="Mr. Parent Name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.fatherName && <p className="text-xs text-red-500">{errors.fatherName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Father's Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  {...register("fatherPhone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Invalid Phone" } })}
                  placeholder="Emergency Contact"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.fatherPhone && <p className="text-xs text-red-500">{errors.fatherPhone.message}</p>}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Mother's Name <span className="text-red-500">*</span></label>
                <input
                  {...register("motherName", { required: "Required" })}
                  placeholder="Mrs. Parent Name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.motherName && <p className="text-xs text-red-500">{errors.motherName.message}</p>}
              </div>
            </div>
          </div>

          {/* --- SECTION 3: ADDRESS --- */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <h2>Residential Address</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-1.5">
                <textarea
                  rows={3}
                  {...register("address", { required: "Address is required" })}
                  placeholder="Full House No, Street, City, Pincode"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* SAVE BUTTON - Sticky at bottom of mobile or just at bottom */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" /> Save All Changes
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}