import {
    AdminSchoolService
} from './admin.school.service';
import type { Request, Response } from 'express';

export class AdminSchoolController {

    static async GetSchoolDetail(req: Request, res: Response) {
        try {
            const id = req.user?.id as string;
            const school = await AdminSchoolService.GetSchoolDetails(id);
            res.status(200).json({
                success: true,
                message: "School Detail",
                school
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error
            })

        }

    }

    static async UpdateSchoolProfile(req: Request, res: Response) {
        try {
            const id = req.user?.id as string;
            const school = await AdminSchoolService.UpdateSchoolProfile(id, req.body);
            res.status(200).json({
                success: true,
                message: "School Profile Updated",
                school
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error
            })

        }

    }

    static async GetSchoolbyauthid(req: Request, res: Response) {
        try {
            const id = req.user?.id as string;
            const school = await AdminSchoolService.GetSchoolbyauthid(id);
            res.status(200).json({
                success: true,
                message: "School Detail",
                school
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error
            })

        }

    }

}
