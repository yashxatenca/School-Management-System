import { Types } from "mongoose";
export interface SchoolInfo {
  authId: Types.ObjectId;
  schoolId?: string;
  schoolName?: string;
  schoolCode?: string;
  affiliationNumber?: string;
  establishedYear?: string;
  board?: string;
  schoolType?: string;
  website?: string;
  supportEmail?: string;
  schoolPhone?: string;
  motto?: string;
  address?: string;
  totalStudents?: number;
  totalTeachers?: number;
}