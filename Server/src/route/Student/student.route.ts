import { Application } from "express";
import studentAuthRoute from "../../modules/auth/Student/route/student.auth.route";
import studentAttendanceRoute from "../../modules/Attendance/Student/attendance.route";
export const registerstudentroute = (app: Application) => {
  app.use("/api/v1/auth/student", studentAuthRoute);
  app.use("/api/v1/student/attendance/", studentAttendanceRoute);
};
