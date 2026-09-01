import studentProfileModel from "../../profile/Student/student.profile.model";
import { AttendanceModel } from "../../Attendance/attendance.model";
import marksModel from "../../Marks/marks.model";
import examModel from "../../Exam/exam.model";
import { Homework } from "../../Homework/homework.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { LeaveModel } from "../../Leave/Student/leave.model";
import timetableModel from "../../Timetable/Student/timetable.model";
import { NoticeModel } from "../../Notice/notice.model";
import { ClassSubjectAssign } from "../../class-assign/class-subject-assign.model";
import { School } from "../../school/admin.school.model";

export class StudentAITools {
  // Sahi kiya: Ab ye function sahi me code ko aage badhne se rokega agar ID nahi hai
  private static checkId(studentId: string) {
    if (!studentId) {
      throw new Error("Unable to fetch document: student ID is missing");
    }
  }

  static async getMyInfo(studentId: string) {
    this.checkId(studentId);

    return StudentAuth.findOne({ _id: studentId })
      .populate("teacherId", "name email") // Replace with actual fields you need
      .populate("classId", "className grade")
      .populate("principalId", "name")
      .lean();
  }

  static async getMyProfile(studentId: string) {
    this.checkId(studentId);
    return await studentProfileModel.findOne({ student_id: studentId });
  }

  static async getMyAttendance(studentId: string) {
    this.checkId(studentId);

    // 1. Calculate the date exactly 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Fetch records matching the studentId AND within the last 30 days
    return await AttendanceModel.find({
      studentId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });
  }

  static async getMyMarks(studentId: string) {
    this.checkId(studentId);
    const user = await marksModel.findOne({ studentId });
    if (!user) return "No marks found";
    return user;
  }

  static async getMyExams(studentId: string) {
    this.checkId(studentId);
    const exam = await examModel.find();
    if (!exam || exam.length === 0) return "No exam found";
    return exam;
  }

  static async getMyHomework(studentId: string) {
    this.checkId(studentId);
    const student = await StudentAuth.findOne({ _id: studentId });
    if (!student) return "Student auth record not found";

    const homework = await Homework.find({ classId: student.classId });
    if (!homework || homework.length === 0) return "Homework not found";
    return homework;
  }

  static async getLeaveStatus(studentId: string) {
    this.checkId(studentId);
    const status = await LeaveModel.find({ studentId }); // Sahi kiya: findOne se saari leaves nahi dikhtin, isliye find use kiya
    if (!status || status.length === 0) return "Leave applications not found";
    return status;
  }

  static async getmytimetable(studentId: string) {
    this.checkId(studentId);
    const student = await StudentAuth.findOne({ _id: studentId });
    if (!student) return "Student auth record not found";

    const timetable = await timetableModel.findOne({
      classId: student.classId,
    });
    if (!timetable) return "Timetable not found"; // Sahi kiya: Pehle yahan Homework likha tha
    return timetable;
  }

  static async getMyNotice(studentId: string) {
    this.checkId(studentId);
    const student = await StudentAuth.findOne({ _id: studentId });
    if (!student) return "Student auth record not found";

    const notice = await NoticeModel.find({ classId: student.classId });
    if (!notice || notice.length === 0) return "Notice not found";
    return notice;
  }

  static async getMySubject(studentId: string) {
    this.checkId(studentId);
    const student = await StudentAuth.findOne({ _id: studentId });
    if (!student) return "Student auth record not found";

    const subject = await ClassSubjectAssign.findOne({
      classId: student.classId,
    })
      .populate("subjectId", "name code")
      .exec();
    if (!subject) return "Subject Not Found";
    return subject;
  }

  static async getClassInfo(studentId: string) {
    this.checkId(studentId);
    const student = await StudentAuth.findOne({ _id: studentId }).populate(
      "classId",
    );
    if (!student) return "Student auth record not found";
    return student.classId;
  }

  static async getSchoolInfo(studentId: string) {
    this.checkId(studentId);
    const std = await StudentAuth.findOne({ _id: studentId });
    if (!std) return "School not found";

    const school = await School.findOne({ authId: std.principalId });
    if (!school) return "School not found";
    return school;
  }
}
