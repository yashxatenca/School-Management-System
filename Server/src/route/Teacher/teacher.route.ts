import { Application } from "express";
import teacherauthroute from '../../modules/auth/Teacher/route/teacher.auth.routes'
import teacherprofileRoute from '../../modules/profile/Teacher/teacher.profile.route';
import TeacherAttendanceRoute from '../../modules/Attendance/Teacher/teacher.attendance.route'
export const registerteacherroute = (app: Application) => {
    app.use("/api/v1/auth/teacher", teacherauthroute);
    app.use("/api/v1/teacher/profile", teacherprofileRoute);
    app.use('/api/v1/teacher/attendance', TeacherAttendanceRoute)
}