"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useGetSubjects } from "@/hooks/Admin/useSubject";

// 1. Added TypeScript Interface
interface SubjectItem {
  _id: string;
  code: string;
  name: string;
  teacherId?: { name?: string } | string | null;
  isActive: boolean;
}

export default function SubjectsEssentials() {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const { data, isLoading: hookLoading } = useGetSubjects();

  // Typecasted subjects
  const subjects: SubjectItem[] = data?.data || data || [];
  const isLoading = hookLoading || false;

  // 2. Added Dummy States for Pagination
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // 3. Made loadMore asynchronous to prevent cascading renders
  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore) return;
    setTimeout(() => {
      setIsFetchingMore(true);
    }, 0);
    setTimeout(() => {
      setIsFetchingMore(false);
      setHasMore(false);
    }, 1000);
  }, [hasMore, isFetchingMore]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

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

  const getTeacherName = (teacher: SubjectItem["teacherId"]) => {
    if (!teacher) return "Unassigned";
    return typeof teacher === "object" ? teacher.name || "Unknown" : teacher;
  };

  const exportToExcel = () => {
    const exportData = subjects.map((s) => ({
      "Subject Code": s.code,
      "Subject Name": s.name,
      "Assigned Teacher": getTeacherName(s.teacherId),
      Status: s.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subjects");
    XLSX.writeFile(workbook, `Subjects_List.xlsx`);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Subject Code",
      "Subject Name",
      "Assigned Teacher",
      "Status",
    ];
    const tableRows = subjects.map((s) => [
      s.code,
      s.name,
      getTeacherName(s.teacherId),
      s.isActive ? "Active" : "Inactive",
    ]);

    doc.text(`Subject Data`, 14, 15);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`Subjects_List.pdf`);
    setIsExportMenuOpen(false);
  };

  const exportToWord = () => {
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Subject Data</title></head><body>";
    let sourceHTML =
      header +
      `<h2>Subject List</h2><table border='1' style='border-collapse:collapse; width:100%; text-align:left;'><tr><th>Subject Code</th><th>Subject Name</th><th>Assigned Teacher</th><th>Status</th></tr>`;
    subjects.forEach((s) => {
      sourceHTML += `<tr><td>${s.code}</td><td>${s.name}</td><td>${getTeacherName(
        s.teacherId,
      )}</td><td>${s.isActive ? "Active" : "Inactive"}</td></tr>`;
    });
    sourceHTML += "</table></body></html>";

    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    saveAs(blob, `Subjects_List.doc`);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h1 className="text-xl font-bold text-gray-800 w-full md:w-auto">
          Subjects List
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
                <th className="p-4 font-semibold">Code</th>
                <th className="p-4 font-semibold">Subject Name</th>
                <th className="p-4 font-semibold">Assigned Teacher</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjects.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800 font-medium">{sub.code}</td>
                  <td className="p-4 text-gray-800">{sub.name}</td>
                  <td className="p-4 text-gray-600">
                    {sub.teacherId ? (
                      <span className="text-gray-800">
                        {typeof sub.teacherId === "object"
                          ? sub.teacherId.name
                          : sub.teacherId}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={ref} className="w-full flex justify-center p-4">
        {isLoading && <span className="text-gray-500">Loading data...</span>}
        {isFetchingMore && (
          <span className="text-gray-500">Loading more subjects...</span>
        )}
      </div>
    </div>
  );
}
