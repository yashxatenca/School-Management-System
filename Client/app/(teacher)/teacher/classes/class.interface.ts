// 📝 src/types/class.ts

export interface Student {
    _id: string;
    rollNumber: string;
    name: string;
    gender: "Male" | "Female";
    attendanceToday: "Present" | "Absent" | "Late" | "Not Marked";
}

export interface SubjectTeacher {
    subject: string;
    teacherName: string;
}

export interface ClassDetails {
    _id: string;
    className: string;
    section: string;
    classTeacher: string;
    totalStudents: number;
    subjectTeachers: SubjectTeacher[];
    academicYear?: string;
}