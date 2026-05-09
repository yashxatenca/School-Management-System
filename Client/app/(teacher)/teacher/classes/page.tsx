"use client";

import React, { useState, useEffect, useMemo, Suspense, memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { toast } from "react-toastify";

// 🚀 Interfaces Import
import { ClassDetails, SubjectTeacher } from "@/app/(teacher)/teacher/classes/class.interface";


// --- Sub-components (Memoized for Performance) ---
const SubjectCard = memo(({ subj }: { subj: SubjectTeacher }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
        <div>
            <p className="font-bold text-gray-800">{subj.subject}</p>
            <p className="text-sm text-gray-500">Teacher: {subj.teacherName}</p>
        </div>
        <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {subj.subject.charAt(0)}
        </span>
    </div>
));

SubjectCard.displayName = "SubjectCard";

// --- Main Component ---
export default function ClassDetailsPage() {
    const { user } = useSelector((state: RootState) => state.teacherauthstate);
    const [isLoading, setIsLoading] = useState(true);
    const [classData, setClassData] = useState<ClassDetails | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                // logic for backend fetch goes here
                // Example structure for your API:
                const response = {
                    _id: "loading...",
                    className: "Class 10",
                    section: "A",
                    classTeacher: user?.name || "Loading...",
                    totalStudents: 0,
                    subjectTeachers: [],
                    academicYear: "2026-2027"
                };
                setClassData(response);
            } catch (error) {
                toast.error("Failed to load class details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Fetching details...</p>
                </div>
            </div>
        );
    }

    if (!classData) return <div className="p-8 text-center">Class details unavailable.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <header className="mb-8">
                    <button className="text-blue-600 text-sm font-medium hover:underline mb-4 flex items-center gap-1 transition-all">
                        <span>←</span> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {classData.className}
                        <span className="text-blue-600 mx-2">/</span>
                        <span className="font-light text-gray-500">Section {classData.section}</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Essential Info */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-uppercase tracking-wider text-gray-400 font-bold mb-4 uppercase">
                                Quick Overview
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 text-xl">👨‍🏫</div>
                                    <div>
                                        <p className="text-xs text-gray-500">Class Teacher</p>
                                        <p className="font-bold text-gray-900">{user?.name || "Assigned"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600 text-xl">👥</div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total Students</p>
                                        <p className="font-bold text-gray-900">{classData.totalStudents}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-50 rounded-lg text-green-600 text-xl">📅</div>
                                    <div>
                                        <p className="text-xs text-gray-500">Academic Session</p>
                                        <p className="font-bold text-gray-900">{classData.academicYear}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Subject Teachers */}
                    <main className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Subject Teachers</h2>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                                    {classData.subjectTeachers.length} Subjects
                                </span>
                            </div>

                            <div className="p-6">
                                {classData.subjectTeachers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-lg" />}>
                                            {classData.subjectTeachers.map((subj, idx) => (
                                                <SubjectCard key={`${subj.subject}-${idx}`} subj={subj} />
                                            ))}
                                        </Suspense>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 italic text-sm">No subject data mapped yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}