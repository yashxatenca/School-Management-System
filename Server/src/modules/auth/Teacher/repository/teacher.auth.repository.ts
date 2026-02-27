import TeacherAuthModel from "../models/teacher.auth.model";
import { TeacherSchema } from "../interface/teacher.auth.interface";

export class TeacherRepository {

  async create(data: Partial<TeacherSchema>) {
    const user = await TeacherAuthModel.create(data);
    console.log("Created teacher:", user);
    return user;
  }

  async findById(id: string) {
    return await TeacherAuthModel.findById(id);
  }

  async findByEmail(email: string) {
    return await TeacherAuthModel
      .findOne({ email })
      .select("+password");
  }

  async update(id: string, data: Partial<TeacherSchema>) {
    return await TeacherAuthModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id: string) {
    return await TeacherAuthModel.findByIdAndDelete(id);
  }

  async findAll(id:string){
    return await TeacherAuthModel.find({principalId:id});
  }
}