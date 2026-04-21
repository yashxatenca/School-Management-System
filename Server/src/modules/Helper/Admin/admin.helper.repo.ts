import { ApiError } from "../../../core/errors/ApiErrors";
import { ClassModel } from "../../Classes/global.class.model";
import { ClassAssignmentModel } from "../../AssignClass/assignclass.model";
import { StudentAuth } from '../../auth/Student/models/student.auth.model'
export class AdminHelperRepo {
    static async findTeacherStudentwithClass(id: string) {
        if (!id) throw new ApiError(402, "Details are Required");
        const students = await StudentAuth.find({ classId: id }).populate("classId", "name section").populate("teacherId", "name").exec();
        return students;
    }

}

AdminHelperRepo.findTeacherStudentwithClass("69e7aef5b0ff9b72ebaa5571")
export default AdminHelperRepo;
