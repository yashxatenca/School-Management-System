import { Teacher_Model } from "../models/admin.teacher.model";

export class Teacherauthrepo{
    static async findbyemail(email:string){
        return await Teacher_Model.findOne({email:email}).select("+password");

    }

    static async findby_id(id:string){
        return await Teacher_Model.findById(id)

    }

    static async findbystaff_id(staff_id:string){
        return await Teacher_Model.findOne({staff_id})
    }

}

