import axios from "axios";
import { api } from "../../api/axios"; // Adjust path as per your folder structure
import {
  AdminProfileResponse,
  AdminProfile,
} from "@/interface/Admin/admin.profile.interface";
import { SchoolInfo } from "@/interface/Global/school.interface";

/* ================= HELPER ================= */

// Removes empty strings, undefined, and null values before sending to the backend
const cleanPayload = (payload: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );
};

/* ================= ADMIN PROFILE APIS ================= */

export const getAdminProfile =
  async (): Promise<AdminProfileResponse | null> => {
    try {
      const { data } = await api.get("/api/v1/admin/profile");
      return data.data; // Assuming backend sends { data: { ...profileData } }
    } catch (err) {
      // If profile doesn't exist, return null so our React Query knows it needs to "create" later
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  };

export const createAdminProfile = async (
  payload: Partial<AdminProfile>,
): Promise<AdminProfile> => {
  const cleaned = cleanPayload(payload);
  const { data } = await api.post("/api/v1/admin/profile", cleaned);
  return data.data;
};

export const updateAdminProfile = async (
  payload: Partial<AdminProfile>,
): Promise<AdminProfile> => {
  const cleaned = cleanPayload(payload);
  const { data } = await api.put("/api/v1/admin/profile", cleaned);
  return data.data;
};

/* ================= SCHOOL INFO APIS ================= */

export const getSchoolInfo = async (): Promise<SchoolInfo> => {
  const { data } = await api.get("/api/v1/admin/school");
  return data.school; // Assuming backend sends { school: { ...schoolData } }
};

export const getschoolbyauthid = async (): Promise<SchoolInfo> => {
  const { data } = await api.get("/api/v1/admin/school/byauthid");
  return data.school;
};

export const createSchoolInfo = async (
  payload: Partial<SchoolInfo>,
): Promise<SchoolInfo> => {
  const cleaned = cleanPayload(payload);
  const { data } = await api.post("/api/v1/admin/school", cleaned);
  return data.data; // Ensure this matches your backend response
};

export const updateSchoolInfo = async (
  payload: Partial<SchoolInfo>,
): Promise<SchoolInfo> => {
  const cleaned = cleanPayload(payload);
  const { data } = await api.put("/api/v1/admin/school", cleaned);
  return data.data; // Ensure this matches your backend response
};
