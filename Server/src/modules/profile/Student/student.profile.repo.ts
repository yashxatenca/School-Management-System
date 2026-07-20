import { ObjectId } from "mongoose";
import StudentProfile, { IStudentProfile } from "./student.profile.model";
class StudentProfileRepository {
  async createProfile(user: any) {
    await StudentProfile.create({ student_id: user._id });
  }
  // Upsert: Find and Update, OR Create if not found
  async updateProfile(
    studentId: string,
    profileData: Partial<IStudentProfile>,
  ) {
    return await StudentProfile.findOneAndUpdate(
      { student_id: studentId }, // Jiske base par search karna hai
      { $set: profileData }, // Jo data update karna hai
      {
        new: true, // Update hone ke baad naya data return kare
        runValidators: true, // Schema validation zaroor run kare
      },
    );
  }

  // Get Profile
  async getProfileByStudentId(studentId: string) {
    return await StudentProfile.findOne({ student_id: studentId });
  }
}

export default new StudentProfileRepository();
