import type { Request, Response } from "express";
import { AdminTeacherService } from "../services/admin.teacher.crud";
import { ApiError } from "../../core/errors/ApiErrors";
import { AdminTeacherRepo } from "../../repositories/admin.teacher.repo";
export class AdminTeacherController{
  static async Create(req:Request,res:Response):Promise<void>{
    if(!req.body.data){
      throw new ApiError(400, "all field are required");
      return;
    }
      const user = await AdminTeacherService.CreateTeacher(req.body.data, req.user?.id  );
      if(user){
        res.status(201).json({
          message:"teacher created successfull",
          success:true
        });
        return;
      }


      
  };
  static async Read(req:Request, res:Response){

    const user = await AdminTeacherService.ReadAllTeacher(req.user.id);
    if(!user){
      res.status(404).json({
        message:"teacher not found",
      success:false  });

    return;
    }
    res.status(200).json({
        message:"teacher  found",
        success:true,
        teacher:user
    });

}


static async ReadByStaff_Id(req:Request, res:Response){
  const { staff_id } = req.body;

  const user = await AdminTeacherRepo.readteacherbystaff_id(staff_id);
  if(!user){
    res.status(404).json({
      success:false,
      message:"Teacher not found"
    })
    
  }
    res.status(200).json({
      message:"Teacher found",
      teacher:user
    })



    
    
  }

  static async Update(req:Request, res:Response){
    const { data:update_data, id:staff_id} = req.body;
    
    const user = await AdminTeacherService.UpdateTeacher(staff_id, update_data);
    if(!user){
      res.status(500).json({
        message:"Teacher not updated",
        success:false,
      })
    }
    res.status(200).json({
      success:true, 
      message:"Teache Updated Successfull"
    })
  }
   static async Delete(req: Request, res: Response) {
  const staff_id = req.params.id; // or req.user.id if intentional

  const user = await AdminTeacherService.DeleteTeacher(staff_id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Teacher not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Teacher deleted successfully",
  });
}
  static async ReadById(req:Request,res:Response){
    const staff_id = req.params.id;
    const user = await AdminTeacherRepo.readbyid(staff_id);

    user ? res.status(200).json({
      message:"teacher found",
      teacher:user,
      success:true
    }) : res.json({
      message:"teacher not found",
      success:false,
      teacher:[]
    })
  }
}