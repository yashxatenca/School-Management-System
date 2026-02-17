import { StudentAuthService } from "../services/student.auth.service";
import { Request, Response } from "express";
import {AppError} from "../../core/errors/AppError";
import { Token} from '../../core/utils/Token.auth'
export class AuthControllerStudent{

    private static service = new StudentAuthService();

    static async Login(req: Request, res: Response){
        try {
            const {studentId, password} = req.body;
            const student = await AuthControllerStudent.service.Login(studentId, password);
            if(!student) throw new AppError("Invalid Credentials", 401);
            const token = await Token.createToken({
                id: student._id,
                studentId: student.studentId,
                email: student.email,
                role: "student",
            })

        res.status(201).cookie("student_token", token).json({
        message: "Student logged in successfully",
        student,
        success:true,
      });
    } catch (err: any) {
        console.log(err)
      res.status(400).json({ error: err.message });
    }
    }


}