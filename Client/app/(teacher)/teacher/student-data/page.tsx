"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

import { useGetStudent } from "@/hooks/Teacher/useTeacherStudent";

export default function StudentsEssentials() {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({ threshold: 0.1 });

  // Fetch all students directly from the hook
  const { data: students, loadMore, hasMore, isLoading } = useGetStudent();
  console.log(students.data);

  // Lazy Loading Trigger
  useEffect(() => {
    if (inView && hasMore && !isLoading && loadMore) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

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
    XLSX.writeFile(workbook, `Students_List.xlsx`);
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

    doc.text(`Student Data`, 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`Students_List.pdf`);
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

    let sourceHTML =
      header +
      `<h2>Student List</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'><tr><th>ID</th><th>Name</th><th>Roll No</th><th>Section</th><th>Contact</th></tr>`;

    students.forEach((s: any) => {
      sourceHTML += `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.rollNo}</td><td>${s.section}</td><td>${s.contact}</td></tr>`;
    });
    sourceHTML += "</table>" + footer;

    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    saveAs(blob, `Students_List.doc`);
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
              {students && students.length > 0 ? (
                students?.data.map((student: any, index: number) => (
                  <tr
                    key={student.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">{student.studentId}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {student.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {student.classId?.section || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    {isLoading ? "Fetching students..." : "No students found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LAZY LOADING TRIGGER */}
      <div ref={ref} className="w-full flex justify-center p-4">
        {isLoading && students?.length > 0 && (
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
