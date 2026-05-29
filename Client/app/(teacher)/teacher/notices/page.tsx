"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { toast } from "react-toastify";
import {
  Megaphone,
  Trash2,
  Send,
  Clock,
  AlertCircle,
  RefreshCw,
  DownloadCloud,
} from "lucide-react";
import {
  useGetNotices,
  useCreateNotice,
  useDeleteNotice,
} from "@/hooks/Teacher/useTeacherNotice";

export default function NoticeBoardPage() {
  // 🎯 Redux States
  const user = useSelector((state: RootState) => state.teacherauthstate?.user);
  const classId = useSelector(
    (state: RootState) => state.teacherclassstate?.classId,
  );

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // 🎛️ Fetch Button State
  const [isFetchTriggered, setIsFetchTriggered] = useState(false);

  // 🚀 React Query Hooks
  const {
    data: notices,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotices(classId as string, isFetchTriggered);

  // 🛡️ FRONTEND DEFENSE: FIXED LOGIC
  // Extract the actual array safely regardless of how deeply nested the Axios response is
  const rawData = notices?.data?.data || notices?.data || notices;
  const noticesList = Array.isArray(rawData) ? rawData : [];

  const { mutate: createNotice, isPending: isCreating } = useCreateNotice();
  const { mutate: deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = {
      ...formData,
      classId: classId,
      createdBy: user?._id,
    };

    createNotice(payload, {
      onSuccess: () => {
        toast.success("Notice published successfully!");
        setFormData({ title: "", content: "" });
        if (isFetchTriggered) refetch();
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to publish notice",
        );
      },
    });
  };

  const handleFetchNotices = () => {
    setIsFetchTriggered(true);
    refetch();
  };

  if (!classId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500 bg-gray-50 p-4 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          No Class Selected
        </h2>
        <p className="text-base md:text-lg">
          Please select a class from your dashboard to view or create notices.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Megaphone className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Class Notice Board
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 📝 CREATE NOTICE FORM (Top on Mobile, Left on Desktop) */}
          <div className="lg:col-span-4 lg:order-1 order-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Create New Notice
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2.5 md:p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm md:text-base transition-shadow"
                    placeholder="E.g., Tomorrow is a Holiday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2.5 md:p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none text-sm md:text-base transition-shadow"
                    placeholder="Write the complete notice details here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-sm text-sm md:text-base"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  {isCreating ? "Publishing..." : "Publish Notice"}
                </button>
              </form>
            </div>
          </div>

          {/* 📢 NOTICE LIST (Bottom on Mobile, Right on Desktop) */}
          <div className="lg:col-span-8 lg:order-2 order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 min-h-[50vh] lg:min-h-[60vh]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Class Announcements
                </h2>

                {/* 🔄 FETCH BUTTON */}
                <button
                  onClick={handleFetchNotices}
                  disabled={isLoading || isFetching}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-70 shadow-sm"
                >
                  {isLoading || isFetching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <DownloadCloud className="w-4 h-4" />
                  )}
                  {isFetchTriggered ? "Refresh List" : "Fetch Notices"}
                </button>
              </div>

              {!isFetchTriggered ? (
                // 🛑 JAB TAK BUTTON NAHI DABAYA
                <div className="text-center py-12 md:py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 px-4">
                  <DownloadCloud className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    Click the button above to load class notices.
                  </p>
                </div>
              ) : isLoading || isFetching ? (
                // ⏳ JAB DATA AA RAHA HAI
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : noticesList.length === 0 ? (
                // ❌ DATA EMPTY HAI
                <div className="text-center py-12 md:py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 px-4">
                  <Megaphone className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    No notices published for this class yet.
                  </p>
                </div>
              ) : (
                // ✅ DATA SHOW KARO
                <div className="space-y-4">
                  {noticesList.map((notice: any) => (
                    <div
                      key={notice._id}
                      className="group border border-gray-200 rounded-xl p-4 md:p-5 hover:border-blue-300 hover:shadow-md transition-all bg-gray-50 hover:bg-white flex flex-col sm:flex-row justify-between items-start gap-4"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 text-xs md:text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 md:px-2.5 md:py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                            {new Date(notice.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed break-words">
                          {notice.content}
                        </p>
                      </div>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this notice?",
                            )
                          ) {
                            deleteNotice(notice._id, {
                              onSuccess: () => toast.success("Notice deleted"),
                            });
                          }
                        }}
                        disabled={isDeleting}
                        className="w-full sm:w-auto mt-2 sm:mt-0 p-2 md:p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 sm:border-transparent hover:border-red-100 rounded-lg transition-all flex items-center justify-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50 shrink-0 bg-white sm:bg-transparent"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="sm:hidden text-sm font-medium text-gray-600">
                          Delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
