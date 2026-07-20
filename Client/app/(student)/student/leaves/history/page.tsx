"use client";
import { useGetLeaves } from "../apply/_components/useLeave";
import { Suspense } from "react";

function ApprovedLeavesData() {
  const { data, isFetching, refetch } = useGetLeaves();
  const allLeaves = data?.data?.data || [];
  const approvedLeaves = allLeaves.filter(
    (leave: any) => leave.status === "Approved",
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Approved Leaves
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            History of your approved requests
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 font-semibold rounded-lg hover:bg-green-100 disabled:opacity-50 transition whitespace-nowrap"
        >
          {isFetching ? "Fetching..." : "Fetch Leaves"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold whitespace-nowrap">Type</th>
                <th className="p-4 font-semibold whitespace-nowrap">Dates</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="p-6">
                    <div className="flex flex-col gap-3">
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                    </div>
                  </td>
                </tr>
              ) : !data ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <p className="text-base md:text-lg font-medium text-gray-600">
                      No data loaded
                    </p>
                  </td>
                </tr>
              ) : approvedLeaves.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <p className="text-base md:text-lg font-medium text-gray-600">
                      No approved leaves
                    </p>
                  </td>
                </tr>
              ) : (
                approvedLeaves.map((leave: any) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-700 whitespace-nowrap">
                      {leave.leaveType}
                    </td>
                    <td className="p-4 text-gray-600 whitespace-nowrap text-sm md:text-base">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-500 text-sm max-w-[200px] md:max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-green-100 text-green-700">
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function ApprovedLeavesPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <Suspense
        fallback={
          <div className="w-full h-40 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center border border-gray-100">
            <span className="text-gray-400 font-medium">Loading layout...</span>
          </div>
        }
      >
        <ApprovedLeavesData />
      </Suspense>
    </div>
  );
}
