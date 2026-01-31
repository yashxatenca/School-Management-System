export type AdminUser =  {
    _id: string;
  name: string;
  email: string;
  role: "admin";
  authProvider: "google" | "email";
  googleId?: string;
  photoURL?: string;
  isActive: boolean;
}

export type TeacherUser = {
  _id:string;
  name:string;
  email:string;
  role:"teacher";
}

