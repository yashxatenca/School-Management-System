"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileForm({ initialData, authId }: { initialData: any, authId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/teacher/profile/${authId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/teacher/profile/${authId}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select name="gender" value={formData.gender || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Qualification</label>
          <input type="text" name="qualification" value={formData.qualification || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
          <input type="number" name="experience" value={formData.experience || 0} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="address" value={formData.address || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" rows={3} />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}