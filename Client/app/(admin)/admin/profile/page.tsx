"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

import {
  getAdminProfile,
  createAdminProfile,
  updateAdminProfile,
  type AdminProfile,
} from "@/lib/admin_api/AdminProfile.api";

// Adjust these imports based on where you saved the files
import { Section, Grid, Input, Textarea } from "./_components/ProfileUi";
import SchoolProfileSection from "./_components/SchoolProfileSection";

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.authstate);

  const [editPersonal, setEditPersonal] = useState(false);
  const [adminForm, setAdminForm] = useState<Partial<AdminProfile>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfile,
    staleTime: 1000 * 60 * 5,
  });

  const profileExists = data !== null && data !== undefined;

  const adminMutation = useMutation({
    mutationFn: (payload: Partial<AdminProfile>) =>
      profileExists ? updateAdminProfile(payload) : createAdminProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["adminProfile"], (old: any) => ({
        ...(old ?? {}),
        admin: updated,
      }));
      setEditPersonal(false);
    },
  });

  useEffect(() => {
    if (data) {
      setAdminForm({
        ...data,
        dateOfBirth: formatDate(data.dateOfBirth),
        joiningDate: formatDate(data.joiningDate),
      });
    }
  }, [data]);

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
            <Input label="Name" value={user?.name} disabled />
            <Input label="Email" value={user?.email} disabled />
            <Input label="Role" value={user?.role} disabled />
          </Grid>
        </Section>

        <Section
          title="Professional Information"
          icon={<ShieldCheck size={24} className="text-indigo-600" />}
          edit={editPersonal}
          setEdit={setEditPersonal}
          onSave={() => adminMutation.mutate(adminForm)}
          loading={adminMutation.isPending}
        >
          <Grid>
            <Input
              label="Phone"
              value={adminForm.phone}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, phone: e.target.value })
              }
            />
            <Input
              label="Designation"
              value={adminForm.designation}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, designation: e.target.value })
              }
            />
            <Input
              label="Gender"
              value={adminForm.gender}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, gender: e.target.value })
              }
            />
            <Input
              type="date"
              label="DOB"
              value={adminForm.dateOfBirth}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, dateOfBirth: e.target.value })
              }
            />
            <Input
              type="date"
              label="Joining Date"
              value={adminForm.joiningDate}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, joiningDate: e.target.value })
              }
            />
            <Input
              label="Qualification"
              value={adminForm.qualification}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({ ...adminForm, qualification: e.target.value })
              }
            />
            <Input
              type="number"
              label="Experience (Years)"
              value={adminForm.experienceYears}
              disabled={!editPersonal}
              onChange={(e: any) =>
                setAdminForm({
                  ...adminForm,
                  experienceYears: Number(e.target.value),
                })
              }
            />
          </Grid>
          <Textarea
            label="Bio"
            value={adminForm.bio}
            disabled={!editPersonal}
            onChange={(e: any) =>
              setAdminForm({ ...adminForm, bio: e.target.value })
            }
          />
        </Section>

        {/* Render the separated School Component */}
        <SchoolProfileSection
          schoolData={data?.school}
          profileExists={profileExists}
        />
      </div>
    </div>
  );
}
