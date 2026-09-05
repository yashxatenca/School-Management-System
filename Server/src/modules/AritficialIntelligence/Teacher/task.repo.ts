import { AttendanceModel } from "../../Attendance/attendance.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import TeacherAuthModel from "../../auth/Teacher/models/teacher.auth.model";
import { ClassModel } from "../../Classes/global.class.model";
import examModel from "../../Exam/exam.model";
import { Homework } from "../../Homework/homework.model";
import { LeaveModel } from "../../Leave/Teacher/leave.model";
import marksModel from "../../Marks/marks.model";
import { NoticeModel } from "../../Notice/notice.model";
import teacherProfileModel from "../../profile/Teacher/teacher.profile.model";
import { SubjectModel } from "../../Subjects/global.subject.model";
import timetableModel from "../../Timetable/Student/timetable.model";
import teacherTimetableModel from "../../Timetable/Teacher/teacher.timetable.model";

export class TeacherAITools {
  // Only check for ID, missing ID is a server-side developer error.
  private static checkId(teacherId: string) {
    if (!teacherId) {
      throw new Error("Unable to fetch document: teacher ID is missing");
    }
  }

  static async getMyInfo(teacherId: string) {
    this.checkId(teacherId);
    return await TeacherAuthModel.findById(teacherId)
      .populate("principalId")
      .lean();
  }

  static async getMyProfile(teacherId: string) {
    this.checkId(teacherId);
    return await teacherProfileModel
      .findOne({ authId: teacherId })
      .populate("schoolId")
      .lean();
  }

  static async getMyClass(teacherId: string) {
    this.checkId(teacherId);
    return await ClassModel.findOne({ teacherId }).lean();
  }

  static async getMyStudents(teacherId: string) {
    this.checkId(teacherId);
    return await StudentAuth.find({ teacherId }).lean();
  }

  static async getMyAttendance(teacherId: string) {
    this.checkId(teacherId);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await AttendanceModel.find({
      markedBy: teacherId,
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }).lean();
  }

  static async getClassMarks(teacherId: string) {
    this.checkId(teacherId);
    return await marksModel.find({ teacherId }).lean();
  }

  static async getClassHomework(teacherId: string) {
    this.checkId(teacherId);
    return await Homework.find({ assignedById: teacherId }).lean();
  }

  static async getClassTimetable(teacherId: string) {
    this.checkId(teacherId);
    const classData = await ClassModel.findOne({ teacherId }).lean();
    if (!classData) return null;
    return await timetableModel.find({ classId: classData._id }).lean();
  }

  static async getMyTimetable(teacherId: string) {
    this.checkId(teacherId);
    return await teacherTimetableModel.findOne({ teacherId }).lean();
  }

  static async getLeaveStatus(teacherId: string) {
    this.checkId(teacherId);
    return await LeaveModel.find({ teacherId }).lean();
  }

  static async getMyNotice(teacherId: string) {
    this.checkId(teacherId);
    const classData = await ClassModel.findOne({ teacherId }).lean();
    if (!classData) return null;
    return await NoticeModel.find({ classId: classData._id }).lean();
  }

  static async getMySubjects(teacherId: string) {
    this.checkId(teacherId);
    return await SubjectModel.find({ teacherId }).lean();
  }

  static async getExamSchedule(teacherId: string) {
    this.checkId(teacherId);
    const classData = await ClassModel.findOne({ teacherId }).lean();
    if (!classData) return null;
    return await examModel.find({ classId: classData._id }).lean();
  }
}
