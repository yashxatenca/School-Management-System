import { SchoolInfo } from "@/interface/Global/school.interface";
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

export interface AdminProfileResponse {
    admin: AdminProfile;
    school: SchoolInfo;
}