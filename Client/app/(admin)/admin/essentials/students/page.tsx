"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

import {
  useGetStudentsByClass,
  useGetClasses,
} from "@/lib/Admin/AdminStudentApi";

export default function StudentsEssentials() {
  // Initial state empty rahega, koi class auto-select nahi hogi
  const [selectedClass, setSelectedClass] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({ threshold: 0.1 });

  // 1. Fetch available classes
  const { data: classes, isLoading: isLoadingClasses } = useGetClasses();

  // Safely get the array whether it's directly `classes` or inside `classes.data`
  const classList = Array.isArray(classes) ? classes : classes?.data || [];

  // YAHAN SE AUTO-SELECT WALA useEffect HATA DIYA GAYA HAI.

  // 2. Fetch students based on the selected class (API tabhi fire honi chahiye jab selectedClass me ID ho)
  const {
    data: students,
    loadMore,
    hasMore,
    isLoading,
  } = useGetStudentsByClass(selectedClass);

  // Lazy Loading Trigger
  useEffect(() => {
    if (inView && hasMore && !isLoading && loadMore && selectedClass) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore, selectedClass]);

  // Close dropdown if clicked outside
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
    if (!students || students.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Students_${selectedClass}.xlsx`);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    if (!students || students.length === 0) return;
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Roll No", "Section", "Contact"];
    const tableRows = students.map((s: any) => [
      s.id,
      s.name,
      s.rollNo,
      s.section,
      s.contact,
    ]);

    // Optional: Selected class ka naam nikalna PDF title ke liye
    const selectedClassObj = classList.find(
      (c: any) => c._id === selectedClass,
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
    if (!students || students.length === 0) return;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Student Data</title></head><body>";
    const footer = "</body></html>";

    const selectedClassObj = classList.find(
      (c: any) => c._id === selectedClass,
    );
    const classNameForWord = selectedClassObj
      ? selectedClassObj.name
      : selectedClass;

    let sourceHTML =
      header +
      `<h2>Student List - Class ${classNameForWord}</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'><tr><th>ID</th><th>Name</th><th>Roll No</th><th>Section</th><th>Contact</th></tr>`;

    students.forEach((s: any) => {
      sourceHTML += `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.rollNo}</td><td>${s.section}</td><td>${s.contact}</td></tr>`;
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
      {/* HEADER & CONTROLS */}
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
            {/* DEFAULT OPTION ADD KIYA HAI */}
            <option value="" disabled>
              {isLoadingClasses ? "Loading classes..." : "Select a class"}
            </option>

            {!isLoadingClasses &&
              classList.map((cls: any, index: number) => {
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

        {/* Download Dropdown */}
        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={!students || students.length === 0}
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

      {/* STUDENT DATA TABLE */}
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
                // UI agar koi class select nahi ki hai
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Please select a class from the dropdown to view students.
                  </td>
                </tr>
              ) : students && students.length > 0 ? (
                students.map((student: any, index: number) => (
                  <tr
                    key={student.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">{student.studentId}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {student.name}
                     
                    </td>
                    <td className="p-4 text-gray-600">
                      {student.classId.section}
                    </td>
                    <td className="p-4 text-gray-600">{student.email}</td>
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

      {/* LAZY LOADING TRIGGER */}
      <div ref={ref} className="w-full flex justify-center p-4">
        {isLoading && students?.length > 0 && selectedClass && (
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
