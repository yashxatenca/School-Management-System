import axios from "axios";
import { api } from "../api/axios";
import { AdminProfileResponse, AdminProfile } from "@/interface/Admin/admin.profile.interface";
import { SchoolInfo } from "@/interface/Global/school.interface";

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



/* ================= UPDATE SCHOOL INFO ================= */

export const updateSchoolInfo = async (
    payload: Partial<SchoolInfo>
): Promise<SchoolInfo> => {

    const cleaned = cleanPayload(payload);

    const { data } = await api.put("/api/v1/admin/school", cleaned);
    return data.data;
};

export const getSchoolInfo = async (): Promise<SchoolInfo> => {

    const { data } = await api.get("/api/v1/admin/school");
    return data.school;
};
export const getschoolbyauthid = async (): Promise<SchoolInfo> => {

    const { data } = await api.get("/api/v1/admin/school/byauthid");

    return data.school;
};