import { AttendanceModel } from "../../Attendance/attendance.model";
import { AdminModel } from "../../auth/Admin/models/admin.auth.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import TeacherAuthModel from "../../auth/Teacher/models/teacher.auth.model";
import { ClassModel } from "../../Classes/global.class.model";
import examModel from "../../Exam/exam.model";
import { Homework } from "../../Homework/homework.model";
import { LeaveModel } from "../../Leave/Teacher/leave.model";
import { NoticeModel } from "../../Notice/notice.model";
import adminProfileModel from "../../profile/Admin/admin.profile.model";
import { School } from "../../school/admin.school.model";
import teacherTimetableModel from "../../Timetable/Teacher/teacher.timetable.model";

export class AdminAITools {
  // Sahi kiya: Ab ye function sahi me code ko aage badhne se rokega agar ID nahi hai
  private static checkId(studentId: string) {
    if (!studentId) {
      throw new Error("Unable to fetch document: student ID is missing");
    }
  }

  static async getMyInfo(id: string) {
    this.checkId(id);
    const user = await AdminModel.findById(id);
    if (!user) return null;
    return user;
  }
  static async getMySchoolInfo(id: string) {
    this.checkId(id);
    const school = await School.findOne({ authId: id });
    if (!school) return null;
    return school;
  }
  static async getMyProfileInfo(id: string) {
    this.checkId(id);
    const profile = await adminProfileModel.findOne({ authId: id });
    if (!profile) return null;
    return profile;
  }

  static async getTeacherInfo(id: string) {
    this.checkId(id);
    const teacher = await TeacherAuthModel.find({ principalId: id });
    if (!teacher) return null;
    return teacher;
  }
  static async getStudentInfo(id: string) {
    this.checkId(id);
    const student = await StudentAuth.find({ principalId: id });
    if (!student) return null;
    return student;
  }
  static async getAttendanceInfo(id: string) {
    this.checkId(id);
    const attendance = await AttendanceModel.find()
      .populate("studentId", "name studentId")
      .populate("class", "name section")
      .lean();
    if (!attendance) return null;
    return attendance;
  }
  static async getClassInfo(id: string) {
    this.checkId(id);
    const school = await School.findOne({ authId: id });
    if (!school) return null;
    const classes = await ClassModel.find({ schoolId: school._id });
    if (!classes) return null;
    return classes;
  }
  static async getExamSchedule(id: string) {
    this.checkId(id);
    const exams = await examModel.findOne({ principal: id });
    if (!exams) return null;
    return exams;
  }
  static async getHomeworkReport(id: string) {
    this.checkId(id);
    const homwork = await Homework.find().populate("classId", "name section");
    if (!homwork) return null;
    return Homework;
  }
  static async getLeaveReport(id: string) {
    this.checkId(id);
    const leave = await LeaveModel.find({ principalId: id });
    if (!leave) return null;
    return leave;
  }
  static async getTimetableReport(id: string) {
    this.checkId(id);
    const timetable = await teacherTimetableModel.find({ principalId: id });
    if (!timetable) return null;
    return timetable;
  }
  static async getNoticeInfo(id: string) {
    this.checkId(id);
    const notice = await NoticeModel.findOne();
    if (!notice) return null;
    return notice;
  }
}
