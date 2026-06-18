"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useGetExamWithClassId } from "@/hooks/Student/useStudentExam";
import { useFetchResult } from "@/hooks/Student/useStudentResult";

const StudentResultDashboard = () => {
  const user = useSelector((state: RootState) => state.studentauthstate.user);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: examData, isLoading: listLoading } = useGetExamWithClassId();
  const {
    data: responseData,
    isFetching: loading,
    refetch: fetchData,
  } = useFetchResult(selectedExamId);

  // Extract data correctly based on the updated response structure
  const resultData = responseData?.success ? responseData.result : null;
  const subjects = resultData?.subjects || [];

  useEffect(() => {
    if (
      examData?.exam &&
      Array.isArray(examData.exam) &&
      examData.exam.length > 0
    ) {
      setExams(examData.exam);
      if (!selectedExamId) {
        setSelectedExamId(examData.exam[0]._id);
      }
    }
  }, [examData]);

  const handleFetchData = () => {
    if (selectedExamId) fetchData();
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    const printContent = reportRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Result Report - Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { padding: 40px; font-family: sans-serif; background-color: white !important; }
            @page { size: auto; margin: 0mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Exam Result Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select an exam to view your results
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="w-48">
            <select
              className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              disabled={listLoading || exams.length === 0}
            >
              {listLoading ? (
                <option>Loading exams...</option>
              ) : exams.length > 0 ? (
                exams.map((exam: any) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title || exam.name || "Unnamed Exam"}
                  </option>
                ))
              ) : (
                <option>No Exams Found</option>
              )}
            </select>
          </div>

          <button
            onClick={handleFetchData}
            disabled={!selectedExamId || loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-5 py-2.5 rounded-md shadow transition duration-150"
          >
            {loading ? "Fetching..." : "View Result"}
          </button>

          <button
            onClick={handlePrint}
            disabled={!resultData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2.5 rounded-md shadow transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
              />
            </svg>
            Print
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-10">
          <p className="text-gray-500 font-medium">Loading result data...</p>
        </div>
      ) : resultData ? (
        <div
          ref={reportRef}
          className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="mb-8 border-b-2 border-gray-300 pb-5 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              EXAM RESULT REPORT
            </h1>
            <p className="text-xl text-gray-700 mt-1">
              {resultData.examId?.name || "Result Details"}
            </p>

            <div className="flex justify-between mt-8 text-left text-sm font-medium text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-100">
              <div>
                <p className="mb-1">
                  Student Name:{" "}
                  <span className="font-semibold text-blue-800">
                    {resultData.studentId?.name || user?.name || "N/A"}
                  </span>
                </p>
                <p>
                  Email/Roll No:{" "}
                  <span className="font-semibold">
                    {resultData.studentId?.email || user?.rollNumber || "N/A"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="mb-1">
                  Class:{" "}
                  <span className="font-semibold">
                    {resultData.classId?.name} - {resultData.classId?.section}
                  </span>
                </p>
                <p>
                  Academic Year:{" "}
                  <span className="font-semibold">
                    {resultData.classId?.academicYear}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-800 uppercase text-xs leading-normal border-b-2 border-gray-300">
                  <th className="py-3 px-5 font-semibold">Subject</th>
                  <th className="py-3 px-5 font-semibold text-center">
                    Max Marks
                  </th>
                  <th className="py-3 px-5 font-semibold text-center">
                    Passing Marks
                  </th>
                  <th className="py-3 px-5 font-semibold text-center">
                    Obtained Marks
                  </th>
                  <th className="py-3 px-5 font-semibold text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {subjects.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-5 font-medium text-gray-900 whitespace-nowrap">
                      {item.subjectId?.name ||
                        item.subjectId?.subjectName ||
                        "Subject"}
                    </td>
                    <td className="py-4 px-5 text-center font-semibold">
                      {item.maxMarks}
                    </td>
                    <td className="py-4 px-5 text-center font-semibold">
                      {item.passingMarks}
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-gray-900">
                      {item.obtainedMarks}
                    </td>
                    <td className="py-4 px-5 text-center font-semibold text-blue-700">
                      {item.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Summary Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-md border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600 font-medium">
                Total Marks:{" "}
                <span className="text-gray-900 font-bold">
                  {resultData.totalObtainedMarks} / {resultData.totalMaxMarks}
                </span>
              </p>
              <p className="text-gray-600 font-medium">
                Percentage:{" "}
                <span className="text-gray-900 font-bold">
                  {resultData.percentage}%
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-gray-600 font-medium">
                Overall Grade:{" "}
                <span className="text-blue-700 font-bold text-xl">
                  {resultData.overallGrade}
                </span>
              </p>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                Result Status:
                <span
                  className={`py-1 px-3 rounded-full text-xs font-semibold border ${
                    resultData.resultStatus === "Pass"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {resultData.resultStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg text-center border border-gray-200 shadow-sm">
          <p className="text-gray-500 mt-4">
            Select an exam and click "View Result" to see your marks.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentResultDashboard;
