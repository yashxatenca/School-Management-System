export interface CreateStudentDTO {
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  rollNumber: number;
  classId: string;
  sectionId: string;
}

export interface UpdateStudentDTO {
  fullName?: string;
  gender?: "male" | "female" | "other";
  rollNumber?: number;
  classId?: string;
  sectionId?: string;
}
