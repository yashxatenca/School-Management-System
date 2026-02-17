import {StudentDocument} from '../core/interface/Database.interface';
import StudentModel from '../models/info.student.model';
export class StudentAuthRepository{

     async findbyemail(email:String):Promise<StudentDocument | null>{
        return await StudentModel.findOne({email:email});
    
    }

     async findbystudentid(studentid:String):Promise<StudentDocument | null>{
        return await StudentModel.findOne({studentId:studentid});
    }

    async findby_id(id:String):Promise<StudentDocument | null>{
        return await StudentModel.findById(id);
    }

    async comparePassword(studentId:string, password:string):Promise<boolean>{
        const student = await StudentModel.findOne({studentId:studentId}).select("+password");
        if(!student) return false;
        return await student.comparePassword(password);
    
    }


}