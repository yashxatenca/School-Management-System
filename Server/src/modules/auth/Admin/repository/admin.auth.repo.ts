import { AdminModel } from "../models/admin.auth.model";
import type { IUser } from "../interface/admin.interface";
export class AdminRepo {
    //create user by data
    static async createuser(data: IUser) {
        return AdminModel.create(data);
    }

    //check user by firebase id

    static async findwithuid(uid: string) {

        const user = await AdminModel.findOne({ uid: uid })
        return user;
    }

    static async findwithid(id: string) {
        return await AdminModel.findById(id);
    }

    // findbyemail 
    static async findwithemail(email: string) {
        return AdminModel.findOne({ email });

    }

    //delete by firebase id
    static async deletewithuid(uid: string) {
        return AdminModel.findOneAndDelete({ uid });
    }
}
