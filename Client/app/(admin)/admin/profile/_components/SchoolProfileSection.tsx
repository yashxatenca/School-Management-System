"use client";

import React, { useState, useEffect } from "react";
import { School, Loader2 } from "lucide-react";
import { Section, Grid, Input, Textarea } from "./ProfileUi";

// Import Custom Hooks and Types
import {
  useSchoolInfoQuery,
  useSchoolInfoMutation,
} from "@/hooks/Admin/useAdminProfile";
import { type SchoolInfo } from "@/lib/Admin/AdminProfile.api";

export default function SchoolProfileSection() {
  const [editSchool, setEditSchool] = useState(false);
  const [schoolForm, setSchoolForm] = useState<Partial<SchoolInfo>>({});

  // Use Custom Hooks
  const { data: schoolData, isLoading } = useSchoolInfoQuery();
  const { mutate: saveSchool, isPending: isSaving } = useSchoolInfoMutation(
    () => setEditSchool(false),
  );

  // Safe Prefill
  useEffect(() => {
    if (schoolData && !editSchool) {
      setSchoolForm(schoolData);
    }
  }, [schoolData, editSchool]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 bg-white rounded-2xl shadow-lg border border-gray-200">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
        <span className="ml-3 text-gray-600">
          Loading School Information...
        </span>
      </div>
    );
  }

  return (
    <Section
      title="School Information"
      icon={<School size={24} className="text-indigo-600" />}
      edit={editSchool}
      setEdit={setEditSchool}
      onSave={() => saveSchool(schoolForm)}
      loading={isSaving}
    >
      <Grid>
        <Input
          label="School Name"
          value={schoolForm.schoolName || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, schoolName: e.target.value })
          }
        />
        <Input
          label="School Code"
          value={schoolForm.schoolCode || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, schoolCode: e.target.value })
          }
        />
        <Input
          label="Affiliation Number"
          value={schoolForm.affiliationNumber || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, affiliationNumber: e.target.value })
          }
        />
        <Input
          label="Established Year"
          value={schoolForm.establishedYear || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, establishedYear: e.target.value })
          }
        />
        <Input
          label="Board"
          value={schoolForm.board || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, board: e.target.value })
          }
        />
        <Input
          label="School Type"
          value={schoolForm.schoolType || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, schoolType: e.target.value })
          }
        />
        <Input
          label="Website"
          value={schoolForm.website || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, website: e.target.value })
          }
        />
        <Input
          label="Support Email"
          type="email"
          value={schoolForm.supportEmail || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, supportEmail: e.target.value })
          }
        />
        <Input
          label="School Phone"
          value={schoolForm.schoolPhone || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({ ...schoolForm, schoolPhone: e.target.value })
          }
        />
        <Input
          label="Total Students"
          type="number"
          value={schoolForm.totalStudents || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({
              ...schoolForm,
              totalStudents: Number(e.target.value),
            })
          }
        />
        <Input
          label="Total Teachers"
          type="number"
          value={schoolForm.totalTeachers || ""}
          disabled={!editSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSchoolForm({
              ...schoolForm,
              totalTeachers: Number(e.target.value),
            })
          }
        />
      </Grid>

      <Textarea
        label="School Motto"
        value={schoolForm.motto || ""}
        disabled={!editSchool}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setSchoolForm({ ...schoolForm, motto: e.target.value })
        }
      />

      <Textarea
        label="Complete Address"
        value={schoolForm.address || ""}
        disabled={!editSchool}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setSchoolForm({ ...schoolForm, address: e.target.value })
        }
      />
    </Section>
  );
}
