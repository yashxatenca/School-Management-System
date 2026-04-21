"use client";

import { useState } from "react";
import { useGetHomeworks } from "@/hooks/Admin/useHomework";
import { useGetClasses } from "@/hooks/Admin/useClass";
import { BookOpen, Calendar, Users, ArrowRight, Filter, Search } from "lucide-react";
import { homeworkService } from "@/lib/admin_api/AdminHomeworkService";
export default function ClassWiseHomework() {
    // Dropdown me jo select hua hai
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [activeClassId, setActiveClassId] = useState<string>("");
    const [homeworkList, setHomeworkList] = useState<any[]>([]);
    const [isHomeworkLoading, setIsHomeworkLoading] = useState(false);
    // 1. Classes fetch karne ka hook
    const { data: classesResponse, isLoading: isClassesLoading } = useGetClasses();

    // Fetch button ka handler
    const handleFetch = async () => {
        if (selectedClass) {
            // Jaise hi hum activeClassId set karenge, upar wala useGetHomeworks hook trigger ho jayega
            setActiveClassId(selectedClass);
            const data = await homeworkService.getbyAllId(
                selectedClass
            );
            setHomeworkList(data);
        }
    };


    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
            {/* Header section with Filter & Fetch Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Class-wise Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Select a class and click fetch to track homework.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Dropdown */}
                    <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 flex-1 sm:flex-none">
                        <Filter className="w-4 h-4 text-gray-500 ml-2 hidden sm:block" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            disabled={isClassesLoading}
                            className="bg-transparent border-none text-gray-700 text-sm font-medium focus:ring-0 outline-none w-full min-w-[200px] cursor-pointer py-1.5 px-2 disabled:opacity-50"
                        >
                            <option value="" disabled>Select a Class...</option>
                            {classesResponse?.data?.map((cls: any) => (
                                <option key={cls._id} value={cls._id}>
                                    Class {cls.name} - Section {cls.section}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fetch Button */}
                    <button
                        onClick={handleFetch}
                        disabled={!selectedClass || isClassesLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" /> Fetch
                    </button>
                </div>
            </div>

            {/* Content Section */}
            {!activeClassId ? (
                // 1. Empty State - Jab tak user Fetch par click na kare
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="bg-blue-50 p-5 rounded-full mb-5">
                        <BookOpen className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Ready to Fetch</h3>
                    <p className="text-gray-500 mt-2 max-w-md">Please choose a class from the dropdown above and click <strong>Fetch</strong> to view assigned homework.</p>
                </div>
            ) : isHomeworkLoading ? (
                // 2. Loading State
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-40"></div>
                    ))}
                </div>
            ) : homeworkList?.length === 0 ? (
                // 3. No Homework Found State
                <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">No Homework Assigned</h3>
                    <p className="text-gray-500 mt-2">There are currently no active homework assignments for this class.</p>
                </div>
            ) : (
                // 4. Homework Data Cards
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {homeworkList?.map((hw: any) => {
                        const total = hw.stats?.totalStudents || 0;
                        const submitted = hw.stats?.submitted || 0;
                        const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;

                        return (
                            <div key={hw._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
                                            {hw.subjectId?.name || "Subject"}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            {new Date(hw.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                                        {hw.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                        {hw.description}
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                        {hw.assignedById.role === 'admin' ? "Principal : " + hw.assignedById.name : "Teacher" + hw.assignedById.name}
                                    </p>
                                </div>

                                {/* Stats & Action Section */}
                                <div className="mt-auto border-t border-gray-50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div className="flex items-center text-sm font-medium text-gray-600">
                                                <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                                                Submissions
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {submitted} / {total}
                                                <span className="text-gray-400 text-xs font-medium ml-1">({percentage}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${percentage >= 80 ? 'bg-green-500' : percentage >= 40 ? 'bg-blue-500' : 'bg-orange-400'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <button className="flex items-center justify-center w-full sm:w-auto bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm group/btn">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}