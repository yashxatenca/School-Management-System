import { StudentNoticeRepository } from "./notice.student.repo";

export class StudentNoticeService {
  private noticeRepository: StudentNoticeRepository;

  constructor() {
    this.noticeRepository = new StudentNoticeRepository();
  }

  async fetchNotices(classId: string) {
    if (!classId) {
      throw new Error("Class ID is required to fetch notices.");
    }
    return await this.noticeRepository.getNoticesByClassId(classId);
  }
}
