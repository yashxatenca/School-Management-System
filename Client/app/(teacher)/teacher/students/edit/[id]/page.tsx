"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  Loader2, 
  Save, 
  Trash2, 
  ArrowLeft, 
  UserCog, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "react-toastify";

// 1. Import API functions
import { getStudentById, updateStudent, deleteStudent } from "@/lib/Student/Student.teacher.api";

// --- CONFIGURATION ---
const CLASSES = ["PG", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SECTIONS = ["A", "B", "C", "D", "E"];

// --- TYPES ---
interface StudentFormData {
  fullName: string;
  email: string;
  gender: string;
  rollNumber: string;
  classSelect: string;
  customClass?: string;
  sectionSelect: string;
  customSection?: string;
}

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id as string; // Get ID from URL
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>();

  // Watch fields for conditional rendering
  const selectedClass = watch("classSelect");
  const selectedSection = watch("sectionSelect");

  // ==========================
  // 1. FETCH STUDENT DATA
  // ==========================
  const { data: student, isLoading: isFetching, isError } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res = await getStudentById(studentId);
      return res.data || res; // Handle if API wraps data
    },
    enabled: !!studentId, // Only fetch if ID exists
  });

  // ==========================
  // 2. PRE-FILL FORM
  // ==========================
  useEffect(() => {
    if (student) {
      setValue("fullName", student.fullName);
      setValue("email", student.email);
      setValue("gender", student.gender);
      setValue("rollNumber", student.rollNumber);

      // Logic: Check if class is standard or custom
      if (CLASSES.includes(student.classId)) {
        setValue("classSelect", student.classId);
      } else {
        setValue("classSelect", "Other");
        setValue("customClass", student.classId);
      }

      // Logic: Check if section is standard or custom
      if (SECTIONS.includes(student.sectionId)) {
        setValue("sectionSelect", student.sectionId);
      } else {
        setValue("sectionSelect", "Other");
        setValue("customSection", student.sectionId);
      }
    }
  }, [student, setValue]);

  // ==========================
  // 3. UPDATE MUTATION
  // ==========================
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateStudent(data),
    onSuccess: () => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      router.push("/teacher/students/show"); // Redirect back to list
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update student.");
    },
  });

  // ==========================
  // 4. DELETE MUTATION
  // ==========================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      toast.success("Student deleted permanently.");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      router.push("/teacher/students/show");
    },
    onError: (error: any) => {
      toast.error("Failed to delete student.");
    },
  });

  // --- HANDLERS ---
  const onSubmit = (data: StudentFormData) => {
    const finalPayload = {
      studentId, // Important: Send ID to identify which student to update
      fullName: data.fullName,
      email: data.email,
      gender: data.gender,
      rollNumber: data.rollNumber,
      classId: data.classSelect === "Other" ? data.customClass : data.classSelect,
      sectionId: data.sectionSelect === "Other" ? data.customSection : data.sectionSelect,
    };
    updateMutation.mutate(finalPayload);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      deleteMutation.mutate(studentId);
    }
  };

  // --- LOADING / ERROR STATES ---
  if (isFetching) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load student data.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.back()} 
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm mb-2 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to List
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-indigo-600" />
            Edit Student Details
          </h1>
        </div>
        
        {/* Delete Button (Top Right Shortcut) */}
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
          title="Delete Student"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Identity */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                Basic Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    {...register("fullName", { required: "Name is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Class Info */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                Class Allocation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Class */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Class</label>
                  <select
                    {...register("classSelect", { required: true })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {CLASSES.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                    <option value="Other">+ Other</option>
                  </select>
                  {selectedClass === "Other" && (
                    <input
                      {...register("customClass", { required: true })}
                      placeholder="Type Class"
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50"
                    />
                  )}
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Section</label>
                  <select
                    {...register("sectionSelect", { required: true })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {SECTIONS.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
                    <option value="Other">+ Other</option>
                  </select>
                  {selectedSection === "Other" && (
                    <input
                      {...register("customSection", { required: true })}
                      placeholder="Type Section"
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50"
                    />
                  )}
                </div>

                {/* Roll No */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Roll No</label>
                  <input
                    {...register("rollNumber", { required: true })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Contact (Email) */}
            <div>
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b pb-2">
                Contact Info
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              
              {/* DELETE BUTTON (Left Side) */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Student
              </button>

              {/* SAVE BUTTONS (Right Side) */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}