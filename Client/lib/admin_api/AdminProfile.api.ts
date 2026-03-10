import axios from "axios";
import { api } from "../api/axios";

/* ================= TYPES ================= */

export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    designation: string;
    gender: string;
    dateOfBirth: string;
    joiningDate: string;
    qualification: string;
    experienceYears: number;
    emergencyContact: string;
    bio: string;
    profileStatus: "ACTIVE" | "SUSPENDED";
}

export interface SchoolInfo {
    schoolId: string;
    schoolName: string;
    schoolCode: string;
    affiliationNumber: string;
    establishedYear: string;
    board: string;
    schoolType: string;
    website: string;
    supportEmail: string;
    schoolPhone: string;
    motto: string;
    address: string;
    totalStudents: number;
    totalTeachers: number;
}

export interface AdminProfileResponse {
    admin: AdminProfile;
    school: SchoolInfo;
}

/* ================= HELPER ================= */

const cleanPayload = (payload: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(payload).filter(
            ([_, value]) => value !== "" && value !== undefined && value !== null
        )
    );
};

/* ================= GET PROFILE ================= */

export const getAdminProfile = async (): Promise<AdminProfileResponse | null> => {
    try {
        const { data } = await api.get("/api/v1/admin/profile");
        console.log(data.data)
        return data.data;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            return null;
        }
        throw err;
    }
};

/* ================= CREATE ADMIN PROFILE ================= */

export const createAdminProfile = async (
    payload: Partial<AdminProfile>
): Promise<AdminProfile> => {

    const cleaned = cleanPayload(payload);

    const { data } = await api.post("/api/v1/admin/profile", cleaned);
    return data.data;
};

/* ================= UPDATE ADMIN PROFILE ================= */

export const updateAdminProfile = async (
    payload: Partial<AdminProfile>
): Promise<AdminProfile> => {

    const cleaned = cleanPayload(payload);

    const { data } = await api.put("/api/v1/admin/profile", cleaned);
    return data.data;
};

/* ================= CREATE SCHOOL INFO ================= */

export const createSchoolInfo = async (
    payload: Partial<SchoolInfo>
): Promise<SchoolInfo> => {

    const cleaned = cleanPayload(payload);

    const { data } = await api.post("/api/v1/admin/school", cleaned);
    return data.data;
};

/* ================= UPDATE SCHOOL INFO ================= */

export const updateSchoolInfo = async (
    payload: Partial<SchoolInfo>
): Promise<SchoolInfo> => {

    const cleaned = cleanPayload(payload);

    const { data } = await api.put("/api/v1/admin/school", cleaned);
    return data.data;
};