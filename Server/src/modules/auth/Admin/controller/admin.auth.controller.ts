import { verifyGoogleToken } from "../../../../config/auth.config";
import { AdminRepo } from "../repository/admin.auth.repo";
import { ApiError } from "../../../../core/errors/ApiErrors";
import { Token } from "../../../../core/utils/user.token";
import { AdminRole } from "../interface/admin.interface";
import profileservice from "../../../profile/Admin/admin.profile.service";
import { SchoolRepo } from "../../../school/Admin/admin.school.repo";

export class AdminAuthService {
  static async createAndLoginUser(googletoken: string) {
    console.log(googletoken);
    // 1️⃣ Token check
    if (!googletoken) {
      throw new ApiError(401, "Firebase token required");
    }

    // 2️⃣ Verify Google/Firebase token
    const decoded = await verifyGoogleToken(googletoken);
    console.log(decoded);

    // 3️⃣ Mandatory fields validation
    if (!decoded.googleId) {
      throw new ApiError(400, "Google ID missing in token");
    }

    if (!decoded.email) {
      throw new ApiError(400, "Email not found in Firebase token");
    }

    if (!decoded.name) {
      throw new ApiError(400, "Name not found in Firebase token");
    }

    // 4️⃣ Find existing admin
    let user = await AdminRepo.findwithemail(decoded.email);

    // 5️⃣ Naya user banayein (DB Schema isVerified: false default set kar lega)
    if (!user) {
      user = await AdminRepo.createuser({
        googleId: decoded.googleId,
        email: decoded.email,
        name: decoded.name,
        photoURL: decoded.picture ?? "",
        isActive: true,
        role: AdminRole.ADMIN,
        authProvider: "google",
      });

      await profileservice.createProfile(user._id.toString());
      await SchoolRepo.createSchool(user._id.toString());

      // Naye user ka login block karo aur verification message bhej do
      throw new ApiError(403, "First contact admin to verify");
    }

    // 6️⃣ Existing user verification check
    if (!user.verified) {
      throw new ApiError(403, "First contact admin to verify");
    }

    // 7️⃣ Sirf verified user ke liye Token banega (Saare required keys ke saath)
    const jwtToken = Token.createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 8️⃣ Return full payload
    return {
      user,
      token: jwtToken,
    };
  }

  static async GetUser(id: string) {
    if (!id) {
      throw new ApiError(400, "id not found");
    }

    const user = await AdminRepo.findwithid(id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    return user;
  }

  // Logout user
  static async LogoutUser(id: string) {
    if (!id) {
      throw new ApiError(400, "Unauthorized");
    }
    const user = await AdminRepo.findwithid(id);
    if (!user) {
      return false;
    }
    return true;
  }
}
