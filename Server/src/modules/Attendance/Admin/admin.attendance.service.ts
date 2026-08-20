import { AdminAttendanceRepository } from "./admin.attendance.repo";

export class AdminAttendanceService {
  private repo: AdminAttendanceRepository;

  constructor() {
    this.repo = new AdminAttendanceRepository();
  }

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async getAttendanceByStudent(studentId: string, dateStr?: string) {
    const date = dateStr ? this.normalizeDate(dateStr) : undefined;
    return this.repo.findByStudentId(studentId, date);
  }

  async getAttendanceByClass(classId: string, dateStr: string) {
    const date = this.normalizeDate(dateStr);
    const records = await this.repo.findByClassAndDate(classId, date);

    // Maps studentId object to student key for Next.js UI compatibility
    return records.map((record: any) => ({
      _id: record._id,
      date: record.date,
      status: record.status,
      remarks: record.remarks,
      student: {
        _id: record.studentId?._id,
        name: record.studentId?.name || "N/A",
        rollNumber: record.studentId?.rollNumber,
        email: record.studentId?.email,
      },
      markedBy: record.markedBy
        ? {
            _id: record.markedBy._id,
            name: record.markedBy.name,
          }
        : null,
    }));
  }

  async getDateCards(classId: string, year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const summaries = await this.repo.getMarkedDatesCards(
      classId,
      startDate,
      endDate,
    );

    return summaries.map((item) => ({
      date: item._id,
      isMarked: true,
      totalMarked: item.totalMarked,
      presentCount: item.presentCount,
      absentCount: item.absentCount,
      lateCount: item.lateCount,
      excusedCount: item.excusedCount || 0,
    }));
  }
}
