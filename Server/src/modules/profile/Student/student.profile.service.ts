import profileRepository from "./student.profile.repo";

class StudentProfileService {
  async updateProfile(studentId: string, profileData: any) {
    if (!studentId) {
      throw new Error("Student ID is required");
    }

    const updatedProfile = await profileRepository.updateProfile(
      studentId,
      profileData,
    );

    // Agar profile exist nahi karti toh error throw karo
    if (!updatedProfile) {
      throw new Error("Profile record not found. Please contact admin.");
    }

    return updatedProfile;
  }

  async fetchProfile(studentId: string) {
    if (!studentId) {
      throw new Error("Student ID is required");
    }

    const profile = await profileRepository.getProfileByStudentId(studentId);

    if (!profile) {
      throw new Error("Profile record not found.");
    }

    return profile;
  }
}

export default new StudentProfileService();
