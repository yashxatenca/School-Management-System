import { TeacherNoticeRepository } from "./notice.teacher.repo";

export class TeacherNoticeService {
  private noticeRepository: TeacherNoticeRepository;

  constructor() {
    this.noticeRepository = new TeacherNoticeRepository();
  }

  async createNewNotice(data: any) {
    // 👈 Class ID check zaroori hai
    if (!data.title || !data.content || !data.classId) {
      throw new Error("Title, content, and classId are required.");
    }
    return await this.noticeRepository.createNotice(data);
  }

  async fetchNotices(classId: string) {
    if (!classId) {
      throw new Error("Class ID is required to fetch notices.");
    }
    return await this.noticeRepository.getNoticesByClassId(classId);
  }

  async removeNotice(id: string) {
    const deletedNotice = await this.noticeRepository.deleteNoticeById(id);
    if (!deletedNotice) {
      throw new Error("Notice not found.");
    }
    return deletedNotice;
  }
}
