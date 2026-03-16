import { Application } from "express";
import subjectRoute from "../../modules/Subjects/Admin/subject.admin.route";
import adminRoutes from '../../modules/auth/Admin/route/admin.auth.route';
import adminprofileRoute from '../../modules/profile/Admin/admin.profile.route'
import adminschoolroute from '../../modules/school/Admin/admin.school.route'
import adminclassroute from '../../modules/Classes/Admin/class.admin.route'

// fucntion for initializing the routes
export const registeradminroute = (app: Application) => {
    app.use('/api/v1/admin/subject', subjectRoute);
    app.use("/api/v1/auth/admin", adminRoutes);
    app.use("/api/v1/admin/profile", adminprofileRoute);
    app.use("/api/v1/admin/school", adminschoolroute);
    app.use("/api/v1/admin/class", adminclassroute)
}   