"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useTeacherProfile } from "./_components/useProfile";

export default function ProfilePage() {
  const authUser = useSelector(
    (state: RootState) => state.teacherauthstate.user,
  );

  const { profile, isLoading, updateProfile, isUpdating } =
    useTeacherProfile(!!authUser);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    qualification: "",
    experience: 0,
    joiningDate: "",
  });

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Backend se aaya hua data (Direct view ke liye)
  const p = profile?.data || profile;
  const hasProfile = Boolean(p && p.phone);

  // Jab user Edit button dabaye, tab form ko data se bharo
  const handleEditClick = () => {
    setFormData({
      phone: p?.phone || "",
      gender: p?.gender || "",
      dateOfBirth: p?.dateOfBirth ? formatDateForInput(p.dateOfBirth) : "",
      address: p?.address || "",
      qualification: p?.qualification || "",
      experience: p?.experience || 0,
      joiningDate: p?.joiningDate ? formatDateForInput(p.joiningDate) : "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => {
        setIsEditing(false);
        alert("Profile Saved Successfully!");
      },
      onError: () => {
        alert("Failed to save profile. Please try again.");
      },
    });
  };

  if (!authUser) return null;
  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading Profile Data...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* --- HEADER COMPONENT --- */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {authUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {authUser.name}
            </h1>
            <p className="text-gray-500">{authUser.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEditClick}
            /* Inline style se definitely green background aur white text aayega */
            style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
            className="px-5 py-2.5 font-medium rounded-lg transition"
          >
            {hasProfile ? "Edit Profile" : "Add Details"}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
              className="px-5 py-2.5 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
              className="px-5 py-2.5 font-medium rounded-lg transition disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Details"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- PERSONAL DETAILS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
            Personal Info
          </h2>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  rows={2}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Phone</span>
                <span>{p?.phone || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Gender</span>
                <span>{p?.gender || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Date of Birth</span>
                <span>
                  {p?.dateOfBirth
                    ? new Date(p.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-2 pb-2">
                <span className="text-gray-500">Address</span>
                <span>{p?.address || "N/A"}</span>
              </div>
            </div>
          )}
        </div>

        {/* --- PROFESSIONAL DETAILS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
            Professional Info
          </h2>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  placeholder="e.g., M.Sc Mathematics"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joiningDate: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Qualification</span>
                <span>{p?.qualification || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Experience</span>
                <span>{p?.experience ? `${p.experience} Years` : "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 pb-2">
                <span className="text-gray-500">Joining Date</span>
                <span>
                  {p?.joiningDate
                    ? new Date(p.joiningDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
