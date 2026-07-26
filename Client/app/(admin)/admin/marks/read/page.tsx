"use client";

import React, { useState } from "react";
import { useMarks } from "@/hooks/Admin/useMarks";
// TODO: Update this path according to your project structure
import { useGetClasses } from "@/hooks/Admin/useClass";
import {
  Plus,
  FileText,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function MarksListPage() {
  const { marksQuery } = useMarks();
  const { data: classes } = useGetClasses();

  // Input States
  const [searchType, setSearchType] = useState("class");
  const [searchInput, setSearchInput] = useState("");

  // Applied States (jis par filter chalega)
  const [appliedSearch, setAppliedSearch] = useState({
    term: "",
    type: "class",
  });

  // State: Check karne ke liye ki kya fetch dab chuka hai
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Jab Search Type change ho, sab kuch reset kar do
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
    setSearchInput("");
    setErrorMsg("");
    setIsFetched(false); // Naya type select kiya toh table wapas hide kar do
  };

  // Asli Fetch Logic
  const handleFetch = () => {
    // Validation: Agar input khali hai toh error dikhao
    if (!searchInput.trim()) {
      setErrorMsg(
        searchType === "class"
          ? "Please select a class first."
          : "Please enter a student ID or name.",
      );
      setIsFetched(false);
      return;
    }

    setErrorMsg(""); // Error clear karo
    setAppliedSearch({ term: searchInput, type: searchType });
    setIsFetched(true); // Table show karne ki permission de do
  };

  // Filter Logic (Safely handle dynamic/undefined data)
  const marksData = Array.isArray(marksQuery.data) ? marksQuery.data : [];

  const filteredMarks = marksData.filter((mark: any) => {
    if (!isFetched) return false;

    if (appliedSearch.type === "student") {
      const term = appliedSearch.term.toLowerCase();
      const studentStr =
        typeof mark.studentId === "string"
          ? mark.studentId
          : mark.studentId?.name || mark.studentId?._id || "";
      return studentStr.toLowerCase().includes(term);
    }

    if (appliedSearch.type === "class") {
      const markClassId =
        typeof mark.classId === "string"
          ? mark.classId
          : mark.classId?._id || "";
      return markClassId === appliedSearch.term;
    }

    return false;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section - Humesha dikhega */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <FileText className="w-6 h-6 text-blue-600" /> Student Marks
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filter Bar - Humesha dikhega */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full md:w-auto flex-shrink-0">
              <select
                value={searchType}
                onChange={handleSearchTypeChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium text-gray-700"
              >
                <option value="class">Filter by Class</option>
                <option value="student">Filter by Student</option>
              </select>
            </div>

            <div className="w-full md:flex-1 relative">
              {searchType === "class" ? (
                <select
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setErrorMsg("");
                  }}
                  className={`w-full border p-2.5 rounded-lg focus:ring-2 outline-none bg-white text-sm text-gray-700 ${
                    errorMsg
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">-- Select a Class --</option>
                  {classes?.data?.map((cls: any) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className || cls.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Student ID or Name..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setErrorMsg("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                    className={`w-full border p-2.5 pl-10 rounded-lg focus:ring-2 outline-none bg-white text-sm ${
                      errorMsg
                        ? "border-red-400 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </>
              )}
            </div>

            {/* Fetch Button */}
            <button
              type="button"
              onClick={handleFetch}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm flex-shrink-0"
            >
              <Search className="w-4 h-4" /> Fetch
            </button>
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errorMsg}
            </p>
          )}
        </div>

        {/* Content & Table Area - Dynamic Inline Handling */}
        {marksQuery.isLoading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm font-medium">Loading marks data...</p>
          </div>
        ) : marksQuery.isError ? (
          <div className="p-12 text-center text-red-500 bg-red-50/30 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
            <p className="text-base font-semibold text-red-700">
              Unable to load marks data
            </p>
            <p className="text-xs text-red-500 mt-1 max-w-md">
              Server Error: Please check your backend connection or refresh the
              page.
            </p>
          </div>
        ) : !isFetched ? (
          <div className="p-16 text-center bg-white flex flex-col items-center justify-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Ready to search
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Please select a {searchType === "class" ? "class" : "student"}{" "}
              from the options above and click <b>Fetch</b> to view their marks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm">
                    Class
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">
                    Student
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">
                    Exam
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">
                    Total Marks
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMarks.map((mark: any) => (
                  <tr key={mark._id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4 text-sm text-gray-700">
                      {mark.classId
                        ? typeof mark.classId === "string"
                          ? mark.classId
                          : mark.classId.className || mark.classId.name || "N/A"
                        : "N/A"}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-800">
                      {typeof mark.studentId === "string"
                        ? mark.studentId
                        : mark.studentId?.name || mark.studentId?._id}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {typeof mark.examId === "string"
                        ? mark.examId
                        : mark.examId?.examName ||
                          mark.examId?.name ||
                          mark.examId?._id}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-semibold text-gray-800">
                        {mark.totalObtainedMarks}
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        / {mark.totalMaxMarks}
                      </span>
                      <span className="ml-1 text-xs text-blue-600 font-medium">
                        ({mark.percentage}%)
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          mark.resultStatus === "Pass"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : mark.resultStatus === "Fail"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {mark.resultStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMarks.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-gray-500 bg-gray-50/30"
                    >
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No records found
                      </p>
                      <p className="text-sm">
                        We couldn't find any marks matching your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
