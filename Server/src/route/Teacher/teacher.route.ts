import { Application } from "express";
import teacherauthroute from '../../modules/auth/Teacher/route/teacher.auth.routes'
import teacherprofileRoute from '../../modules/profile/Teacher/teacher.profile.route';
import TeacherAttendanceRoute from '../../modules/Attendance/Teacher/teacher.attendance.route'
import teacherhelperroute from '../../modules/Helper/Teacher/teacher.helper.route';
import teacherhomeworkroute from '../../modules/Homework/Teacher/teacher.homework.route'
import teacherclassroute from '../../modules/Classes/Teacher/class.teacher.route';
import teachersubjectroute from '../../modules/Subjects/Teacher/subject.teacher.route'
import teacherclasssubjectassignrouter from '../../modules/class-assign/Teacher/class-assign.teacher.route'
export const registerteacherroute = (app: Application) => {
    app.use("/api/v1/auth/teacher", teacherauthroute);
    app.use("/api/v1/teacher/profile", teacherprofileRoute);
    app.use('/api/v1/teacher/attendance', TeacherAttendanceRoute);
    app.use('/api/v1/teacher/helper', teacherhelperroute);
    app.use('/api/v1/teacher/homework', teacherhomeworkroute);
    app.use('/api/v1/teacher/class', teacherclassroute);
    app.use('/api/v1/teacher/subject', teachersubjectroute)
    app.use("/api/v1/teacher/assign-class-subject/", teacherclasssubjectassignrouter)
}