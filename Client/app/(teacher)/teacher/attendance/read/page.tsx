"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ViewAttendancePage() {
  const [viewMode, setViewMode] = useState<"single" | "range">("single");
  const [targetType, setTargetType] = useState<"class" | "student">("class");

  const today = new Date().toISOString().split("T")[0];
  const [singleDate, setSingleDate] = useState<string>(today);
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [studentId, setStudentId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const handleFetchClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (viewMode === "range" && startDate > endDate) {
      return toast.error("Start date cannot be after End date ❌");
    }

    if (targetType === "student" && !studentId.trim()) {
      return toast.error("Please enter a Student ID ❌");
    }

    setIsLoading(true);

    try {
      // 1. Build Query Parameters for the API request
      const params = new URLSearchParams();

      if (viewMode === "single") {
        params.append("date", singleDate);
      } else {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      if (targetType === "student") {
        params.append("studentId", studentId);
      }

      // 2. Make the API Call (Adjust the endpoint path to match your backend)
      const response = await fetch(`/api/attendance?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch attendance data.");
      }

      // 3. Update state with the returned data
      // (Assuming your API returns an array or an object containing the array. Adjust 'data.records' as needed)
      const records = Array.isArray(data) ? data : data.records || [];
      setAttendanceRecords(records);

      if (records.length === 0) {
        toast.info("No attendance records found for these dates.");
      } else {
        toast.success("Attendance fetched successfully!");
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "An error occurred while fetching.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "P":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
            Present
          </span>
        );
      case "A":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
            Absent
          </span>
        );
      case "L":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
            Late
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 border-b pb-4">
          View Class Attendance
        </h1>

        <div className="mb-8 bg-gray-50 p-4 rounded-lg border">
          {/* FETCH FOR TOGGLES */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 border-b pb-4">
            <span className="font-semibold text-gray-700 min-w-[90px]">
              Fetch For:
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTargetType("class")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  targetType === "class"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Whole Class
              </button>
              <button
                type="button"
                onClick={() => setTargetType("student")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  targetType === "student"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Particular Student
              </button>
            </div>
          </div>

          {/* DATE TYPE TOGGLES */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 border-b pb-4">
            <span className="font-semibold text-gray-700 min-w-[90px]">
              Date Type:
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode("single")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  viewMode === "single"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Single Date
              </button>
              <button
                type="button"
                onClick={() => setViewMode("range")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  viewMode === "range"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Date Range
              </button>
            </div>
          </div>

          {/* FORM INPUTS */}
          <form
            onSubmit={handleFetchClick}
            className="flex flex-col sm:flex-row flex-wrap items-end gap-4 sm:gap-6"
          >
            {targetType === "student" && (
              <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
                <label className="block font-semibold mb-2 text-sm text-gray-600">
                  Student ID / Roll No
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-101"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required={targetType === "student"}
                />
              </div>
            )}

            {viewMode === "single" ? (
              <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
                <label className="block font-semibold mb-2 text-sm text-gray-600">
                  Select Date
                </label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            ) : (
              <>
                <div className="w-full sm:flex-1 sm:min-w-[150px] sm:max-w-xs">
                  <label className="block font-semibold mb-2 text-sm text-gray-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="w-full sm:flex-1 sm:min-w-[150px] sm:max-w-xs">
                  <label className="block font-semibold mb-2 text-sm text-gray-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors h-[42px] min-w-[140px] flex items-center justify-center font-bold shadow-md disabled:opacity-50 mt-4 sm:mt-0"
            >
              {isLoading ? "Searching..." : "Get Attendance"}
            </button>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 sm:p-4 border-b font-semibold whitespace-nowrap">
                  Date
                </th>
                <th className="p-3 sm:p-4 border-b font-semibold whitespace-nowrap">
                  Student Name
                </th>
                <th className="p-3 sm:p-4 border-b font-semibold text-center whitespace-nowrap">
                  Status
                </th>
                <th className="p-3 sm:p-4 border-b font-semibold whitespace-nowrap">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                      <span className="text-gray-500 text-sm">
                        Fetching from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : !attendanceRecords || attendanceRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 sm:p-10 text-center text-gray-500 bg-gray-50"
                  >
                    <div className="text-lg mb-1">No Data Found</div>
                    <div className="text-sm">
                      Select filters and click "Get Attendance" to view records.
                    </div>
                  </td>
                </tr>
              ) : (
                attendanceRecords?.map((record, recordIndex) =>
                  record?.attendance?.map(
                    (student: any, studentIndex: number) => (
                      <tr
                        key={`${record?._id || recordIndex}-${student?._id || studentIndex}`}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 sm:p-4 text-sm text-gray-600 whitespace-nowrap">
                          {record?.date || "-"}
                        </td>
                        <td className="p-3 sm:p-4 font-medium whitespace-nowrap">
                          {student?.studentId?.name || "Unknown"}
                        </td>
                        <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                          {getStatusBadge(student?.status)}
                        </td>
                        <td className="p-3 sm:p-4 text-sm text-gray-600 whitespace-nowrap">
                          {student?.remarks || "-"}
                        </td>
                      </tr>
                    ),
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
