"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

import {
  useGetStudentsByClass,
  useGetClasses,
} from "@/lib/Admin/AdminStudentApi";

interface ClassItem {
  _id?: string;
  id?: string;
  name: string;
  section?: string;
}

interface StudentItem {
  id?: string;
  studentId?: string;
  name: string;
  email?: string;
  rollNo?: string;
  classId?: {
    section?: string;
  };
}

export default function StudentsEssentials() {
  const [selectedClass, setSelectedClass] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const { data: classes, isLoading: isLoadingClasses } = useGetClasses();

  const classList: ClassItem[] = Array.isArray(classes)
    ? classes
    : classes?.data || [];

  const { data: students, isLoading } = useGetStudentsByClass(selectedClass);
  const studentList: StudentItem[] = students || [];

  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // FIX: Make state update asynchronous to prevent "synchronous setState in effect" error
  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore) return;

    // setTimeout loop ko effect ke bahar push kar deta hai
    setTimeout(() => {
      setIsFetchingMore(true);
    }, 0);

    setTimeout(() => {
      setIsFetchingMore(false);
      setHasMore(false);
    }, 1000);
  }, [hasMore, isFetchingMore]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && selectedClass) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, selectedClass, loadMore]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    if (!studentList || studentList.length === 0) return;

    const exportData = studentList.map((s) => ({
      "Student ID": s.studentId || s.id || "N/A",
      Name: s.name || "N/A",
      Section: s.classId?.section || "N/A",
      Contact: s.email || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Students_${selectedClass}.xlsx`);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    if (!studentList || studentList.length === 0) return;
    const doc = new jsPDF();
    const tableColumn = ["Student ID", "Name", "Section", "Contact"];
    const tableRows = studentList.map((s) => [
      s.studentId || s.id || "N/A",
      s.name || "N/A",
      s.classId?.section || "N/A",
      s.email || "N/A",
    ]);

    const selectedClassObj = classList.find(
      (c) => c._id === selectedClass || c.id === selectedClass,
    );
    const classNameForPdf = selectedClassObj
      ? selectedClassObj.name
      : selectedClass;

    doc.text(`Student Data - Class ${classNameForPdf}`, 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`Students_${classNameForPdf}.pdf`);
    setIsExportMenuOpen(false);
  };

  const exportToWord = () => {
    if (!studentList || studentList.length === 0) return;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Student Data</title></head><body>";
    const footer = "</body></html>";

    const selectedClassObj = classList.find(
      (c) => c._id === selectedClass || c.id === selectedClass,
    );
    const classNameForWord = selectedClassObj
      ? selectedClassObj.name
      : selectedClass;

    let sourceHTML =
      header +
      `<h2>Student List - Class ${classNameForWord}</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'><tr><th>Student ID</th><th>Name</th><th>Section</th><th>Contact</th></tr>`;

    studentList.forEach((s) => {
      sourceHTML += `<tr>
        <td>${s.studentId || s.id || "N/A"}</td>
        <td>${s.name || "N/A"}</td>
        <td>${s.classId?.section || "N/A"}</td>
        <td>${s.email || "N/A"}</td>
      </tr>`;
    });
    sourceHTML += "</table>" + footer;

    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    saveAs(blob, `Students_${classNameForWord}.doc`);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4 items-center">
          <h1 className="text-xl font-bold text-gray-800 w-full md:w-auto">
            Students
          </h1>
          <select
            className="w-full md:w-48 border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={isLoadingClasses}
          >
            <option value="" disabled>
              {isLoadingClasses ? "Loading classes..." : "Select a class"}
            </option>

            {!isLoadingClasses &&
              classList.map((cls, index) => {
                const value =
                  typeof cls === "string" ? cls : cls._id || cls.id || cls.name;
                const label =
                  typeof cls === "string"
                    ? cls
                    : `${cls.name} ${cls.section ? "- " + cls.section : ""}`;
                return (
                  <option key={value || index} value={value}>
                    {label}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={!studentList || studentList.length === 0}
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Download Data
            <svg
              className={`w-4 h-4 transition-transform ${
                isExportMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-100 overflow-hidden">
              <button
                onClick={exportToExcel}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                Download Excel
              </button>
              <button
                onClick={exportToPDF}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={exportToWord}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                Download Word
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Student Id</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Section</th>
                <th className="p-4 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!selectedClass ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Please select a class from the dropdown to view students.
                  </td>
                </tr>
              ) : studentList.length > 0 ? (
                studentList.map((student, index) => (
                  <tr
                    key={student.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">
                      {student.studentId || "N/A"}
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      {student.name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {student.classId?.section || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {student.email || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    {isLoading
                      ? "Fetching students..."
                      : "No students found for this class."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={ref} className="w-full flex justify-center p-4">
        {isFetchingMore && studentList.length > 0 && selectedClass && (
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading more students...
          </div>
        )}
      </div>
    </div>
  );
}
