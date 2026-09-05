import { Application } from "express";
import teacherauthroute from "../../modules/auth/Teacher/route/teacher.auth.routes";
import teacherprofileRoute from "../../modules/profile/Teacher/teacher.profile.route";
import teacherhelperroute from "../../modules/Helper/Teacher/teacher.helper.route";
import teacherhomeworkroute from "../../modules/Homework/Teacher/teacher.homework.route";
import teacherclassroute from "../../modules/Classes/Teacher/class.teacher.route";
import teachersubjectroute from "../../modules/Subjects/Teacher/subject.teacher.route";
import teacherclasssubjectassignrouter from "../../modules/class-assign/Teacher/class-assign.teacher.route";
import teacherexamroute from "../../modules/Exam/Teacher/teacher.exam.route";
import teachermarkroute from "../../modules/Marks/Teacher/teacher.marks.route";
import teachernoticeroute from "../../modules/Notice/Teacher/notice.teacher.route";
import { TeacherTimetableRoutes } from "../../modules/Timetable/Teacher/Teacher/teacher.timetable.route";
import TeacherStudentResult from "../../modules/Result/Teacher/teacher.result.route";
import TeacherLeaveRoute from "../../modules/Leave/Teacher/leave.route";
import TeacherProfileRoute from "../../modules/profile/Teacher/teacher.profile.route";
import TeacherAttendanceRoute from "../../modules/Attendance/Teacher/teacher.attendance.route";

import TeacherChatBotRoute from "../../modules/AritficialIntelligence/Teacher/ai.route";
// register route function
export const registerteacherroute = (app: Application) => {
  app.use("/api/v1/auth/teacher", teacherauthroute);
  app.use("/api/v1/teacher/profile", teacherprofileRoute);
  app.use("/api/v1/teacher/helper", teacherhelperroute);
  app.use("/api/v1/teacher/homework", teacherhomeworkroute);
  app.use("/api/v1/teacher/class", teacherclassroute);
  app.use("/api/v1/teacher/subject", teachersubjectroute);
  app.use(
    "/api/v1/teacher/assign-class-subject/",
    teacherclasssubjectassignrouter,
  );
  app.use("/api/v1/teacher/exams/", teacherexamroute);
  app.use("/api/v1/teacher/marks/", teachermarkroute);
  app.use("/api/v1/teacher/notice/", teachernoticeroute);
  app.use("/api/v1/teacher/timetable/", TeacherTimetableRoutes);
  app.use("/api/v1/teacher/result/", TeacherStudentResult);
  app.use("/api/v1/teacher/leave/", TeacherLeaveRoute);
  app.use("/api/v1/teachre/profile", TeacherProfileRoute);
  app.use("/api/v1/teacher/attendance/", TeacherAttendanceRoute);
  app.use("/api/v1/teacher/chatbot/", TeacherChatBotRoute);
};
