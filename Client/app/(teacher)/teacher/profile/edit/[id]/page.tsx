"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateTeacherProfile, createTeacherProfile, getTeacherProfile } from "@/lib/Teacher/teacher.profile.api"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to format MongoDB Date to HTML Input Date (YYYY-MM-DD)
const formatDateForInput = (dateString: string | undefined | null) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split('T')[0];
};

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 1. Initial State updated with all schema fields
  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    dateOfBirth: "",
    qualification: "",
    experience: 0,
    joiningDate: "",
    address: "",
  });

  // 2. Fetch Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["teacherProfile"], 
    queryFn: getTeacherProfile,
    retry: false, 
  });

  // 3. Populate Form when data arrives
  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        gender: profile.gender || "",
        dateOfBirth: formatDateForInput(profile.dateOfBirth),
        qualification: profile.qualification || "",
        experience: profile.experience || 0,
        joiningDate: formatDateForInput(profile.joiningDate),
        address: profile.address || "",
      });
    }
  }, [profile]);

  // 4. Mutation Logic
  const mutation = useMutation({
    mutationFn: (payload: any) => {
      return profile ? updateTeacherProfile(payload) : createTeacherProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] }); 
      alert(profile ? "Profile updated successfully!" : "Profile created successfully!");
      router.push(`/teacher/profile`);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Something went wrong.");
    }
  });

  // Handle generic input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass formData to mutation
    mutation.mutate(formData);
  };

  if (isLoading) return <p className="p-10 text-center font-medium text-gray-500">Loading Profile Details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {profile ? "Update Profile Details" : "Complete Your Profile"}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Grid Container for Side-by-Side inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input 
              name="phone"
              type="tel"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
            <select 
              name="gender"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <input 
              name="dateOfBirth"
              type="date"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Joining Date</label>
            <input 
              name="joiningDate"
              type="date"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Highest Qualification</label>
            <input 
              name="qualification"
              type="text"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. M.Tech, Ph.D."
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years)</label>
            <input 
              name="experience"
              type="number"
              min="0"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Address (Full Width) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
          <textarea 
            name="address"
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full residential address"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all shadow-sm"
        >
          {mutation.isPending ? "Saving..." : (profile ? "Update Profile" : "Save Profile")}
        </button>
      </form>
    </div>
  );
}