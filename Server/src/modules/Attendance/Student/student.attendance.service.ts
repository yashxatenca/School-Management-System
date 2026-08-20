import { StudentAttendanceRepository } from "./student.attendance.repo";

export class StudentAttendanceService {
  private repo: StudentAttendanceRepository;

  constructor() {
    this.repo = new StudentAttendanceRepository();
  }

  async getMyLogs(studentId: string, dateStr?: string) {
    if (!dateStr) {
      // Date query parameter nahi hai to saari attendance fetch karo
      return this.repo.findMyAttendance(studentId);
    }

    const date = new Date(dateStr);

    // Check if the provided date string is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format provided");
    }

    // Dynamic start of day and end of day calculation
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return this.repo.findMyAttendance(studentId, startOfDay, endOfDay);
  }
}
