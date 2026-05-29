"use client";

import React from "react";
import { Printer, Award, Calendar, User } from "lucide-react";

export default function StudentResultPage() {
  // 📝 Dummy Data (Aap ise apne API se replace kar sakte hain)
  const resultData = {
    schoolName: "Delhi Public School",
    schoolAddress: "Sector 45, Gurugram, Haryana",
    examName: "Half Yearly Examination 2025-2026",
    student: {
      name: "Aarav Sharma",
      rollNo: "104",
      class: "10th - A",
      dob: "15-Aug-2010",
    },
    subjects: [
      {
        name: "Mathematics",
        max: 100,
        passing: 33,
        obtained: 85,
        grade: "A",
        remarks: "Excellent",
      },
      {
        name: "Science",
        max: 100,
        passing: 33,
        obtained: 78,
        grade: "B",
        remarks: "Good effort",
      },
      {
        name: "English",
        max: 100,
        passing: 33,
        obtained: 92,
        grade: "A+",
        remarks: "Outstanding",
      },
      {
        name: "Social Science",
        max: 100,
        passing: 33,
        obtained: 65,
        grade: "C",
        remarks: "Can do better",
      },
      {
        name: "Hindi",
        max: 100,
        passing: 33,
        obtained: 88,
        grade: "A",
        remarks: "Very Good",
      },
    ],
    summary: {
      totalMax: 500,
      totalObtained: 408,
      percentage: "81.60",
      overallGrade: "A",
      resultStatus: "Pass",
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      {/* 🚀 MAGIC PRINT CSS: Yeh baaki pure page ko hide kar dega print karte waqt */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-result, #printable-result * {
              visibility: visible;
            }
            #printable-result {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }
            /* Hide the action buttons specifically */
            .no-print {
              display: none !important;
            }
          }
        `,
        }}
      />

      {/* 🎛️ ACTION BUTTONS (Yeh print mein automatically hide ho jayenge .no-print class se) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-4 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all"
        >
          <Printer className="w-5 h-5" /> Print Result
        </button>
      </div>

      {/* 📄 REPORT CARD A4 PAPER FORMAT (Ispe id="printable-result" lagaya hai) */}
      <div
        id="printable-result"
        className="max-w-4xl mx-auto bg-white border border-gray-300 shadow-lg p-8 md:p-12"
      >
        {/* Header Section */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest">
            {resultData.schoolName}
          </h1>
          <p className="text-gray-600 mt-1 font-medium">
            {resultData.schoolAddress}
          </p>
          <div className="mt-4 inline-block bg-gray-900 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            {resultData.examName} - Academic Report
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-gray-800">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />{" "}
              <span className="font-semibold w-24">Student Name</span> :{" "}
              {resultData.student.name}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4"></span>{" "}
              <span className="font-semibold w-24">Roll Number</span> :{" "}
              {resultData.student.rollNo}
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />{" "}
              <span className="font-semibold w-24">Class/Sec</span> :{" "}
              {resultData.student.class}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4"></span>{" "}
              <span className="font-semibold w-24">D.O.B</span> :{" "}
              {resultData.student.dob}
            </p>
          </div>
        </div>

        {/* Marks Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-800 uppercase text-sm tracking-wider">
                <th className="border border-gray-300 px-4 py-3 font-bold">
                  Subject
                </th>
                <th className="border border-gray-300 px-4 py-3 font-bold text-center">
                  Max Marks
                </th>
                <th className="border border-gray-300 px-4 py-3 font-bold text-center">
                  Passing
                </th>
                <th className="border border-gray-300 px-4 py-3 font-bold text-center">
                  Obtained
                </th>
                <th className="border border-gray-300 px-4 py-3 font-bold text-center">
                  Grade
                </th>
                <th className="border border-gray-300 px-4 py-3 font-bold">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {resultData.subjects.map((sub, idx) => (
                <tr key={idx} className="text-gray-700">
                  <td className="border border-gray-300 px-4 py-3 font-semibold">
                    {sub.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {sub.max}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-500">
                    {sub.passing}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                    {sub.obtained}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-bold">
                    {sub.grade}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm italic">
                    {sub.remarks || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-6 border border-gray-300 rounded-lg mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-1">
                Total Marks
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {resultData.summary.totalObtained}{" "}
                <span className="text-base text-gray-500 font-medium">
                  / {resultData.summary.totalMax}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-1">
                Percentage
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {resultData.summary.percentage}%
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-1">
                Overall Grade
              </p>
              <p className="text-2xl font-black text-amber-500 drop-shadow-sm">
                {resultData.summary.overallGrade}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-1">
                Result
              </p>
              <p
                className={`text-xl font-black uppercase tracking-wider mt-1 ${resultData.summary.resultStatus === "Pass" ? "text-green-600" : "text-red-600"}`}
              >
                {resultData.summary.resultStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200 text-gray-800">
          <div className="text-center">
            <div className="w-40 border-b border-gray-800 mb-2"></div>
            <p className="font-semibold text-sm">Class Teacher Signature</p>
          </div>

          <div className="text-center">
            <div className="w-40 border-b border-gray-800 mb-2"></div>
            <p className="font-semibold text-sm">Principal Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
