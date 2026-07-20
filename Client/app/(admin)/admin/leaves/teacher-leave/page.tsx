"use client";

import React from "react";
import { usePendingLeaves, useUpdateLeaveStatus } from "./_components/useLeave";

interface ILeaveFrontend {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    studentId: string;
  };
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export default function LeaveApprovalClient() {
  const { data: responseData, isLoading, isError } = usePendingLeaves();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateLeaveStatus();

  const leaves: ILeaveFrontend[] =
    responseData?.data ||
    responseData?.leave ||
    (Array.isArray(responseData?.leave) ? responseData : []);

  const handleStatusChange = (
    leaveId: string,
    newStatus: "Approved" | "Rejected",
  ) => {
    updateStatus({ leaveId, status: newStatus });
  };

  // Error State
  if (isError) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Failed to load leave requests. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Student Leave Requests
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 relative">
        {isUpdating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded shadow">
              Updating...
            </span>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Type & Reason
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Dates
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaves.map((leave) => (
              <tr
                key={leave._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* ... Tumhara existing table row data same rahega ... */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {leave.studentId?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {leave.studentId?.studentId || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-[250px]">
                  <span className="text-sm font-semibold text-gray-700 block mb-1">
                    {leave.leaveType || "Leave"}
                  </span>
                  <span
                    className="text-sm text-gray-500 truncate block"
                    title={leave.reason}
                  >
                    {leave.reason}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      to {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-amber-100 text-amber-800">
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleStatusChange(leave._id, "Approved")}
                      disabled={isUpdating}
                      className="px-4 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-md transition-all shadow-sm disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(leave._id, "Rejected")}
                      disabled={isUpdating}
                      className="px-4 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200 rounded-md transition-all shadow-sm disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* EMPTY STATE LOGIC - Flawlessly works when array is empty */}
            {!isLoading && leaves.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-base font-medium">No pending requests</p>
                    <p className="text-sm mt-1">You're all caught up!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
