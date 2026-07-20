"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { toast } from "react-toastify";
import {
  Calculator,
  Save,
  UserCheck,
  BookOpen,
  FileText,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// 🚀 REAL API HOOKS
import { useTeacherSubjectAssign } from "@/hooks/Teacher/useTeacherSubjectAssign";
import { useGetStudent } from "@/hooks/Teacher/useTeacherStudent";
import { useTeacherExam } from "@/hooks/Teacher/useTeacherExams";
// Ye naya hook jo humne banaya hai (Apne path ke hisaab se adjust karein)
import { useCreateMark } from "@/hooks/Teacher/useTeacherMarks";

export default function AddMarksPage() {
  // 🎯 Redux State (Safe extraction to avoid crashes if state is empty)
  const user = useSelector((state: RootState) => state.teacherauthstate?.user);
  const classId = useSelector(
    (state: RootState) => state.teacherclassstate?.classId,
  );

  const teacherId = user?._id;
  const principalId = (user as any)?.principalId;

  // 🎛️ UI States
  const [isGradingStarted, setIsGradingStarted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  // 📝 Marks State Array
  const [marksData, setMarksData] = useState<any[]>([]);

  // 🚀 API Hooks
  const { data: assignmentsData, isLoading: isSubjectsLoading } =
    useTeacherSubjectAssign(isGradingStarted);
  const { data: studentsData } = useGetStudent();
  const { data: examsData } = useTeacherExam();

  // 🔥 NAYA MUTATION HOOK INITIALIZE KIYA
  const { mutate: createMarkMutation, isPending: isSubmitting } =
    useCreateMark();

  // 🛡️ BULLETPROOF ARRAY EXTRACTOR
  const extractArray = (apiResponse: any) => {
    if (!apiResponse) return [];
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse?.data?.data)) return apiResponse.data.data;
    if (Array.isArray(apiResponse?.data?.result))
      return apiResponse.data.result;
    if (Array.isArray(apiResponse?.data)) return apiResponse.data;
    if (Array.isArray(apiResponse?.result)) return apiResponse.result;
    return [];
  };

  // Safely extracting arrays for dropdowns
  const examsList = extractArray(examsData);
  const studentsList = extractArray(studentsData);

  // 🔄 Extract Subjects and Initialize Marks Data
  useEffect(() => {
    if (assignmentsData && marksData.length === 0) {
      // Extract array securely inside the effect
      const assignmentsList = extractArray(assignmentsData);

      const currentClassAssign = assignmentsList.find(
        (a: any) => (a.classId?._id || a.classId) === classId,
      );

      if (currentClassAssign && Array.isArray(currentClassAssign.subjectId)) {
        const initialMarks = currentClassAssign.subjectId.map((sub: any) => ({
          subjectId: sub._id || sub,
          name: sub.name || sub.subjectName || "Subject",
          maxMarks: 100,
          passingMarks: 33,
          obtainedMarks: "",
          remarks: "",
        }));
        setMarksData(initialMarks);
      }
    }
  }, [assignmentsData, classId, marksData.length]);

  // 🧮 AUTO-CALCULATIONS
  const calculations = useMemo(() => {
    let totalMax = 0;
    let totalObtained = 0;
    let isFail = false;

    marksData.forEach((mark) => {
      const max = Number(mark.maxMarks) || 100;
      const obtained = Number(mark.obtainedMarks) || 0;
      const passing = Number(mark.passingMarks) || 33;

      totalMax += max;
      totalObtained += obtained;
      if (obtained < passing && mark.obtainedMarks !== "") isFail = true;
    });

    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    // Grade Logic
    let overallGrade = "F";
    if (percentage >= 90) overallGrade = "A+";
    else if (percentage >= 80) overallGrade = "A";
    else if (percentage >= 70) overallGrade = "B";
    else if (percentage >= 60) overallGrade = "C";
    else if (percentage >= 50) overallGrade = "D";
    else if (percentage >= 33) overallGrade = "E";

    const resultStatus = isFail ? "Fail" : percentage >= 33 ? "Pass" : "Fail";

    return {
      totalMax,
      totalObtained,
      percentage: percentage.toFixed(2),
      overallGrade,
      resultStatus,
    };
  }, [marksData]);

  // 🛠️ Handlers
  const handleMarkChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newMarks = [...marksData];
    newMarks[index][field] = value;
    setMarksData(newMarks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !selectedExam) {
      toast.error("Please select both Student and Exam!");
      return;
    }

    const isComplete = marksData.every(
      (m) =>
        m.obtainedMarks !== "" &&
        Number(m.obtainedMarks) >= 0 &&
        Number(m.obtainedMarks) <= Number(m.maxMarks),
    );

    if (!isComplete) {
      toast.error("Please enter valid marks for all subjects.");
      return;
    }

    // 📦 Construct Payload
    const payload = {
      examId: selectedExam,
      studentId: selectedStudent,
      teacherId: teacherId as string,
      principalId,
      classId: classId as string,
      subjects: marksData.map((m) => ({
        subjectId: m.subjectId,
        maxMarks: m.maxMarks,
        passingMarks: m.passingMarks,
        obtainedMarks: Number(m.obtainedMarks),
        grade:
          Number(m.obtainedMarks) >= 90
            ? "A+"
            : Number(m.obtainedMarks) >= 80
              ? "A"
              : "Pass",
        remarks: m.remarks,
      })),
      totalMaxMarks: calculations.totalMax,
      totalObtainedMarks: calculations.totalObtained,
      percentage: Number(calculations.percentage),
      overallGrade: calculations.overallGrade,
      resultStatus: calculations.resultStatus,
    };

    // 🔥 HOOK KO CALL KAREIN
    createMarkMutation(payload, {
      onSuccess: () => {
        toast.success("Marks saved successfully!");

        // Success hone ke baad form reset kar dein taaki naya student select kiya ja sake
        setSelectedStudent("");

        // Marks fields ko wapas khali kar dein
        setMarksData((prev) =>
          prev.map((m) => ({
            ...m,
            obtainedMarks: "",
            remarks: "",
          })),
        );
      },
      onError: (error: any) => {
        // Backend se aane wala error message pakde (Jaise duplicate data error)
        const errorMsg =
          error.response?.data?.message ||
          "Failed to save marks. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  // Error Checks
  if (!classId || !teacherId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Class Selected</h2>
        <p>Please select a class from your dashboard first.</p>
      </div>
    );
  }

  // 🚀 INITIAL VIEW (Instantly Loads)
  if (!isGradingStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Grade Entry Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Enter student marks, and the system will automatically calculate
            totals, percentages, and final grades.
          </p>
          <button
            onClick={() => setIsGradingStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Load Students & Subjects <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 📝 MAIN GRADING VIEW
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" /> Entering Marks
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium min-w-[200px] shadow-sm"
            >
              <option value="">-- Select Exam --</option>
              {examsList.map((exam: any) => (
                <option key={exam._id} value={exam._id}>
                  {exam.name || exam.examName || "Unnamed Exam"}
                </option>
              ))}
            </select>

            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium min-w-[200px] shadow-sm"
            >
              <option value="">-- Select Student --</option>
              {studentsList.map((student: any) => (
                <option key={student._id} value={student._id}>
                  {student.name || student.studentName || "Unnamed Student"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isSubjectsLoading ? (
          <div className="h-40 bg-gray-200 animate-pulse rounded-2xl w-full"></div>
        ) : marksData.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              No subjects assigned to you for this class yet. <br />
              <span className="text-sm">
                Please make sure subjects are assigned to this class.
              </span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 📋 Form Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Subject Marks
                Entry
              </div>

              <form
                id="marksForm"
                onSubmit={handleSubmit}
                className="p-4 md:p-6 space-y-4"
              >
                {marksData.map((mark, index) => {
                  const isFailing =
                    Number(mark.obtainedMarks) < mark.passingMarks &&
                    mark.obtainedMarks !== "";

                  return (
                    <div
                      key={mark.subjectId}
                      className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center p-4 border border-gray-200 rounded-xl bg-white hover:border-blue-300 transition-all shadow-sm"
                    >
                      <div className="md:col-span-4 font-bold text-gray-900 w-full text-lg md:text-base">
                        {mark.name}
                      </div>

                      <div className="md:col-span-3 w-full relative">
                        <input
                          type="number"
                          min="0"
                          max={mark.maxMarks}
                          required
                          placeholder="Marks"
                          value={mark.obtainedMarks}
                          onChange={(e) =>
                            handleMarkChange(
                              index,
                              "obtainedMarks",
                              e.target.value,
                            )
                          }
                          className={`w-full p-2.5 pr-14 border rounded-lg outline-none focus:ring-2 transition-all font-semibold text-gray-900 ${
                            isFailing
                              ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                          }`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 font-medium border-l pl-2 border-gray-300">
                            / {mark.maxMarks}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 w-full">
                        <input
                          type="text"
                          placeholder="Remarks (Optional)"
                          value={mark.remarks}
                          onChange={(e) =>
                            handleMarkChange(index, "remarks", e.target.value)
                          }
                          className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </form>
            </div>

            {/* 📊 Auto Calculation Section */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white sticky top-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4 text-white">
                  <UserCheck className="w-6 h-6 text-blue-400" /> Result Preview
                </h3>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium text-gray-300">
                      Total Marks
                    </span>
                    <span className="font-bold text-white text-xl bg-gray-800 px-3 py-1 rounded-lg">
                      {calculations.totalObtained}{" "}
                      <span className="text-sm text-gray-400">
                        / {calculations.totalMax}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium text-gray-300">
                      Percentage
                    </span>
                    <span className="font-bold text-white text-xl">
                      {calculations.percentage}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium text-gray-300">
                      Overall Grade
                    </span>
                    <span className="font-black text-amber-400 text-2xl drop-shadow-md">
                      {calculations.overallGrade}
                    </span>
                  </div>

                  <div className="pt-5 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      Final Status
                    </span>
                    <span
                      className={`px-5 py-1.5 rounded-xl text-sm font-black uppercase tracking-wider ${
                        calculations.resultStatus === "Pass"
                          ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                          : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      }`}
                    >
                      {calculations.resultStatus}
                    </span>
                  </div>
                </div>

                <button
                  form="marksForm"
                  type="submit"
                  disabled={isSubmitting || !selectedStudent || !selectedExam}
                  className="w-full mt-8 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:bg-gray-700 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "Saving Data..." : "Save Marks"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
