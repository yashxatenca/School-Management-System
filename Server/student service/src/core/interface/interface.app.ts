export type Role = "admin" | "teacher" | "student";
export interface JwtUser {
  id: string;
  email: string;
  role: Role;
  studentId?: string;
}