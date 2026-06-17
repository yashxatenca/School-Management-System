"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useGetExamWithClassId } from "@/hooks/Student/useStudentExam";
import axios from "axios";

const StudentResultDashboard = () => {
  const user = useSelector((state: RootState) => state.studentauthstate.user);

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: exam, isLoading: examLoading } = useGetExamWithClassId();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (exam && exam.exam && exam.exam.length > 0) {
      setExams(exam.exam);
      setSelectedExamId(exam.exam[0]._id);
    }
  }, [exam]);

  const handleFetchResults = async () => {
    if (!selectedExamId || !user?._id) return;

    setLoading(true);
    try {
      const response = await axios.get("/api/results/fetch", {
        params: {
          student_Id: user._id,
          exam_Id: selectedExamId,
          class_Id: user.classId,
          academicYear: "2025-2026",
        },
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching actual results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    const printContent = reportRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Report Card - Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              padding: 40px; 
              font-family: sans-serif; 
              background-color: white !important;
            }
            @page { size: auto;  margin: 0mm; } 
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
              window.onafterprint = function() {
                window.close();
              };
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
          <h1 className="text-2xl font-bold text-gray-800">Result Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select an exam to view and print report
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="w-48">
            <select
              className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              disabled={examLoading || exams.length === 0}
            >
              {examLoading ? (
                <option>Loading exams...</option>
              ) : exams.length > 0 ? (
                exams.map((exam: any) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))
              ) : (
                <option>No Exams Found</option>
              )}
            </select>
          </div>

          <button
            onClick={handleFetchResults}
            disabled={!selectedExamId || loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-5 py-2.5 rounded-md shadow transition duration-150"
          >
            {loading ? "Fetching..." : "Fetch Results"}
          </button>

          <button
            onClick={handlePrint}
            disabled={results.length === 0}
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
            Print Result
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">
          Loading results from database...
        </p>
      ) : results.length > 0 ? (
        <div
          ref={reportRef}
          className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="mb-8 border-b-2 border-gray-300 pb-5 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              ACADEMIC REPORT CARD
            </h1>
            <p className="text-xl text-gray-700 mt-1">
              {exams.find((e: any) => e._id === selectedExamId)?.name ||
                "Exam Report"}
            </p>

            <div className="flex justify-between mt-8 text-left text-sm font-medium text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-100">
              <div>
                <p>
                  Student Name:{" "}
                  <span className="font-semibold text-blue-800">
                    {user?.name || "N/A"}
                  </span>
                </p>
                <p>
                  Roll No:{" "}
                  <span className="font-semibold">
                    {user?.rollNumber || "N/A"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p>
                  Class:{" "}
                  <span className="font-semibold">
                    {user?.className || "N/A"}
                  </span>
                </p>
                <p>
                  Academic Year: <span className="font-semibold">2025-26</span>
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
                    Theory
                  </th>
                  <th className="py-3 px-5 font-semibold text-center">
                    Practical
                  </th>
                  <th className="py-3 px-5 font-semibold text-center">Total</th>
                  <th className="py-3 px-5 font-semibold text-center">Grade</th>
                  <th className="py-3 px-5 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {results.map((result: any) => (
                  <tr
                    key={result._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-5 font-medium text-gray-900 whitespace-nowrap">
                      {result.subjectId?.name || "Unknown Subject"}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {result.marks?.theoryObtained || 0}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {result.marks?.practicalObtained || 0}
                    </td>
                    <td className="py-4 px-5 text-center font-semibold text-gray-950">
                      {result.marks?.totalObtained || 0} /{" "}
                      {result.marks?.maxTotalMarks || 100}
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-gray-900">
                      {result.grade || "-"}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          result.isPass
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {result.isPass ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-sm text-gray-600">
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p className="italic text-xs">
              Note: This is a computer-generated report.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg text-center border border-gray-200 shadow-sm">
          <p className="text-gray-500 mt-4">
            Select an exam and click "Fetch Results" to view grades.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentResultDashboard;
