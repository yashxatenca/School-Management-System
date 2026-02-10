"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { StudentFormData } from "@/interface/Student";

// --- CONFIGURATION ---
const CLASSES = ["PG", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SECTIONS = ["A", "B", "C", "D", "E"];

// --- FORM DATA TYPE ---


// --- MOCK API ---
const createStudentApi = async (data: any) => {
  // Logic to swap "Other" with actual custom values happens before this function is called
  console.log("🚀 Sending to Backend:", data); 
  return new Promise((resolve) => setTimeout(resolve, 1500));
};

export default function CreateStudentPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch, // Needed to see what user selected
    formState: { errors },
    reset
  } = useForm<StudentFormData>();

  // Watch the dropdowns to conditionally show input fields
  const selectedClass = watch("classSelect");
  const selectedSection = watch("sectionSelect");

  const mutation = useMutation({
    mutationFn: createStudentApi, 
    onSuccess: () => {
      toast.success("Student account created successfully!");
      reset(); 
    },
    onError: (error) => {
      toast.error("Failed to create student.");
      console.error(error);
    },
  });

  const onSubmit = (data: StudentFormData) => {
    // 1. Prepare the final payload
    const finalPayload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      rollNumber: data.rollNumber,
      
      // Logic: If "Other" is selected, use the custom field. Otherwise, use the dropdown.
      classId: data.classSelect === "Other" ? data.customClass : data.classSelect,
      sectionId: data.sectionSelect === "Other" ? data.customSection : data.sectionSelect,
    };

    console.log(finalPayload)

    // 2. Send to API
    mutation.mutate(finalPayload);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            New Student Admission
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create a basic account. Use "Other" for custom classes or sections.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Identity */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                1. Basic Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input
                    {...register("fullName", { required: "Name is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                </div>
              </div>
            </div>

            {/* 2. Academic Allocation (DYNAMIC) */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                2. Class Allocation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* --- CLASS SELECTION --- */}
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Class <span className="text-red-500">*</span></label>
                    <select
                      {...register("classSelect", { required: "Class is required" })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="">Select Class</option>
                      {CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                      <option value="Other" className="font-bold text-indigo-600">+ Other (Type manually)</option>
                    </select>
                    {errors.classSelect && <p className="text-xs text-red-500">{errors.classSelect.message}</p>}
                  </div>

                  {/* Condition: Show text input if "Other" is selected */}
                  {selectedClass === "Other" && (
                     <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                       <input
                         {...register("customClass", { required: "Please type the class name" })}
                         placeholder="Type Class (e.g. Diploma)"
                         className="w-full px-4 py-2 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none bg-indigo-50/30 text-indigo-700 placeholder:text-indigo-300"
                       />
                       {errors.customClass && <p className="text-xs text-red-500 mt-1">{errors.customClass.message}</p>}
                     </div>
                  )}
                </div>

                {/* --- SECTION SELECTION --- */}
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Section <span className="text-red-500">*</span></label>
                    <select
                      {...register("sectionSelect", { required: "Section is required" })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="">Select Section</option>
                      {SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                      <option value="Other" className="font-bold text-indigo-600">+ Other (Type manually)</option>
                    </select>
                    {errors.sectionSelect && <p className="text-xs text-red-500">{errors.sectionSelect.message}</p>}
                  </div>

                  {/* Condition: Show text input if "Other" is selected */}
                  {selectedSection === "Other" && (
                     <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                       <input
                         {...register("customSection", { required: "Please type the section" })}
                         placeholder="Type Section (e.g. F, Z, Top)"
                         className="w-full px-4 py-2 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none bg-indigo-50/30 text-indigo-700 placeholder:text-indigo-300"
                       />
                       {errors.customSection && <p className="text-xs text-red-500 mt-1">{errors.customSection.message}</p>}
                     </div>
                  )}
                </div>

                {/* Roll Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Roll No <span className="text-red-500">*</span></label>
                  <input
                    {...register("rollNumber", { required: "Roll No is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 101"
                  />
                  {errors.rollNumber && <p className="text-xs text-red-500">{errors.rollNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* 3. Credentials */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                3. Login Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="student@school.com"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                  <input
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 chars" }
                    })}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Create password and password be: 123"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Student
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}