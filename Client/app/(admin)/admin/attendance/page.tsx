"use client";

import { useState } from "react";
import { useGetClasses } from "@/hooks/Admin/useClass";
import { useGetStudentsByClass } from "@/hooks/Admin/useStudent";
import {
  useAdminDateCards,
  useAdminClassAttendance,
  useAdminStudentAttendance,
} from "./_components/useAttendance";
import { Calendar, Search, Users, AlertCircle } from "lucide-react";

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState<"CARDS" | "SEARCH">("CARDS");

  // 1. Initial State remains empty string (No class auto-selected)
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchStudentId, setSearchStudentId] = useState<string>("");

  // Dynamic Date States (Replacing hardcoded 2026 and 8)
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );

  // 2. Fetch all classes list
  const { data: classesResponse, isLoading: isClassesLoading } =
    useGetClasses();
  const classesList = classesResponse?.data || classesResponse || [];

  // 3. Dependent Hooks (Triggered only when selectedClassId is truthy)
  const { data: classStudentsData, isLoading: isStudentsLoading } =
    useGetStudentsByClass(selectedClassId);

  const { data: cardsData, isLoading: isCardsLoading } = useAdminDateCards(
    selectedClassId,
    selectedYear,
    selectedMonth,
  );

  const { data: classLogs } = useAdminClassAttendance(
    selectedClassId,
    selectedDate || "",
  );

  const { data: studentLogs, isLoading: isStudentLogsLoading } =
    useAdminStudentAttendance(searchStudentId);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Bar with Class Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Admin Attendance Inspector
          </h1>
          <p className="text-xs text-gray-500">
            Select a class from the dropdown to get started
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dynamic Class Select Dropdown */}
          <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-1.5">
            <Users className="w-4 h-4 text-gray-500" />
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedDate(null); // Clear selected date on class change
                setSearchStudentId(""); // Clear selected student on class change
              }}
              disabled={isClassesLoading}
              className="bg-transparent outline-none text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="">-- Select Class --</option>
              {classesList.map((cls: any) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className || cls.name || `Class (${cls._id})`}
                </option>
              ))}
            </select>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab("CARDS")}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === "CARDS"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Class Date Cards
            </button>
            <button
              onClick={() => setActiveTab("SEARCH")}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === "SEARCH"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Search By Student
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedClassId ? (
        /* Empty State Prompt when no class is selected */
        <div className="bg-white border rounded-xl p-12 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">No Class Selected</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Please choose a class from the top-right dropdown menu to load
            attendance date cards and student history.
          </p>
        </div>
      ) : activeTab === "CARDS" ? (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Attendance Cards ({selectedMonth}/{selectedYear})
          </h2>

          {isCardsLoading ? (
            <p className="text-gray-500 text-sm">Loading attendance cards...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cardsData?.cards?.map((card: any) => (
                <div
                  key={card.date}
                  onClick={() => setSelectedDate(card.date)}
                  className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
                    selectedDate === card.date
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                      : "bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {card.date}
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-emerald-600 font-semibold">
                      Present: {card.presentCount}
                    </p>
                    <p className="text-rose-600 font-semibold">
                      Absent: {card.absentCount}
                    </p>
                    <p className="text-amber-600 font-semibold">
                      Late: {card.lateCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Log Details Table for Clicked Card */}
          {selectedDate && classLogs && (
            <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800">
                Records for {selectedDate}
              </h3>
              <div className="divide-y text-sm">
                {classLogs.data?.map((log: any) => (
                  <div
                    key={log._id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {log.student?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Marked by: {log.markedBy?.name || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-gray-100">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Search View using current selected class's students */
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Select Student from Selected Class
              </label>
              <select
                onChange={(e) => setSearchStudentId(e.target.value)}
                value={searchStudentId}
                disabled={isStudentsLoading}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Student --</option>
                {classStudentsData?.map((student: any) => (
                  // Changed value from student._id to student.studentId
                  <option key={student._id} value={student._id || ""}>
                    {student.name}{" "}
                    {student.studentId ? `(ID: ${student.studentId})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Or Enter Student ID Directly
              </label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Student ID..."
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Student Logs */}
          {isStudentLogsLoading && (
            <p className="text-gray-500 text-sm py-4">Fetching logs...</p>
          )}

          {studentLogs?.data && studentLogs.data.length > 0 && (
            <div className="divide-y text-sm border-t pt-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase my-3">
                History ({studentLogs.data.length} Records)
              </h4>
              {studentLogs.data.map((log: any) => (
                <div
                  key={log._id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {log.date.split("T")[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.remarks || "No remarks"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded ${
                      log.status === "PRESENT"
                        ? "bg-emerald-100 text-emerald-800"
                        : log.status === "ABSENT"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
