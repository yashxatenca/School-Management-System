import { Types } from "mongoose";
export interface ISchoolProfile {
  authId: Types.ObjectId | string;
  schoolId?: string;
  schoolName?: string;
  schoolCode?: string;
  affiliationNumber?: string;
  establishedYear?: string;
  board?: string;
  schoolType?: string;
  website?: string;
  schoolEmail?: string;
  supportEmail?: string;
  schoolPhone?: string;
  motto?: string;
  address?: string;
  principalName?: string;
  totalStudents?: number;
  totalTeachers?: number;
}
