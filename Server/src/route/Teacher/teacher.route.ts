import { Application } from "express";
import teacherauthroute from '../../modules/auth/Teacher/route/teacher.auth.routes'
import teacherprofileRoute from '../../modules/profile/Teacher/teacher.profile.route'
export const registerteacherroute = (app: Application) => {
    app.use("/api/v1/auth/teacher", teacherauthroute);
    app.use("/api/v1/teacher/profile", teacherprofileRoute);


}