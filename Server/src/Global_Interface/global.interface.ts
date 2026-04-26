export interface JwtUser {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  studentId?: number;
  principalId?: string;
}
