"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// 📝 Interfaces for TypeScript
interface Student {
    _id: string;
    rollNumber: string;
    name: string;
    gender: "Male" | "Female";
    attendanceToday: "Present" | "Absent" | "Late" | "Not Marked";
}

interface SubjectTeacher {
    subject: string;
    teacherName: string;
}

interface ClassDetails {
    _id: string;
    className: string;
    section: string;
    classTeacher: string;
    roomNumber: string;
    totalStudents: number;
    students: Student[];
    subjectTeachers: SubjectTeacher[];
}

export default function ClassDetailsPage() {
    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"students" | "info">("students");

    // Data State
    const [classData, setClassData] = useState<ClassDetails | null>(null);

    // 🔌 Dummy Fetch (Replace with actual API call using classId from URL params)
    useEffect(() => {
        const fetchClassDetails = async () => {
            setIsLoading(true);
            // Simulating API delay
            setTimeout(() => {
                setClassData({
                    _id: "cls_10A",
                    className: "Class 10",
                    section: "A",
                    classTeacher: "Mr. Rajesh Kumar",
                    roomNumber: "Room 104 (First Floor)",
                    totalStudents: 45,
                    subjectTeachers: [
                        { subject: "Mathematics", teacherName: "Mr. Rajesh Kumar" },
                        { subject: "Science", teacherName: "Mrs. Anita Sharma" },
                        { subject: "English", teacherName: "Ms. Priya Singh" },
                        { subject: "Computer", teacherName: "Mr. Amit Yadav" }
                    ],
                    students: [
                        { _id: "s1", rollNumber: "1001", name: "Aarav Verma", gender: "Male", attendanceToday: "Present" },
                        { _id: "s2", rollNumber: "1002", name: "Aditi Singh", gender: "Female", attendanceToday: "Absent" },
                        { _id: "s3", rollNumber: "1003", name: "Aryan Gupta", gender: "Male", attendanceToday: "Present" },
                        { _id: "s4", rollNumber: "1004", name: "Kavya Mishra", gender: "Female", attendanceToday: "Late" },
                        { _id: "s5", rollNumber: "1005", name: "Rohan Das", gender: "Male", attendanceToday: "Not Marked" },
                    ]
                });
                setIsLoading(false);
            }, 800);
        };
        fetchClassDetails();
    }, []);

    // Handlers
    const handleQuickAttendance = () => {
        toast.info(`Opening attendance register for ${classData?.className}-${classData?.section}`);
        // router.push(`/teacher/attendance?classId=${classData?._id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
                    <p className="text-gray-500">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (!classData) return <div className="p-8">Class not found!</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-gray-800 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* 1. PAGE HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button className="text-blue-600 text-sm font-medium hover:underline mb-2 flex items-center gap-1">
                            <span>←</span> Back to Classes
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {classData.className} <span className="text-gray-400 font-light">|</span> Section {classData.section}
                        </h1>
                    </div>
                    <button
                        onClick={handleQuickAttendance}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                    >
                        📝 Mark Attendance
                    </button>
                </div>

                {/* 2. QUICK STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: Class Teacher */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                            👨‍🏫
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Class Teacher</p>
                            <p className="text-lg font-bold text-gray-900">{classData.classTeacher}</p>
                        </div>
                    </div>

                    {/* Card 2: Total Students */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
                            👥
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Students</p>
                            <p className="text-lg font-bold text-gray-900">{classData.totalStudents}</p>
                        </div>
                    </div>

                    {/* Card 3: Room Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
                            🏫
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Room Number</p>
                            <p className="text-lg font-bold text-gray-900">{classData.roomNumber}</p>
                        </div>
                    </div>

                    {/* Card 4: Attendance Overview */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                            📊
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Today's Attendance</p>
                            <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Pending
                                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT AREA (Tabs Layout) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("students")}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "students"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Students List
                        </button>
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "info"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Class Information & Subjects
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="p-6">

                        {/* TAB 1: STUDENTS LIST */}
                        {activeTab === "students" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                            <th className="p-4 font-semibold rounded-tl-lg">Roll No.</th>
                                            <th className="p-4 font-semibold">Student Name</th>
                                            <th className="p-4 font-semibold">Gender</th>
                                            <th className="p-4 font-semibold text-center">Status Today</th>
                                            <th className="p-4 font-semibold text-right rounded-tr-lg">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classData.students.map((student, index) => (
                                            <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-600 font-medium">{student.rollNumber}</td>
                                                <td className="p-4 font-semibold text-gray-900">{student.name}</td>
                                                <td className="p-4 text-gray-600">{student.gender}</td>
                                                <td className="p-4 text-center">
                                                    {student.attendanceToday === "Present" && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Present</span>}
                                                    {student.attendanceToday === "Absent" && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Absent</span>}
                                                    {student.attendanceToday === "Late" && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Late</span>}
                                                    {student.attendanceToday === "Not Marked" && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Not Marked</span>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                        View Profile
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB 2: CLASS INFO & SUBJECTS */}
                        {activeTab === "info" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Subject Teachers List */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Subject Teachers</h3>
                                    <div className="space-y-3">
                                        {classData.subjectTeachers.map((subj, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div>
                                                    <p className="font-bold text-gray-800">{subj.subject}</p>
                                                    <p className="text-sm text-gray-500">Teacher: {subj.teacherName}</p>
                                                </div>
                                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {subj.subject.charAt(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Class Schedule / Extra Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Class Details</h3>
                                    <ul className="space-y-4">
                                        <li className="flex justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                            <span className="text-gray-500">Academic Year</span>
                                            <span className="font-semibold text-gray-900">2026-2027</span>
                                        </li>
                                        <li className="flex justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                            <span className="text-gray-500">Class Monitor</span>
                                            <span className="font-semibold text-gray-900">Aarav Verma</span>
                                        </li>
                                        <li className="flex justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                            <span className="text-gray-500">Weekly Performance</span>
                                            <span className="font-semibold text-green-600">Excellent (92%)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}