export interface IClass {
    _id?: string;
    name: string;
    section: string;
    schoolId: string;
    subjects?: string[];
    academicYear: string;
    strength: number;
    isActive: boolean;
}