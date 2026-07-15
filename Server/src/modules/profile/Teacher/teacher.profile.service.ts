import repository from "./teacher.profile.repo";
import { ITeacherProfile } from "./teacher.profile.interface";
import { Types } from "mongoose";

class TeacherProfileService {
  async createProfile(
    id: string,
    body: Partial<ITeacherProfile>,
  ): Promise<ITeacherProfile> {
    const existing = await repository.findByAuthId(new Types.ObjectId(id));

    if (existing) {
      throw new Error("Profile already exists");
    }

    return await repository.create({
      ...body,
      authId: new Types.ObjectId(id),
    });
  }

  async getProfile(id: string) {
    const profile = await repository.findByAuthId(new Types.ObjectId(id));

    // Yahan se "throw new Error" hata diya hai
    // Ab agar data nahi milega toh seedha 'null' return hoga frontend ko
    return profile;
  }

  async updateProfile(id: string, body: Partial<ITeacherProfile>) {
    return await repository.updateByAuthId(new Types.ObjectId(id), body);
  }
}

export default new TeacherProfileService();
