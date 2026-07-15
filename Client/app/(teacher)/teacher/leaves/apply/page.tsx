"use client";
import { useState } from "react";
import {
  useGetLeaves,
  useCreateLeave,
  useDeleteLeave,
} from "./_components/useLeave";

export default function LeaveManagementPage() {
  const { data, isFetching, refetch } = useGetLeaves();
  const { mutate: create, isPending: isCreating } = useCreateLeave();
  const { mutate: remove } = useDeleteLeave();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(formData as any, {
      onSuccess: () =>
        setFormData({ startDate: "", endDate: "", leaveType: "", reason: "" }),
    });
  };

  const allLeaves = data?.data?.data || [];
  const visibleLeaves = allLeaves.filter(
    (leave: any) => leave.status === "Pending" || leave.status === "Rejected",
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* 1. Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Apply Leave</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="date"
            required
            className="p-2 border rounded-lg outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            value={formData.startDate}
          />
          <input
            type="date"
            required
            className="p-2 border rounded-lg outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            value={formData.endDate}
            min={formData.startDate}
          />
          <select
            className="p-2 border rounded-lg outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
            value={formData.leaveType}
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
          </select>
          <input
            type="text"
            placeholder="Reason"
            className="p-2 border rounded-lg col-span-full outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            value={formData.reason}
            required
          />
          <button
            disabled={isCreating}
            className="bg-indigo-600 text-white font-medium p-2.5 rounded-lg col-span-full hover:bg-indigo-700 disabled:opacity-70 transition"
          >
            {isCreating ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* 2. History Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Active Requests</h2>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
          >
            {isFetching ? "Fetching..." : "Fetch Leaves"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isFetching ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-gray-500 font-medium"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : !data ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-600">
                      No data loaded
                    </p>
                    <p className="text-sm mt-1">
                      Click the "Fetch Leaves" button to view your active
                      requests.
                    </p>
                  </td>
                </tr>
              ) : visibleLeaves.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-600">
                      No records found
                    </p>
                    <p className="text-sm mt-1">
                      You don't have any pending or rejected leave requests.
                    </p>
                  </td>
                </tr>
              ) : (
                visibleLeaves.map((leave: any) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-700">
                      {leave.leaveType}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold
                      ${leave.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}
                    `}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {leave.status === "Pending" && (
                        <button
                          onClick={() => remove(leave._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
