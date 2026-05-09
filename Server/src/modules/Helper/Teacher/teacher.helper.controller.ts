import { Request, Response } from 'express'
import { TeacherHelperService } from './teacher.helper.service';


export class TeacherHelperController {
    static async GetClassAndCount(req: Request, res: Response) {

        const Data = await TeacherHelperService.getClassandStudentCountService(req?.params?.teacherId as string)
        return res.json({ message: "data fetched", data: Data })
    }
}