"use client";
import React, { useState, useRef, useCallback } from "react";
import { useStudentFetchAssignment } from "@/hooks/Student/useStudentAsssignment";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface Homework {
  _id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string | null;
  hasDueDate: boolean;
  createdAt: string;
  attachments: any[];
  submission?: {
    _id: string;
    submissionLink: string;
    createdAt: string;
  } | null;
}

const StudentHomeworkPage = () => {
  const classId = useSelector((state: RootState) => state.studentclassstate);
  const { data, isLoading, isError } = useStudentFetchAssignment(
    classId.classId as string,
  );

  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null,
  );
  const [visibleCount, setVisibleCount] = useState(6);

  const observer = useRef<IntersectionObserver | null>(null);

  // FIX: Typecast 'data' to 'any' to bypass strict AxiosResponse property checks
  const homeworkList: Homework[] =
    (data as any)?.data?.result || (data as any)?.result || [];

  const hasMore = visibleCount < homeworkList.length;

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + 6);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex justify-center items-center min-h-[50vh]">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading homework...
        </p>
      </div>
    );
  }

  if (isError && homeworkList.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex justify-center items-center min-h-[50vh]">
        <p className="text-xl font-semibold text-red-500">
          Failed to load homework. Please try again.
        </p>
      </div>
    );
  }

  const visibleHomework = homeworkList.slice(0, visibleCount);
  const currentDate = new Date();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Class Homework</h1>

      {homeworkList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-blue-50 p-6 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-xl font-medium">No assignment</p>
          <p className="text-gray-400 text-sm mt-2">
            Check back later for new tasks.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleHomework.map((hw, index) => {
              const isLastElement = index === visibleHomework.length - 1;
              const isPastDueDate =
                hw.hasDueDate &&
                hw.dueDate &&
                currentDate > new Date(hw.dueDate);
              const isSubmitted = !!hw.submission;

              return (
                <div
                  key={hw._id}
                  ref={isLastElement ? lastElementRef : null}
                  className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition flex flex-col h-full relative"
                >
                  {isSubmitted && (
                    <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                      ✓ Submitted
                    </span>
                  )}

                  <div className="flex justify-between items-start mb-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
                      Subject Assignment
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {hw.title}
                  </h2>

                  {hw.hasDueDate && hw.dueDate && (
                    <p
                      className={`text-sm font-medium mb-3 ${
                        isPastDueDate ? "text-red-500" : "text-orange-500"
                      }`}
                    >
                      {isPastDueDate ? "Deadline Passed: " : "Due: "}
                      {new Date(hw.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {hw.description}
                  </p>

                  <button
                    onClick={() => setSelectedHomework(hw)}
                    className="w-full py-2.5 rounded-lg transition font-medium mt-auto text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm animate-pulse">
                Loading more assignments...
              </p>
            </div>
          )}
        </>
      )}

      {selectedHomework &&
        (() => {
          const isPastDueDate =
            selectedHomework.hasDueDate &&
            selectedHomework.dueDate &&
            currentDate > new Date(selectedHomework.dueDate);
          const isSubmitted = !!selectedHomework.submission;

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-start mb-4 shrink-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                      {selectedHomework.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedHomework(null)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto pr-2 mb-4">
                  <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                    <p>
                      <strong>Assigned:</strong>{" "}
                      {new Date(
                        selectedHomework.createdAt,
                      ).toLocaleDateString()}
                    </p>

                    {selectedHomework.hasDueDate &&
                      selectedHomework.dueDate && (
                        <p
                          className={
                            isPastDueDate
                              ? "text-red-600 font-bold"
                              : "text-orange-600"
                          }
                        >
                          <strong>Due Date:</strong>{" "}
                          {new Date(
                            selectedHomework.dueDate,
                          ).toLocaleDateString()}
                        </p>
                      )}

                    {isSubmitted && selectedHomework.submission && (
                      <p className="text-green-600">
                        <strong>Submitted On:</strong>{" "}
                        {new Date(
                          selectedHomework.submission.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Instructions:
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedHomework.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5 mt-auto shrink-0 flex justify-end">
                  <button
                    onClick={() => setSelectedHomework(null)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default StudentHomeworkPage;
