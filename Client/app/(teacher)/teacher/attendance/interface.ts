export interface Student {
    _id: string; // Maps to studentId (ObjectId) in backend
    rollNo: string;
    name: string;
    status: "Present" | "Absent" | "Late";
    remarks: string; // Added to match your schema's remarks field
}