// app/classes/[classId]/notices/page.tsx
"use client";
import { useClassNotices } from "./_components/useNotice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
export default function ClassNoticesPage() {
  // URL se classId nikalna
  const Class = useSelector((state: RootState) => state.studentclassstate);

  // Tumhara custom hook yaha call ho raha hai
  const {
    data: notices,
    isLoading,
    isError,
  } = useClassNotices(Class.classId as string);

  return (
    <main className="max-w-4xl min-h-screen px-4 py-8 mx-auto">
      <header className="pb-4 mb-8 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
        <p className="mt-2 text-gray-600">
          Review the latest announcements and instructions for your class.
        </p>
      </header>

      {/* Loading State (Lazy loading feel) */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-full h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 text-red-500 bg-red-50 rounded border border-red-200">
          Failed to load notices. Please try again later.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && notices?.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          No notices posted for this class yet.
        </div>
      )}

      {/* Data Render */}
      {!isLoading && !isError && notices && notices.length > 0 && (
        <div className="space-y-6">
          {notices.map((notice: any) => (
            <article
              key={notice._id}
              className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {notice.title}
              </h3>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                {notice.content}
              </p>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <span className="font-medium">
                  Posted by: {notice.createdBy?.name || "Admin"}
                </span>
                <time dateTime={notice.createdAt}>
                  {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
