export interface Teacher {
  _id?: string;            // MongoDB ID
  teacher_id: string;      // Backend field (IMPORTANT: staff_id → teacher_id)
  name: string;
  email: string;
  password?: string;       // optional because select:false in backend

  role?: "teacher" | "admin" | string;

  createdAt?: string;
  updatedAt?: string;
}