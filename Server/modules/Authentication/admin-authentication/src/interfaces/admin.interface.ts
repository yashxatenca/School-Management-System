export const AdminRole = {
  ADMIN: "admin",
} as const;

export type AdminRoleType = typeof AdminRole[keyof typeof AdminRole];

export interface IUser {
  googleId: string;
  name: string;
  email: string;
  photoURL?: string;
  role: AdminRoleType;
  authProvider: "google" | "email";
  isActive: boolean;
}
export interface JwtUser {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}
