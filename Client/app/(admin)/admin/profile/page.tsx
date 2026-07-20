"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

// Import Custom Hooks
import {
  useAdminProfileQuery,
  useAdminProfileMutation,
} from "@/hooks/Admin/useAdminProfile";

// Import UI Components
import { Section, Grid, Input, Textarea } from "./_components/ProfileUi";
import SchoolProfileSection from "./_components/SchoolProfileSection";

// TypeScript Interface
interface AdminProfileData {
  phone?: string;
  designation?: string;
  gender?: string;
  dateOfBirth?: string;
  joiningDate?: string;
  qualification?: string;
  experienceYears?: number | string;
  bio?: string;
  [key: string]: any;
}

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AdminProfilePage() {
  const { user } = useSelector((state: RootState) => state.authstate);

  const [editPersonal, setEditPersonal] = useState(false);
  const [adminForm, setAdminForm] = useState<AdminProfileData>({});

  const { data, isLoading, isError } = useAdminProfileQuery();
  const profileExists = data !== null && data !== undefined;

  const { mutate: saveProfile, isPending: isSaving } = useAdminProfileMutation(
    profileExists,
    () => setEditPersonal(false),
  );

  // FIX: Helper to handle save
  const handleSave = () => {
    // ExperienceYears ko explicit number mein convert karke bhejein taaki build pass ho
    const payload = {
      ...adminForm,
      experienceYears: adminForm.experienceYears
        ? Number(adminForm.experienceYears)
        : 0,
    };
    saveProfile(payload);
  };

  useEffect(() => {
    if (data && !editPersonal) {
      const profileData = data as any;
      setAdminForm({
        ...profileData,
        dateOfBirth: formatDate(profileData.dateOfBirth),
        joiningDate: formatDate(profileData.joiningDate),
      });
    }
  }, [data, editPersonal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-500 gap-4">
        <AlertCircle size={40} />
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <Section
          title="Basic Information"
          icon={<ShieldCheck size={24} className="text-indigo-600" />}
          editable={false}
        >
          <Grid>
            <Input label="Name" value={user?.name || ""} disabled />
            <Input label="Email" value={user?.email || ""} disabled />
            <Input label="Role" value={user?.role || ""} disabled />
          </Grid>
        </Section>

        <Section
          title="Professional Information"
          icon={<ShieldCheck size={24} className="text-indigo-600" />}
          edit={editPersonal}
          setEdit={setEditPersonal}
          // FIX: Call the wrapper function instead of direct saveProfile
          onSave={handleSave}
          loading={isSaving}
        >
          <Grid>
            <Input
              label="Phone"
              value={adminForm.phone || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, phone: e.target.value })
              }
            />
            <Input
              label="Designation"
              value={adminForm.designation || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, designation: e.target.value })
              }
            />
            <Input
              label="Gender"
              value={adminForm.gender || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, gender: e.target.value })
              }
            />
            <Input
              type="date"
              label="DOB"
              value={adminForm.dateOfBirth || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, dateOfBirth: e.target.value })
              }
            />
            <Input
              type="date"
              label="Joining Date"
              value={adminForm.joiningDate || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, joiningDate: e.target.value })
              }
            />
            <Input
              label="Qualification"
              value={adminForm.qualification || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({ ...adminForm, qualification: e.target.value })
              }
            />
            <Input
              type="number"
              label="Experience (Years)"
              value={adminForm.experienceYears || ""}
              disabled={!editPersonal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminForm({
                  ...adminForm,
                  experienceYears: e.target.value, // Keep string in state, convert on save
                })
              }
            />
          </Grid>
          <Textarea
            label="Bio"
            value={adminForm.bio || ""}
            disabled={!editPersonal}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAdminForm({ ...adminForm, bio: e.target.value })
            }
          />
        </Section>

        <SchoolProfileSection />
      </div>
    </div>
  );
}
