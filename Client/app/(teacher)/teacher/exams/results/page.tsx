"use client";

import React, { useState } from "react";
import { useStudentResult } from "./_components/useResult";
import { ReportCard } from "./_components/ReportCard";
import {
  AlertCircle,
  Search,
  BookOpen,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

import { useTeacherExam } from "@/hooks/Teacher/useTeacherExams";
import { useGetStudent } from "@/hooks/Teacher/useTeacherStudent";

// Updated Data Formatter matching your API Response
const formatResultData = (rawData: any) => {
  // Axios response structure handle karne ke liye
  const resultData = rawData?.data?.data || rawData?.data || rawData;

  if (!resultData || !resultData.student) return null;

  return {
    schoolName: resultData.schoolName || "N/A",
    schoolAddress: resultData.schoolAddress || "N/A",
    examName: resultData.examName || "Term Examination",
    student: {
      name: resultData.student?.name || "N/A",
      studentId: resultData.student?.studentId || "N/A",
      class: resultData.student?.class || "N/A",
    },
    subjects:
      resultData.subjects?.map((sub: any) => ({
        name: sub?.name?.name || sub?.name || "Subject Name",
        max: sub?.max || 100,
        passing: sub?.passing || 33,
        obtained: sub?.obtained || 0,
        grade: sub?.grade || "-",
        remarks: sub?.remarks || "-",
      })) || [],
    summary: {
      totalMax: resultData.summary?.totalMax || 0,
      totalObtained: resultData.summary?.totalObtained || 0,
      percentage: resultData.summary?.percentage || 0,
      overallGrade: resultData.summary?.overallGrade || "-",
      resultStatus: resultData.summary?.resultStatus || "Pending",
    },
  };
};

export default function ResultsPage() {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: exams, isLoading: isLoadingExams } = useTeacherExam();
  const { data: students, isLoading: isLoadingStudents } = useGetStudent();

  const {
    data: rawData,
    isFetching,
    isError,
    error,
    refetch,
  } = useStudentResult(selectedExamId, selectedStudentId, shouldFetch);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamId(e.target.value);
    setSelectedStudentId("");
    setShouldFetch(false);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(e.target.value);
    setShouldFetch(false);
  };

  const handleFetchResult = () => {
    if (!selectedExamId || !selectedStudentId) return;

    if (shouldFetch) {
      refetch();
    } else {
      setShouldFetch(true);
    }
  };

  const formattedData = rawData ? formatResultData(rawData) : null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-8 font-sans">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Results</h1>
          <p className="text-gray-500 text-sm mt-1">
            Select an exam and student to view the academic report.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                1. Select Exam
              </label>
              <div className="relative">
                <select
                  value={selectedExamId}
                  onChange={handleExamChange}
                  disabled={isLoadingExams}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">
                    {isLoadingExams ? "Loading Exams..." : "-- Choose Exam --"}
                  </option>
                  {/* Fixed key prop here from exam.id to exam._id */}
                  {exams?.data?.result?.map((exam: any) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label
                className={`text-sm font-semibold flex items-center gap-2 ${!selectedExamId ? "text-gray-400" : "text-gray-700"}`}
              >
                <GraduationCap
                  className={`w-4 h-4 ${!selectedExamId ? "text-gray-400" : "text-blue-600"}`}
                />
                2. Select Student
              </label>
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={handleStudentChange}
                  disabled={!selectedExamId || isLoadingStudents}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">
                    {isLoadingStudents
                      ? "Loading Students..."
                      : "-- Choose Student --"}
                  </option>
                  {/* Fixed key prop here from student.id to student._id */}
                  {students?.data?.map((student: any) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-4">
              <button
                onClick={handleFetchResult}
                disabled={!selectedExamId || !selectedStudentId || isFetching}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all"
              >
                {isFetching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isFetching ? "Fetching..." : "View Result"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isError && (
        <div className="max-w-4xl mx-auto w-full bg-red-50 p-6 rounded-2xl border border-red-200 text-center text-red-600 animate-in fade-in slide-in-from-bottom-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-bold">Error loading result</p>
          <p className="text-sm mt-1">
            {error?.message ||
              "Something went wrong while fetching the records."}
          </p>
        </div>
      )}

      {!isFetching && !isError && shouldFetch && !formattedData && (
        <div className="max-w-4xl mx-auto w-full bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Result Found
          </h2>
          <p className="text-gray-500 text-sm">
            Marks have not been published for this student in the selected
            examination yet.
          </p>
        </div>
      )}

      {!isFetching && !isError && shouldFetch && formattedData && (
        <div className="max-w-4xl mx-auto w-full mt-4">
          <ReportCard data={formattedData} />
        </div>
      )}
    </div>
  );
}
