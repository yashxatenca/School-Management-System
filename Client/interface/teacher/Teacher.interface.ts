export interface Teacher {
  _id?: string; // MongoDB ID often useful
  staff_id: string;
  name: string;
  email: string;
  contact: string;
  dateOfBirth: Date | string; // Allow string for easier handling of API responses
  gender?: "male" | "female" | "other" | string;
  
  password?: string; // optional because select:false
  role?: string;
  
  // Optional timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Response types for better type safety
export interface TeachersResponse {
  teachers: Teacher[];
}

export interface SingleTeacherResponse {
  teacher: Teacher;
}

export interface TeacherProfile{
  name?:string;
  subject?:string,
  image?:string;
}