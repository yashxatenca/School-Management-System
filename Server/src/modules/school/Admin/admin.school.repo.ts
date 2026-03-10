import { School } from "./admin.school.model";
import { ISchoolProfile } from "../school.global.interface";
import mongoose, { Types } from 'mongoose'

class SchoolRepo {
    static async createSchool(id: string) {
        let user = await School.create({
            authId: new mongoose.Types.ObjectId(id)
        });
        return user ? true : false;
    }

    static async getSchool(id: string) {
        return await School.findOne({ authId: new mongoose.Types.ObjectId(id) })
    }

    static async updateSchool(id: string, data: Partial<ISchoolProfile>) {
        const cleaned = Object.fromEntries(
            Object.entries(data).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return await School.findOneAndUpdate({
            authId: new mongoose.Types.ObjectId(id)
        },
            { $set: cleaned },
            {
                returnDocument: "after",
                runValidators: true
            }


        )

    }
}

export default new SchoolRepo();