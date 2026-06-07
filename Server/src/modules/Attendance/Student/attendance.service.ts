import { AttendanceRepository } from "./attendance.repo";

export class AttendanceService {
  private attendanceRepo: AttendanceRepository;

  constructor() {
    this.attendanceRepo = new AttendanceRepository();
  }

  async getSingleDayAttendance(studentId: string, date: string) {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }
    return await this.attendanceRepo.findBySingleDate(studentId, date);
  }

  async getRangeAttendance(
    studentId: string,
    startDate: string,
    endDate: string,
  ) {
    if (
      !startDate.match(/^\d{4}-\d{2}-\d{2}$/) ||
      !endDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }
    if (startDate > endDate) {
      throw new Error("Start date cannot be greater than end date");
    }
    return await this.attendanceRepo.findByDateRange(
      studentId,
      startDate,
      endDate,
    );
  }
}
