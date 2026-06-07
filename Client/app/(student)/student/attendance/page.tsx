"use client";
import { useState } from "react";
import { toast } from "react-toastify";
// Apne naye hooks yahan import karein (path apne project ke hisaab se adjust kar lein)
import {
  useFetchAttendanceBySingleDate,
  useFetchAttendanceByRangeDate,
} from "@/hooks/Student/useStudentAttendance";

export default function StudentAttendance() {
  const [fetchType, setFetchType] = useState<"single" | "range" | "">("");
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isFetchTriggered, setIsFetchTriggered] = useState(false);

  // 1. Dono queries ko call karein
  const {
    data: singleData,
    isFetching: isSingleFetching,
    refetch: refetchSingle,
  } = useFetchAttendanceBySingleDate(singleDate);

  const {
    data: rangeData,
    isFetching: isRangeFetching,
    refetch: refetchRange,
  } = useFetchAttendanceByRangeDate(startDate, endDate);

  const handleTypeChange = (type: "single" | "range") => {
    setFetchType(type);
    setIsFetchTriggered(false);
    setSingleDate("");
    setStartDate("");
    setEndDate("");
  };

  const handleFetchData = async () => {
    // Validations
    if (fetchType === "single" && !singleDate) {
      toast.error("Please select a date!");
      return;
    }
    if (fetchType === "range" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates!");
      return;
    }

    setIsFetchTriggered(true);

    try {
      // 2. Jo fetchType selected hai, uske hisaab se uska refetch() function call karein
      const fetchPromise =
        fetchType === "single" ? refetchSingle() : refetchRange();

      // react-toastify me 'loading' ki jagah 'pending' use hota hai
      await toast.promise(fetchPromise, {
        pending: "Fetching attendance records...",
        success: "Data fetched successfully!",
        error: "Failed to fetch attendance data.",
      });
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  // 3. Current active state aur data ko merge karein
  const isPending = fetchType === "single" ? isSingleFetching : isRangeFetching;
  const activeData = fetchType === "single" ? singleData : rangeData;

  // Extract records safely
  const attendanceRecords = Array.isArray(activeData)
    ? activeData
    : activeData?.records || [];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Student Attendance
      </h1>

      {/* Selection Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <p className="text-gray-600 mb-4 font-medium">Select Fetch Type:</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition">
            <input
              type="radio"
              name="fetchType"
              checked={fetchType === "single"}
              onChange={() => handleTypeChange("single")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium">Single Day</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition">
            <input
              type="radio"
              name="fetchType"
              checked={fetchType === "range"}
              onChange={() => handleTypeChange("range")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium">Date Range</span>
          </label>
        </div>

        {/* Date Inputs */}
        {fetchType && (
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {fetchType === "single" ? (
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Select Date
                </label>
                <input
                  type="date"
                  className="border rounded-lg p-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm text-gray-600 mb-1 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border rounded-lg p-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm text-gray-600 mb-1 font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border rounded-lg p-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              onClick={handleFetchData}
              disabled={isPending}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto font-medium mt-2 sm:mt-0 disabled:opacity-50"
            >
              {isPending ? "Fetching..." : "Fetch Data"}
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      {isFetchTriggered && attendanceRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">
                    Student Name
                  </th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceRecords.map((record: any, index: number) => (
                  <tr
                    key={record._id || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      {record.studentId?.name || "Unknown"}
                    </td>
                    <td className="p-4">
                      {new Date(record.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "Present" || record.status === "P"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Fallback */}
      {isFetchTriggered && !isPending && attendanceRecords.length === 0 && (
        <div className="text-center text-gray-500 mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          No records found for the selected dates.
        </div>
      )}
    </div>
  );
}
  