import repository from "./admin.profile.repo";
import { IAdminProfile } from "./admin.profile.interface";
import { Types } from "mongoose";

class AdminProfileService {

    async createProfile(
        id: string,
    ) {

        const existing = await repository.findByAuthId(
            new Types.ObjectId(id)
        );

        if (existing) {
            return false;
        }

        const user = await repository.create(id);
        return user ? true : false;

    }

    async getProfile(id: string) {
        const profile = await repository.findByAuthId(
            new Types.ObjectId(id)
        );

        if (!profile) {
            throw new Error("Profile not found");
        }

        return profile;
    }

    async updateProfile(
        id: string,
        body: Partial<IAdminProfile>
    ) {
        return await repository.updateByAuthId(
            new Types.ObjectId(id),
            body
        );
    }
}

export default new AdminProfileService();
