"use client";

import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Calculator } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetClasses } from '@/lib/admin_api/AdminStudentApi';
import { useExams } from '@/hooks/Admin/useExam';
import { useGetSubjects } from '@/hooks/Admin/useSubject';
// IMPORT YOUR TEACHER AND STUDENT HOOKS HERE
// import { useGetTeachers } from '@/hooks/useTeacher';
// import { useGetStudents } from '@/hooks/useStudent';

// Types definition based on your Mongoose Model
interface ISubjectMark {
    subjectId: string;
    maxMarks: number;
    passingMarks: number;
    obtainedMarks: number;
    grade: string;
    remarks: string;
}

export default function AddMarkForm() {
    const { data: ClassResponse } = useGetClasses();
    const { data: ExamResponse } = useExams();
    const { data: SubjectResponse } = useGetSubjects();
    // const { data: TeacherResponse } = useGetTeachers();
    // const { data: StudentResponse } = useGetStudents();

    // Basic Details State
    const [basicDetails, setBasicDetails] = useState({
        examId: '',
        studentId: '',
        teacherId: '',
        classId: '',
        overallGrade: '',
        remarks: ''
    });

    // Dynamic Subjects Array State
    const [subjects, setSubjects] = useState<ISubjectMark[]>([
        { subjectId: '', maxMarks: 100, passingMarks: 33, obtainedMarks: 0, grade: '', remarks: '' }
    ]);

    // Calculated Totals State
    const [totals, setTotals] = useState({
        totalMaxMarks: 0,
        totalObtainedMarks: 0,
        percentage: 0,
        resultStatus: 'Pass'
    });

    // ==========================================
    // AUTO-CALCULATION LOGIC
    // ==========================================
    useEffect(() => {
        let max = 0;
        let obtained = 0;
        let isFail = false;

        subjects.forEach((sub) => {
            max += Number(sub.maxMarks) || 0;
            obtained += Number(sub.obtainedMarks) || 0;

            // If obtained is less than passing, student fails
            if (Number(sub.obtainedMarks) < Number(sub.passingMarks)) {
                isFail = true;
            }
        });

        const percent = max > 0 ? Number(((obtained / max) * 100).toFixed(2)) : 0;

        setTotals({
            totalMaxMarks: max,
            totalObtainedMarks: obtained,
            percentage: percent,
            resultStatus: isFail ? 'Fail' : 'Pass'
        });
    }, [subjects]);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (index: number, field: keyof ISubjectMark, value: string | number) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
        setSubjects(updatedSubjects);
    };

    const addSubjectRow = () => {
        setSubjects([...subjects, { subjectId: '', maxMarks: 100, passingMarks: 33, obtainedMarks: 0, grade: '', remarks: '' }]);
    };

    const removeSubjectRow = (index: number) => {
        if (subjects.length > 1) {
            const updatedSubjects = subjects.filter((_, i) => i !== index);
            setSubjects(updatedSubjects);
        } else {
            toast.warn("At least one subject is required!");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalData = {
            ...basicDetails,
            subjects,
            ...totals
        };

        console.log("Data ready for API:", finalData);
        // TODO: Call your Axios POST API here
        // await marksApi.create(finalData);
        toast.success("Marks data generated successfully!");
    };

    // Helper classes for standardizing inputs
    const inputClasses = "w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm";

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-10">

            {/* 1. BASIC DETAILS SECTION */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">1. Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Class ID</label>
                        <select required name="classId" value={basicDetails.classId} onChange={handleBasicChange} className={inputClasses}>
                            <option value="" disabled>Select Class</option>
                            {/* Adjust ._id and .className based on your actual API response structure */}
                            {ClassResponse?.data.map((cls: any) => (
                                <option key={cls._id} value={cls._id}>{cls.className || cls.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Teacher ID</label>
                        <select required name="teacherId" value={basicDetails.teacherId} onChange={handleBasicChange} className={inputClasses}>
                            <option value="" disabled>Select Teacher</option>
                            {/* Map your teacher data here */}
                            {/* {TeacherResponse?.map((teacher: any) => (
                                <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                            ))} */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Student ID</label>
                        <select required name="studentId" value={basicDetails.studentId} onChange={handleBasicChange} className={inputClasses}>
                            <option value="" disabled>Select Student</option>
                            {/* Map your student data here. You might want to filter this based on the selected classId! */}
                            {/* {StudentResponse?.map((student: any) => (
                                <option key={student._id} value={student._id}>{student.name}</option>
                            ))} */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Exam ID</label>
                        <select required name="examId" value={basicDetails.examId} onChange={handleBasicChange} className={inputClasses}>
                            <option value="" disabled>Select Exam</option>
                            {ExamResponse?.map((exam: any) => (
                                <option key={exam._id} value={exam._id}>{exam.examName || exam.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. SUBJECTS ENTRY SECTION */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">2. Subject Marks</h2>
                    <button type="button" onClick={addSubjectRow} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-100 transition">
                        <PlusCircle className="w-4 h-4" /> Add Subject
                    </button>
                </div>

                <div className="space-y-4">
                    {subjects.map((sub, index) => (
                        <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-3 bg-gray-50 p-3 rounded-md border border-gray-200 relative group">

                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                                <select
                                    required
                                    value={sub.subjectId}
                                    onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                                    className={inputClasses}
                                >
                                    <option value="" disabled>Select Subject</option>
                                    {SubjectResponse?.data?.map((subject: any) => (
                                        <option key={subject._id} value={subject._id}>{subject.subjectName || subject.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-24">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Max</label>
                                <input required type="number" value={sub.maxMarks} onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)} className={inputClasses} />
                            </div>

                            <div className="w-24">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Passing</label>
                                <input required type="number" value={sub.passingMarks} onChange={(e) => handleSubjectChange(index, 'passingMarks', e.target.value)} className={inputClasses} />
                            </div>

                            <div className="w-28">
                                <label className="block text-xs font-medium text-blue-600 mb-1">Obtained *</label>
                                <input required type="number" min="0" max={sub.maxMarks} value={sub.obtainedMarks} onChange={(e) => handleSubjectChange(index, 'obtainedMarks', e.target.value)} className="w-full border border-blue-300 p-2 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div className="w-24">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Grade</label>
                                <input type="text" placeholder="A, B+" value={sub.grade} onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)} className={inputClasses} />
                            </div>

                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Remarks</label>
                                <input type="text" placeholder="Good, Needs work..." value={sub.remarks} onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)} className={inputClasses} />
                            </div>

                            <button type="button" onClick={() => removeSubjectRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" title="Remove Subject">
                                <Trash2 className="w-5 h-5" />
                            </button>

                        </div>
                    ))}
                </div>
            </div>

            {/* 3. CALCULATED SUMMARY & FINAL SUBMIT */}
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-indigo-800">
                        <Calculator className="w-8 h-8 opacity-70" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Calculated Result</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{totals.totalObtainedMarks}</span>
                                <span className="text-lg opacity-70">/ {totals.totalMaxMarks}</span>
                                <span className="text-xl font-semibold ml-2">({totals.percentage}%)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-12 w-px bg-indigo-200 hidden md:block"></div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800 opacity-70 mb-1">Status</p>
                        <select
                            name="resultStatus"
                            value={totals.resultStatus}
                            onChange={(e) => setTotals({ ...totals, resultStatus: e.target.value })}
                            className={`font-bold border-2 rounded p-1 text-sm outline-none ${totals.resultStatus === 'Pass' ? 'text-green-700 border-green-300 bg-green-50' :
                                totals.resultStatus === 'Fail' ? 'text-red-700 border-red-300 bg-red-50' : 'text-yellow-700 border-yellow-300 bg-yellow-50'
                                }`}
                        >
                            <option value="Pass">PASS</option>
                            <option value="Fail">FAIL</option>
                            <option value="Promoted">PROMOTED</option>
                            <option value="Withheld">WITHHELD</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium transition shadow-sm">
                    <Save className="w-5 h-5" /> Save Marksheet
                </button>

            </div>
        </form>
    );
}