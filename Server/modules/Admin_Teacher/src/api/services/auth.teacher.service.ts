import { ApiError } from "../../core/errors/ApiErrors";
import bcrypt from 'bcrypt'
import { Teacherauthrepo } from "../../repositories/teacher.auth.repo";
export class Teacherauthenticationservice{

    static async checkpasswordandreturnuser(email:string, password:string){
        if(!email || !password) throw new ApiError(402, "user passowrd required");
        const user = await Teacherauthrepo.findbyemail(email);
        if(!user) throw new ApiError(403, "user not found");
       const ispassowrd = await bcrypt.compare(password, user.password);
       if(!ispassowrd) throw new ApiError(500, "invalid credentails");
       return user;
    }

    static async getuserbyid(id:string){
        if(!id) throw new ApiError(402, "id not found");
        return await Teacherauthrepo.findby_id(id);
    }

}