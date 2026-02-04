import { Request, Response } from "express";
import { ApiError } from "../../core/errors/ApiErrors";
import { Token } from "../../core/utils/user.token";
import {Teacherauthenticationservice} from "../services/auth.teacher.service";

export class Authteachercontroller {
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(402, "Email and password are required");
      }


      
      const user = await Teacherauthenticationservice.checkpasswordandreturnuser(email, password);

      if (!user) {
        throw new  ApiError(400, "Invalid email or password");
      }
      const token = Token.createToken({
        email:user.email,
        id:user._id,
        role:user.role,
      })

      // ✅ Success response (JWT later)
      return res.cookie("teachertoken", token).status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error"
      });
    }
  }


  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  static async GetUser(req:Request, res:Response){

   
    const id = req.user.id;
    
    
    if(req.user.role != 'teacher') {
      throw new ApiError(402, "Not a valid user")

    }
    const user =  await Teacherauthenticationservice.getuserbyid(id);
  
    if(user === null)
      res.status(403).json({
    message:"user not found",
    success:false,
  
  })

  res.status(200).json({
    message:"user found",
    success:true,
    user
  })

  }




  //??>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  static async logout(req:Request, res:Response){
    const id = req.user.id;
    if(!id) throw new ApiError(402, "Id not found");
    res.clearCookie('teachertoken').status(200).json({
      message:"logout successfull",
      success:true
    })
    

  }
}

export default Authteachercontroller;
