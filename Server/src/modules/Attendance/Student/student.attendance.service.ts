import { StudentAttendanceRepository } from "./student.attendance.repo";

export class StudentAttendanceService {
  private repo: StudentAttendanceRepository;

  constructor() {
    this.repo = new StudentAttendanceRepository();
  }

  async getMyLogs(studentId: string, dateStr?: string) {
    if (!dateStr) {
   
      return this.repo.findMyAttendance(studentId);
    }

    const date = new Date(dateStr);

   
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format provided");
    }

   
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return this.repo.findMyAttendance(studentId, startOfDay, endOfDay);
  }
}
