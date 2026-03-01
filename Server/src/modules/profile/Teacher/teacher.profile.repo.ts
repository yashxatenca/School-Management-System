import TeacherProfileModel from "./teacher.profile.model";
import { ITeacherProfile } from "./teacher.profile.interface";
import { Types } from "mongoose";

class TeacherProfileRepository {

  async create(data: Partial<ITeacherProfile>): Promise<ITeacherProfile> {
    return await TeacherProfileModel.create(data);
  }

  async findByAuthId(authId: Types.ObjectId): Promise<ITeacherProfile | null> {
    let user = await TeacherProfileModel.findOne({authId:authId})
    console.log(user)
    return user;
  }

  async updateByAuthId(
    authId: Types.ObjectId,
    updateData: Partial<ITeacherProfile>
  ): Promise<ITeacherProfile | null> {
    return await TeacherProfileModel.findOneAndUpdate(
      { authId },
      updateData,
      { new: true }
    );
  }
}

export default new TeacherProfileRepository();