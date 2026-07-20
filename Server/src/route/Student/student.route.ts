import { Application } from "express";
import studentAuthRoute from "../../modules/auth/Student/route/student.auth.route";
import studentAssignmentRoute from "../../modules/Homework/Student/student.route";
import studentexamroute from "../../modules/Exam/Student/exam.route";
import studentResultRoute from "../../modules/Marks/Student/student.marks.route";
import StudentTimetableRoute from "../../modules/Timetable/Student/Student/student.timetable.route";
import StudentNoticeRoute from "../../modules/Notice/Student/notice.student.route";
import StudentProfileRoute from "../../modules/profile/Student/student.profile.route";
import StudentLeaveRoute from "../../modules/Leave/Student/leave.route";
export const registerstudentroute = (app: Application) => {
  app.use("/api/v1/auth/student", studentAuthRoute);
  app.use("/api/v1/student/assignment", studentAssignmentRoute);
  app.use("/api/v1/student/result/", studentResultRoute);
  app.use("/api/v1/student/exams", studentexamroute);
  app.use("/api/v1/student/timetable", StudentTimetableRoute);
  app.use("/api/v1/student/notice/", StudentNoticeRoute);
  app.use("/api/v1/student/profile", StudentProfileRoute);
  app.use("/api/v1/student/leave/", StudentLeaveRoute);
};
