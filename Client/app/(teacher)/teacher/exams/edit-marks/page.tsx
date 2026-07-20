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
  AlertCircle,
  RefreshCw,
  Search,
  Edit,
  X,
} from "lucide-react";

// 🚀 REAL API HOOKS
import { useGetStudent } from "@/hooks/Teacher/useTeacherStudent";
import { useTeacherExam } from "@/hooks/Teacher/useTeacherExams";

// 🔥 AAPKE ACTUAL MARKS HOOKS
import { useGetMarks, useUpdateMark } from "@/hooks/Teacher/useTeacherMarks"; // Apna correct path verify karein

export default function EditMarksPage() {
  // 🎯 Redux State
  const user = useSelector((state: RootState) => state.teacherauthstate?.user);
  const classId = useSelector(
    (state: RootState) => state.teacherclassstate?.classId,
  );
  const teacherId = user?._id;

  // FIX: Typecast user to 'any' to bypass strict TeacherUser type checking
  const principalId = (user as any)?.principalId;

  // 🎛️ UI States
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  // ✏️ Edit & Data States
  const [isEditable, setIsEditable] = useState(false);
  const [marksData, setMarksData] = useState<any[]>([]);
  const [recordId, setRecordId] = useState("");

  // 🚀 Base Data API Hooks
  const { data: studentsData } = useGetStudent();
  const { data: examsData } = useTeacherExam();

  // 🔥 Fetch Specific Marks using your `useGetMarks` with filters
  const { data: fetchedMarksData, isLoading: isFetching } = useGetMarks({
    studentId: selectedStudent,
    examId: selectedExam,
    classId: classId as string,
  });

  // 🔥 Update Mutation
  const { mutate: updateMarkMutation, isPending: isUpdating } = useUpdateMark();

  // 🛡️ Array Extractor
  const extractArray = (apiResponse: any) => {
    if (!apiResponse) return [];
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse?.data?.data)) return apiResponse.data.data;
    if (Array.isArray(apiResponse?.data?.result))
      return apiResponse.data.result;
    if (Array.isArray(apiResponse?.data)) return apiResponse.data;
    return [];
  };

  const examsList = extractArray(examsData);
  const studentsList = extractArray(studentsData);

  // 🔄 Sync fetched data to State
  useEffect(() => {
    setIsEditable(false); // Naya filter select hote hi form lock ho jayega

    // useGetMarks ek list return karega (kyunki filters use kiye hain)
    // Hum list me se pehla record nikal lenge
    const recordsArray = extractArray(fetchedMarksData);
    const record = recordsArray.length > 0 ? recordsArray[0] : null;

    if (
      selectedStudent &&
      selectedExam &&
      record &&
      record.subjects?.length > 0
    ) {
      setRecordId(record._id);

      const formattedMarks = record.subjects.map((sub: any) => ({
        subjectId: sub.subjectId?._id || sub.subjectId,
        name: sub.subjectId?.name || sub.subjectId?.subjectName || "Subject",
        maxMarks: sub.maxMarks || 100,
        passingMarks: sub.passingMarks || 33,
        obtainedMarks: sub.obtainedMarks,
        remarks: sub.remarks || "",
      }));
      setMarksData(formattedMarks);
    } else {
      setMarksData([]);
      setRecordId("");
    }
  }, [fetchedMarksData, selectedStudent, selectedExam]);

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

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    updateMarkMutation(
      { id: recordId, data: payload },
      {
        onSuccess: () => {
          toast.success("Marks updated successfully!");
          setIsEditable(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to update marks.",
          );
        },
      },
    );
  };

  if (!classId || !teacherId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Class Selected</h2>
        <p>Please select a class from your dashboard first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 🔍 SEARCH HEADER SECTION */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" /> Search & Edit Marks
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium min-w-[200px]"
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
              className="p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium min-w-[200px]"
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

        {/* 🔄 CONDITIONAL RENDERING */}
        {!selectedStudent || !selectedExam ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-lg">
              Please select both Exam and Student to view marks.
            </p>
          </div>
        ) : isFetching ? (
          <div className="flex flex-col items-center justify-center h-40 bg-white border border-gray-200 rounded-2xl w-full">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-500 font-medium">Searching records...</p>
          </div>
        ) : marksData.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-lg">
              No marks record found for this student in the selected exam.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 📋 FORM SECTION */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Student Marks
                </div>
                {isEditable && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider">
                    Editing Mode ON
                  </span>
                )}
              </div>

              <form
                id="marksUpdateForm"
                onSubmit={handleUpdateSubmit}
                className="p-4 md:p-6 space-y-4"
              >
                {marksData.map((mark, index) => {
                  const isFailing =
                    Number(mark.obtainedMarks) < mark.passingMarks &&
                    mark.obtainedMarks !== "";

                  return (
                    <div
                      key={mark.subjectId}
                      className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center p-4 border rounded-xl transition-all shadow-sm
                        ${isEditable ? "bg-white border-blue-200 hover:border-blue-400" : "bg-gray-50 border-gray-200 opacity-90"}`}
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
                          disabled={!isEditable}
                          value={mark.obtainedMarks}
                          onChange={(e) =>
                            handleMarkChange(
                              index,
                              "obtainedMarks",
                              e.target.value,
                            )
                          }
                          className={`w-full p-2.5 pr-14 border rounded-lg outline-none focus:ring-2 font-semibold text-gray-900 
                            ${!isEditable ? "bg-gray-100 cursor-not-allowed" : isFailing ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 font-medium border-l pl-2">
                            / {mark.maxMarks}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 w-full">
                        <input
                          type="text"
                          disabled={!isEditable}
                          placeholder={
                            isEditable ? "Remarks (Optional)" : "No Remarks"
                          }
                          value={mark.remarks}
                          onChange={(e) =>
                            handleMarkChange(index, "remarks", e.target.value)
                          }
                          className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 
                            ${!isEditable ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500" : "bg-white border-gray-300 focus:ring-blue-200 text-gray-900"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </form>
            </div>

            {/* 📊 RESULT PREVIEW & ACTION BUTTONS */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white sticky top-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
                  <UserCheck className="w-6 h-6 text-blue-400" /> Result Preview
                </h3>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium">Total Marks</span>
                    <span className="font-bold text-white text-xl bg-gray-800 px-3 py-1 rounded-lg">
                      {calculations.totalObtained}{" "}
                      <span className="text-sm text-gray-400">
                        / {calculations.totalMax}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium">Percentage</span>
                    <span className="font-bold text-white text-xl">
                      {calculations.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium">Grade</span>
                    <span className="font-black text-amber-400 text-2xl drop-shadow-md">
                      {calculations.overallGrade}
                    </span>
                  </div>
                  <div className="pt-5 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Status</span>
                    <span
                      className={`px-5 py-1.5 rounded-xl text-sm font-black uppercase tracking-wider ${calculations.resultStatus === "Pass" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {calculations.resultStatus}
                    </span>
                  </div>
                </div>

                {/* 🎛️ ACTION BUTTONS SWITCH */}
                {!isEditable ? (
                  <button
                    onClick={() => setIsEditable(true)}
                    className="w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
                  >
                    <Edit className="w-5 h-5" /> Enable Editing
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      form="marksUpdateForm"
                      type="submit"
                      disabled={isUpdating}
                      className="w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-lg border border-white text-white bg-transparent hover:bg-white/10 transition-all shadow-md disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />{" "}
                      {isUpdating ? "Updating..." : "Update Marks"}
                    </button>

                    <button
                      onClick={() => setIsEditable(false)}
                      className="w-full font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-base bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 transition-all"
                    >
                      <X className="w-4 h-4" /> Cancel Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
