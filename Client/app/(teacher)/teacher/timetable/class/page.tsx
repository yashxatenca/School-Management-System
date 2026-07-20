"use client";
import React from "react";
import { useClassTimetable } from "@/hooks/Teacher/useTeacherTimetable";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
const TeacherClassTimetable = () => {
  const { classId } = useSelector(
    (state: RootState) => state.teacherclassstate,
  );
  const { data, isLoading, isError } = useClassTimetable(classId as string);
  const extractDriveId = (url: any) => {
    try {
      const match = url?.match(/\/d\/(.+?)\//);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading timetable.</div>;

  const item = data?.data?.data || data?.data || data;

  if (!item || Object.keys(item).length === 0)
    return <div>No timetable found.</div>;

  const fileId = extractDriveId(item.driveLink);
  const previewUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : item.driveLink;
  const downloadUrl = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : item.driveLink;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Class Timetable & Resources</h2>

      <div className="max-w-2xl border rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Title: {item.title}</h3>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              Category: {item.category}
            </span>
          </div>
        </div>

        {fileId ? (
          <iframe
            src={previewUrl}
            className="w-full h-96 border-0"
            title={item.title}
            allow="autoplay"
          ></iframe>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-500">
            Invalid Drive Link Formatted
          </div>
        )}

        <div className="p-4 flex gap-3">
          <a
            href={item.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            View Tab
          </a>

          {fileId && (
            <a
              href={downloadUrl}
              className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassTimetable;
