import AdminProfileModel from "./admin.profile.model";
import { IAdminProfile } from "./admin.profile.interface";
import { Types } from "mongoose";
import mongoose = require("mongoose");

class AdminProfileRepository {

    async create(data: string): Promise<Boolean> {
        const objectId = new mongoose.Types.ObjectId(data)

        const user = await AdminProfileModel.create({ authId: objectId });
        if (user) {
            return true;
        }
        return false;
    }

    async findByAuthId(authId: Types.ObjectId): Promise<IAdminProfile | null> {
        return await AdminProfileModel.findOne({ authId: authId });
    }

    async updateByAuthId(
        authId: Types.ObjectId,
        updateData: Partial<IAdminProfile>
    ): Promise<IAdminProfile | null> {
        const cleaned = Object.fromEntries(
            Object.entries(updateData).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );

        return AdminProfileModel.findOneAndUpdate(
            { authId },
            { $set: cleaned },
            {
                returnDocument: "after",
                runValidators: true
            }
        );
    }
}

export default new AdminProfileRepository();
