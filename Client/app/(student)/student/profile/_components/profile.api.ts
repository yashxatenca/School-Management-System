import { api } from "@/api/axios";
export interface StudentProfileData {
  student_id: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  contact?: string; // Emergency Contact
}

export const fetchProfileApi = async (
  studentId: string,
): Promise<StudentProfileData> => {
  return await api.get(`/api/v1/student/profile/${studentId}`);
};

export const upsertProfileApi = async (
  studentId: string,
  profileData: Partial<StudentProfileData>,
) => {
  return await api.put(`/api/v1/student/profile/${studentId}`, profileData);
};
