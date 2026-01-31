import { verifyGoogleToken } from "../../config/auth.config";
import { AdminRepo } from "../../repositories/admin.repo";
import { ApiError } from "../../core/errors/ApiErrors";
import { Token } from "../../core/utils/user.token";
import { AdminRole } from "../../interfaces/admin.interface";

export class AdminAuthService {
  static async createAndLoginUser(googletoken: string) {
   
    // 1️⃣ Token check
    if (!googletoken) {
      throw new ApiError(401, "Firebase token required");
    }

    // 2️⃣ Verify Google/Firebase token
    const decoded = await verifyGoogleToken(googletoken);
    console.log(decoded)

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

    // 5️⃣ Create admin if not exists
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
    }

    // 6️⃣ Create backend JWT
    const jwtToken = Token.createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 7️⃣ Return result
    return {
      user,
      token: jwtToken,
    };
  }


  static async GetUser(id:string){
    if(!id){
      throw new ApiError(400, "id not found")
    }

    const user = await AdminRepo.findwithid(id);
    if(!user){
      throw new ApiError(400, "User not found");
    }
    return user;
  }
  // logout user 

  static async LogoutUser(id:string){
    if(!id){
      throw new ApiError(400, "Unauthrized")
    }
    const user = await AdminRepo.findwithid(id)
    if(!user){
      return false;
    }
    return true;
  }
}
