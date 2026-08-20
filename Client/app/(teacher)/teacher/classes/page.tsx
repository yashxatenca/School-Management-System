"use client";

import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store";
import { useTeacherSubjectAssignForClass as useTeacherSubjectAssign } from "@/hooks/Teacher/useTeacherSubjectAssign";

interface MappedSubjectTeacher {
  subject: string;
  teacherName: string;
}

const SubjectCard = memo(({ subj }: { subj: MappedSubjectTeacher }) => (
  <div className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all">
    <div>
      <h3 className="font-semibold text-gray-900">{subj.subject}</h3>
      <p className="text-sm text-gray-500 mt-1">Teacher : {subj.teacherName}</p>
    </div>

    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
      {subj.subject.charAt(0).toUpperCase()}
    </div>
  </div>
));

SubjectCard.displayName = "SubjectCard";

export default function ClassDetailsPage() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.teacherauthstate);

  const classData = useSelector((state: RootState) => state.teacherclassstate);

  const { data: assignResponse, isLoading } = useTeacherSubjectAssign();

  const subjectList = useMemo<MappedSubjectTeacher[]>(() => {
    const assignments =
      assignResponse?.data?.data ?? assignResponse?.data ?? [];

    if (!Array.isArray(assignments)) return [];

    const mapped = assignments.flatMap((item: any) => {
      const teacherName =
        item?.classId?.teacherId?.name ||
        item?.classTeacherId?.name ||
        "Unassigned";

      const subjects = Array.isArray(item?.subjectId)
        ? item.subjectId
        : item?.subjectId
          ? [item.subjectId]
          : [];

      return subjects.map((subject: any) => ({
        subject: subject?.name || subject?.subjectName || "Subject",
        teacherName,
      }));
    });

    return mapped.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.subject === value.subject && t.teacherName === value.teacherName,
        ),
    );
  }, [assignResponse]);

  if (!classData || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">Loading Class Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900">
            Class {classData.className}
            <span className="text-blue-600 mx-2">|</span>
            <span className="font-normal">Section {classData.sectionName}</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-lg mb-5">Quick Overview</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-sm">Class Teacher</p>

                  <p className="font-semibold">{user?.name || "N/A"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Students</p>

                  <p className="font-semibold">{classData.totalStudent || 0}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Academic Session</p>

                  <p className="font-semibold">{classData.academicSession}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow">
              <div className="border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Subject Teachers</h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {subjectList.length} Subjects
                </span>
              </div>

              <div className="p-6">
                {subjectList.length ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    {subjectList.map((subject, index) => (
                      <SubjectCard
                        key={`${subject.subject}-${index}`}
                        subj={subject}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    No Subjects Assigned
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
