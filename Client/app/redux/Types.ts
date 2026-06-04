export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin";
  authProvider: "google" | "email";
  googleId?: string;
  photoURL?: string;
  isActive: boolean;
};

export type TeacherUser = {
  _id: string;
  name: string;
  email: string;
  role: "teacher";
};

export type StudentUser = {
  _id: string;
  studentId: string;
  fullName: string;
  email: string;
  gender: "male" | "female" | "other";
  rollNumber: number;
  classId: string;
  sectionId: string;
  role: "student";

  // Editable fields
  dob?: string;
  bloodGroup?: string;
  studentPhone?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  address?: string;
};
