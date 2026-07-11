"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useGetTeachers } from "@/hooks/Admin/useTeacher";

export default function TeachersEssentials() {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const { data: teacher } = useGetTeachers();

  // DUMMY DATA SETUP
  const isLoading = false;
  const hasMore = true;
  // Added optional chaining (?.) to prevent crashes if teacher is initially undefined
  const teachers = teacher?.teachers || [];


  // LAZY LOADING LOGIC
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading]);

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

  // EXPORT FUNCTIONS
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(teachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
    XLSX.writeFile(workbook, `Teachers_List.xlsx`);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    // Updated Headers
    const tableColumn = ["Teacher ID", "Name", "Email", "Role"];
    // Updated properties based on API response
    const tableRows = teachers.map((t: any) => [
      t.teacher_id,
      t.name,
      t.email,
      t.role,
    ]);

    doc.text(`Teacher Data`, 14, 15);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`Teachers_List.pdf`);
    setIsExportMenuOpen(false);
  };

  const exportToWord = () => {
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Teacher Data</title></head><body>";
    const footer = "</body></html>";
    let sourceHTML =
      header +
      `<h2>Teacher List</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'><tr><th>Teacher ID</th><th>Name</th><th>Email</th><th>Role</th></tr>`;

    teachers.forEach((t: any) => {
      // Updated properties
      sourceHTML += `<tr><td>${t.teacher_id}</td><td>${t.name}</td><td>${t.email}</td><td>${t.role}</td></tr>`;
    });
    sourceHTML += "</table>" + footer;

    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    saveAs(blob, `Teachers_List.doc`);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h1 className="text-xl font-bold text-gray-800 w-full md:w-auto">
          Teachers List
        </h1>

        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            Download Data
            <svg
              className={`w-4 h-4 transition-transform ${isExportMenuOpen ? "rotate-180" : ""}`}
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
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50"
              >
                Download Excel
              </button>
              <button
                onClick={exportToPDF}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50"
              >
                Download PDF
              </button>
              <button
                onClick={exportToWord}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50"
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
                <th className="p-4 font-semibold">Teacher ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((teacher: any) => (
                <tr
                  key={teacher._id} // Changed from teacher.id to teacher._id
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800 font-medium">
                    {teacher.teacher_id} {/* Replaced empId */}
                  </td>
                  <td className="p-4 text-gray-800">{teacher.name}</td>
                  <td className="p-4 text-gray-600">{teacher.email}</td>{" "}
                  {/* Replaced department */}
                  <td className="p-4 text-gray-600 capitalize">
                    {teacher.role}
                  </td>{" "}
                  {/* Replaced contact */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={ref} className="w-full flex justify-center p-4">
        {isLoading && <span className="text-gray-500">Loading more...</span>}
      </div>
    </div>
  );
}
