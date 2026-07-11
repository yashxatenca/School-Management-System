// types/student.ts
export interface Teacher {
  _id: string;
  name: string;
  teacher_id: string;
  email: string;
  role: string;
}

export interface ClassDetails {
  _id: string;
  name: string;
  section: string;
  academicYear: string;
  isActive: boolean;
}

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  teacherId: Teacher;
  classId: ClassDetails;
  principalId: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}
