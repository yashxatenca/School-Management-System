import { Application } from "express";
import studentAuthRoute from "../../modules/auth/Student/route/student.auth.route";
export const registerstudentroute = (app: Application) => {
  app.use("/api/v1/auth/student", studentAuthRoute);
};
