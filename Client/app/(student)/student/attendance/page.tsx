"use client";

import { useState, useRef, useEffect } from "react";
import { useStudentMyAttendance } from "./_components/useAttendance";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";

export default function StudentAttendancePage() {
  // Date filter state
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Pass selectedDate to hook
  const { data, isLoading, isError } = useStudentMyAttendance(selectedDate);

  // Reset visible items when date filter changes or new data arrives
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedDate, data]);

  // Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          data?.data &&
          visibleCount < data.data.length
        ) {
          // Load 10 more items when scrolled to the bottom
          setVisibleCount((prev) => prev + 10);
        }
      },
      { threshold: 0.1 }, // Trigger slightly before it comes fully into view
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, data]);

  // Helper to safely render Class Name
  const getClassName = (cls: string | (typeof data.data)[0]["class"]) => {
    if (typeof cls === "object" && cls !== null) {
      return cls.section ? `${cls.name} (${cls.section})` : cls.name;
    }
    return cls || "General Class";
  };

  // Helper to format date safely
  const formatDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
      return isNaN(dateObj.getTime())
        ? dateStr.split("T")[0]
        : dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch {
      return dateStr;
    }
  };

  // Slice the data to only show the visible count
  const visibleData = data?.data?.slice(0, visibleCount) || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Attendance Logs</h1>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {/* Header with Date Picker */}
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> Attendance History
          </div>

          {/* Date Selector & Clear Control */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors shadow-sm"
                title="Show all history"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <p className="p-6 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading logs...
          </p>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-6 text-sm text-rose-600 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Failed to load attendance records. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && data?.data?.length === 0 && (
          <div className="p-8 text-center space-y-1">
            <p className="text-sm font-medium text-gray-700">
              No records found
            </p>
            <p className="text-xs text-gray-500">
              {selectedDate
                ? `No attendance marked for ${selectedDate}`
                : "No attendance history available yet."}
            </p>
          </div>
        )}

        {/* Data List (Paginated) */}
        {!isLoading && !isError && visibleData.length > 0 && (
          <div className="divide-y text-sm">
            {visibleData.map((log: any) => (
              <div
                key={log._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      {formatDate(log.date)}
                    </p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      {getClassName(log.class)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {log.remarks || "Regular daily record"}
                  </p>
                </div>

                <div>
                  {log.status === "PRESENT" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  )}
                  {log.status === "ABSENT" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )}
                  {log.status === "LATE" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Late
                    </span>
                  )}
                  {log.status === "EXCUSED" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      <ShieldAlert className="w-3.5 h-3.5" /> Excused
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Scroll Observer Target */}
            {data?.data && visibleCount < data.data.length && (
              <div
                ref={loaderRef}
                className="p-4 flex justify-center items-center text-gray-500 text-xs"
              >
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading
                more...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
