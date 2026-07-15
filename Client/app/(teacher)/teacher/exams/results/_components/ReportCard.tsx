import React from "react";
import { Printer, Award, Calendar, User } from "lucide-react";

export const ReportCard = ({ data }: { data: any }) => {
  const handlePrint = () => window.print();

  if (!data) return null;

  return (
    <div className="w-full font-sans animate-in fade-in zoom-in-95 duration-300">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body * { visibility: hidden; }
            #printable-result, #printable-result * { visibility: visible; }
            #printable-result {
              position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0;
              box-shadow: none !important; border: none !important;
            }
            .no-print { display: none !important; }
            /* Force background colors to print */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `,
        }}
      />

      <div className="mb-6 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Printer className="w-5 h-5" /> Print Report Card
        </button>
      </div>

      <div
        id="printable-result"
        className="bg-white border border-gray-200 shadow-xl p-6 md:p-12 rounded-2xl relative overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-gray-50 opacity-50 pointer-events-none">
          <Award className="w-64 h-64" />
        </div>

        {/* Header */}
        <div className="text-center border-b-2 border-gray-900 pb-6 mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-wider">
            {data?.schoolName || "School Name N/A"}
          </h1>
          <p className="text-gray-600 mt-2 font-medium text-sm md:text-base">
            {data?.schoolAddress || "Address N/A"}
          </p>
          <div className="mt-5 inline-block bg-gray-900 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm">
            {data?.examName || "Term Examination"}
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50/80 p-5 rounded-xl border border-gray-200">
          <div className="space-y-3">
            <p className="flex items-center text-sm md:text-base">
              <User className="w-4 h-4 text-gray-400 mr-3" />
              <span className="font-semibold w-24 text-gray-500 uppercase text-xs tracking-wider">
                Student
              </span>
              <span className="font-bold text-gray-900">
                {data?.student?.name || "N/A"}
              </span>
            </p>
            <p className="flex items-center text-sm md:text-base">
              <span className="w-4 h-4 mr-3"></span>
              <span className="font-semibold w-24 text-gray-500 uppercase text-xs tracking-wider">
                Student Id
              </span>
              <span className="font-bold text-gray-900">
                {data?.student?.studentId || "N/A"}
              </span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="flex items-center text-sm md:text-base">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <span className="font-semibold w-24 text-gray-500 uppercase text-xs tracking-wider">
                Class/Sec
              </span>
              <span className="font-bold text-gray-900">
                {data?.student?.class || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Marks Table */}
        <div className="mb-8 rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                  <th className="px-5 py-4 font-bold border-b border-gray-200">
                    Subject
                  </th>
                  <th className="px-5 py-4 font-bold border-b border-gray-200 text-center">
                    Max Marks
                  </th>
                  <th className="px-5 py-4 font-bold border-b border-gray-200 text-center">
                    Passing
                  </th>
                  <th className="px-5 py-4 font-bold border-b border-gray-200 text-center bg-gray-50">
                    Obtained
                  </th>
                  <th className="px-5 py-4 font-bold border-b border-gray-200 text-center">
                    Grade
                  </th>
                  <th className="px-5 py-4 font-bold border-b border-gray-200">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data?.subjects && data.subjects.length > 0 ? (
                  data.subjects.map((sub: any, idx: number) => (
                    <tr
                      key={idx}
                      className="text-gray-800 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {sub?.name || "Unknown"}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-500">
                        {sub?.max || 0}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-500">
                        {sub?.passing || 0}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-gray-900 bg-gray-50/50">
                        {sub?.obtained || 0}
                      </td>
                      <td className="px-5 py-4 text-center font-bold">
                        {sub?.grade || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm italic text-gray-500">
                        {sub?.remarks || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No subjects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Area */}
        <div className="bg-gray-900 text-white p-8 rounded-xl mb-16 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-700/50">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                Total Marks
              </p>
              <p className="text-2xl md:text-3xl font-black">
                {data?.summary?.totalObtained || 0}
                <span className="text-base text-gray-500 font-medium ml-1">
                  / {data?.summary?.totalMax || 0}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                Percentage
              </p>
              <p className="text-2xl md:text-3xl font-black">
                {data?.summary?.percentage || "0"}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                Grade
              </p>
              <p className="text-2xl md:text-3xl font-black text-amber-400">
                {data?.summary?.overallGrade || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                Result
              </p>
              <p
                className={`text-xl md:text-2xl font-black uppercase tracking-wider ${data?.summary?.resultStatus === "Pass" ? "text-emerald-400" : "text-red-400"}`}
              >
                {data?.summary?.resultStatus || "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12 pt-8">
          <div className="text-center">
            <div className="w-32 md:w-48 border-b-2 border-gray-300 mb-3"></div>
            <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">
              Class Teacher
            </p>
          </div>
          <div className="text-center">
            <div className="w-32 md:w-48 border-b-2 border-gray-300 mb-3"></div>
            <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">
              Principal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
