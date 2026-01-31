import { Teacher , CreateTeacherDTO} from "../interfaces/admin.interface";
import { Teacher_Model
 } from "../models/admin.teacher.model";

export class AdminTeacherRepo {
    static async addteacher(data:CreateTeacherDTO){
        return await Teacher_Model.create(data);
    }

    static async deleteteacher(id:string){
        return await Teacher_Model.findByIdAndDelete(id);
    }
    
static async updateteacher(staff_id: string, data: Object) {
  return await Teacher_Model.findOneAndUpdate(
    { staff_id },
    { $set: data },   // 🔥 IMPORTANT
    { new: true }
  );
}

    static async readteacher(principalId:string){
        return await Teacher_Model.find({principalId:principalId});
    }

 static async readteacherbystaff_id(staff_id: string) {
    try {
        const user = await Teacher_Model.findOne({ staff_id });
        

        // If user is found, return true. If null, return false.
        return !!user; 
    } catch (error) {
        // Throw the error so the controller can handle the 500 status
        throw new Error("Error querying teacher existence");
    }
}
    static async  checkstaffbyemail(email:string){
        return await Teacher_Model.findOne({email});
    }


    static async checkstaff(staff_id:string){
        return await Teacher_Model.findOne({staff_id})

    }

    static async readbyid(staff_id:string){
        return await Teacher_Model.findOne({staff_id})

    }

}