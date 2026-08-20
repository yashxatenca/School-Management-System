import { Request, Response } from "express";
import profileService from "./student.profile.service";

class StudentProfileController {
  // Handle UPDATE
  async updateProfile(req: Request, res: Response) {
    try {
      const { student_id } = req.params;
      const profileData = req.body;

      const updatedProfile = await profileService.updateProfile(
        student_id as string,
        profileData,
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error: any) {
      // Agar document nahi mila hoga toh 404 bhejo
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Handle GET
  async getProfile(req: Request, res: Response) {
    try {
      const { student_id } = req.params;

      const profile = await profileService.fetchProfile(student_id as string);
      console.log(profile);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

export default new StudentProfileController();
