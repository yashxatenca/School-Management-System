"use client";

import { useSelector } from "react-redux";
import { useClassTimetables } from "./_components/useTimtable";
import { RootState } from "@/app/redux/store";

export default function StudentTimetablePage() {
  const { classId, className, sectionName } = useSelector(
    (state: RootState) => state.studentclassstate,
  );

  // FIX 1: Cast classId to string to prevent "null is not assignable to string" error
  const { data, isLoading, isError, error } = useClassTimetables(
    classId as string,
  );

  // FIX 2: Cast data to any to prevent strict type checking on nested properties
  const timetables =
    (data as any)?.data?.timetable || (data as any)?.data || [];

  if (!classId) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg m-6 border border-yellow-200">
        No class assigned to your profile. Please contact the administrator.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg m-6 border border-red-200">
        Error fetching timetables:{" "}
        {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Class Timetable</h1>
        {(className || sectionName) && (
          <p className="text-gray-500 mt-2 font-medium">
            Showing schedule for Class {className}{" "}
            {sectionName && `- Section ${sectionName}`}
          </p>
        )}
      </div>

      {timetables.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">
            No timetables uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {timetables.map((timetable: any) => (
            <div
              key={timetable._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full tracking-wider">
                    {timetable.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">
                  {timetable.title}
                </h3>
              </div>

              <a
                href={timetable.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium group mt-2"
              >
                View Document
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
