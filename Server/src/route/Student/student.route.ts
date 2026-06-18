import { Application } from "express";
import studentAuthRoute from "../../modules/auth/Student/route/student.auth.route";
import studentAttendanceRoute from "../../modules/Attendance/Student/attendance.route";
import studentAssignmentRoute from "../../modules/Homework/Student/student.route";
import studentexamroute from "../../modules/Exam/Student/exam.route";
import studentResultRoute from "../../modules/Marks/Student/student.marks.route";
export const registerstudentroute = (app: Application) => {
  app.use("/api/v1/auth/student", studentAuthRoute);
  app.use("/api/v1/student/assignment", studentAssignmentRoute);
  app.use("/api/v1/student/attendance/", studentAttendanceRoute);
  app.use("/api/v1/student/result/", studentResultRoute);
  app.use("/api/v1/student/exams", studentexamroute);
};
