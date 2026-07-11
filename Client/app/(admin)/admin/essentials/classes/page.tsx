"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useGetClasses } from "@/hooks/Admin/useClass";
// import { useFetchClasses } from '@/hooks/useFetchClasses';

export default function ClassesEssentials() {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1 });

  // DUMMY DATA SETUP for Pagination
  const isLoading = false;
  const hasMore = true;
  // Fetching Data (Safely defaulting to empty array if data isn't loaded yet)
  const { data: ClassResponse } = useGetClasses();
  const classes = ClassResponse?.data || [];

  useEffect(() => {
    if (inView && hasMore && !isLoading) loadMore();
  }, [inView, hasMore, isLoading]);

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
    // Formatting data nicely for Excel
    const exportData = classes.map((c: any) => ({
      Class: c.name,
      Section: c.section,
      "Class Teacher": c.teacherId?.name || "N/A",
      Strength: c.strength,
      "Academic Year": c.academicYear,
      Status: c.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");
    XLSX.writeFile(workbook, `Classes_List.xlsx`);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Class",
      "Section",
      "Class Teacher",
      "Strength",
      "Academic Year",
      "Status",
    ];
    const tableRows = classes.map((c: any) => [
      c.name,
      c.section,
      c.teacherId?.name || "N/A",
      c.strength,
      c.academicYear,
      c.isActive ? "Active" : "Inactive",
    ]);

    doc.text(`Class Data`, 14, 15);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`Classes_List.pdf`);
    setIsExportMenuOpen(false);
  };

  const exportToWord = () => {
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Class Data</title></head><body>";
    let sourceHTML =
      header +
      `<h2>Class List</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'>
      <tr>
        <th>Class</th>
        <th>Section</th>
        <th>Class Teacher</th>
        <th>Strength</th>
        <th>Academic Year</th>
        <th>Status</th>
      </tr>`;

    classes.forEach((c: any) => {
      sourceHTML += `<tr>
        <td>${c.name}</td>
        <td>${c.section}</td>
        <td>${c.teacherId?.name || "N/A"}</td>
        <td>${c.strength}</td>
        <td>${c.academicYear}</td>
        <td>${c.isActive ? "Active" : "Inactive"}</td>
      </tr>`;
    });
    sourceHTML += "</table></body></html>";

    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    saveAs(blob, `Classes_List.doc`);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h1 className="text-xl font-bold text-gray-800 w-full md:w-auto">
          Classes List
        </h1>

        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex justify-center items-center gap-2"
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
                <th className="p-4 font-semibold">Class</th>
                <th className="p-4 font-semibold">Section</th>
                <th className="p-4 font-semibold">Class Teacher</th>
                <th className="p-4 font-semibold">Strength</th>
                <th className="p-4 font-semibold">Academic Year</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classes.map((cls: any) => (
                <tr
                  key={cls._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800 font-medium">{cls.name}</td>
                  <td className="p-4 text-gray-600">{cls.section}</td>
                  <td className="p-4 text-gray-800">
                    {cls.teacherId?.name || "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">{cls.strength}</td>
                  <td className="p-4 text-gray-600">{cls.academicYear}</td>
                  <td className="p-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        cls.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cls.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No classes found.
                  </td>
                </tr>
              )}
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
