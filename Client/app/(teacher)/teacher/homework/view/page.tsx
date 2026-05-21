"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";

import {
    Search,
    Filter,
    FileText,
    Loader2,
    BookOpen,
} from "lucide-react";
import { useGetTeacherAllClass } from "@/hooks/Teacher/useTeacherClass";
import { useGetHomeworkByClassId } from "@/hooks/Teacher/useTeacherHomework";

const ITEMS_PER_PAGE = 15;

/* =========================================================
   COMPONENT
========================================================= */

export default function TeacherHomeworkViewPage() {
    // 1. UI States for Filters
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedHomework, setSelectedHomework] = useState("");
    const [searchStudent, setSearchStudent] = useState("");

    // 2. Fetch Classes (Runs on page load)
    const {
        data: classData,
        isLoading: classLoading,
        error: classError,
    } = useGetTeacherAllClass();

    const classPayload = classData?.data?.data;
    const teacherClasses = Array.isArray(classPayload)
        ? classPayload
        : (classPayload?.classes || []);

    // 3. Fetch Homeworks based on selected class ID 
    // ACHHAY SE DEKHO: Yahan humne `skip` aur `enabled` laga diya hai taaki jab tak selectedClass na ho, call na jaye
    const {
        data: homeworkData,
        isLoading: isFetchingHomework, // Renamed to avoid confusion
    } = useGetHomeworkByClassId(selectedClass, {
        skip: !selectedClass,       // For RTK Query
        enabled: !!selectedClass    // For React Query
    });

    // Humara custom loading state jisse initial render pe loading na dikhe
    const homeworkLoading = selectedClass ? isFetchingHomework : false;

    const homeworkPayload = homeworkData?.data?.data;

    // Fallbacks
    const homeworks = Array.isArray(homeworkPayload)
        ? homeworkPayload
        : (homeworkPayload?.homeworks || []);

    const allSubmissions = homeworkPayload?.submissions || [];

    // 4. Pagination States
    const [displayedData, setDisplayedData] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    /* =========================================================
       DERIVED DATA
    ========================================================= */

    const filteredSubmissions = allSubmissions.filter((sub: any) => {
        const matchHomework = selectedHomework ? sub.homeworkId === selectedHomework : true;
        const matchSearch = sub.studentName?.toLowerCase().includes(searchStudent.toLowerCase());

        return matchHomework && matchSearch;
    });

    const currentHomework = homeworks.find((hw: any) => hw._id === selectedHomework);

    /* =========================================================
       RESET PAGINATION ON FILTER CHANGE
    ========================================================= */

    useEffect(() => {
        setDisplayedData(filteredSubmissions.slice(0, ITEMS_PER_PAGE));
    }, [selectedClass, selectedHomework, searchStudent, allSubmissions.length]);

    /* =========================================================
       LOAD MORE (Pagination)
    ========================================================= */

    const loadMoreData = useCallback(() => {
        if (isLoadingMore) return;
        if (displayedData.length >= filteredSubmissions.length) return;

        setIsLoadingMore(true);

        setTimeout(() => {
            setDisplayedData((prev) => {
                const currentLength = prev.length;
                const nextData = filteredSubmissions.slice(
                    currentLength,
                    currentLength + ITEMS_PER_PAGE
                );

                const uniqueData = nextData.filter(
                    (item: any) => !prev.some((prevItem) => prevItem._id === item._id)
                );

                return [...prev, ...uniqueData];
            });
            setIsLoadingMore(false);
        }, 300);
    }, [displayedData.length, filteredSubmissions, isLoadingMore]);

    /* =========================================================
       OBSERVER
    ========================================================= */

    useEffect(() => {
        const currentTarget = observerTarget.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreData();
                }
            },
            { threshold: 0.5 }
        );

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMoreData]);

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Homework Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage homework submissions smoothly.
                        </p>
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* CLASS SELECT */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                            {classLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            ) : (
                                <Filter className="w-4 h-4 text-gray-400" />
                            )}
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setSelectedHomework("");
                                }}
                                className="ml-2 bg-transparent outline-none text-sm cursor-pointer"
                            >
                                <option value="">Select Class</option>
                                {teacherClasses.map((cls: any) => (
                                    <option key={cls._id} value={cls._id}>
                                        {"Class " + cls.name + " Section " + cls.section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* HOMEWORK SELECT */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                            {homeworkLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            ) : (
                                <BookOpen className="w-4 h-4 text-gray-400" />
                            )}
                            <select
                                value={selectedHomework}
                                onChange={(e) => setSelectedHomework(e.target.value)}
                                disabled={!selectedClass || homeworkLoading}
                                className="ml-2 bg-transparent outline-none text-sm cursor-pointer disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {!selectedClass
                                        ? "Select Class First"
                                        : homeworkLoading
                                            ? "Loading Homework..."
                                            : "Select Homework"}
                                </option>
                                {homeworks.map((hw: any) => (
                                    <option key={hw._id} value={hw._id}>
                                        {hw.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SEARCH */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                className="ml-2 bg-transparent outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* MAIN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT SIDE */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit sticky top-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Homework Details
                        </h2>

                        {currentHomework ? (
                            <div className="mt-5 space-y-5">
                                <div>
                                    <p className="text-sm text-gray-500">Title</p>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                        {currentHomework.title}
                                    </h3>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Instructions</p>
                                    <div className="bg-gray-50 border rounded-xl p-4 mt-2 text-sm leading-relaxed text-gray-700">
                                        {currentHomework.description}
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between">
                                    <span className="text-blue-700 font-medium">Due Date</span>
                                    <span className="font-semibold text-blue-900">
                                        {currentHomework.dueDate}
                                    </span>
                                </div>
                                { /*
                                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex justify-between">
                                    <span className="text-purple-700 font-medium">Total Students</span>
                                    <span className="font-semibold text-purple-900">
                                        {filteredSubmissions.length}
                                    </span>
                                </div>*/}
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm text-center">
                                Select homework to view details.
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Student Submissions
                            </h2>
                        </div>

                        <div className="overflow-auto max-h-[700px]">
                            <table className="w-full min-w-[600px]">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                    <tr className="text-sm text-gray-600">
                                        <th className="p-4 text-left">Student</th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="p-4 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedData.length > 0 ? (
                                        displayedData.map((sub: any) => (
                                            <tr key={sub._id} className="border-b hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-800">
                                                    {sub.studentName}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.status === "Submitted"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {sub.status === "Submitted" ? (
                                                        <button className="text-blue-600 hover:text-blue-800 underline font-medium">
                                                            Check Work
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-10 text-center text-gray-400">
                                                {homeworkLoading
                                                    ? "Loading submissions..."
                                                    : !selectedClass
                                                        ? "Please select a class to view submissions."
                                                        : "No submissions found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* LOAD MORE */}
                            {displayedData.length < filteredSubmissions.length && (
                                <div ref={observerTarget} className="flex justify-center p-5">
                                    {isLoadingMore && (
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    )}
                                </div>
                            )}

                            {/* END */}
                            {displayedData.length === filteredSubmissions.length && displayedData.length > 0 && (
                                <div className="text-center text-sm text-gray-400 p-4">
                                    End of submissions
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}