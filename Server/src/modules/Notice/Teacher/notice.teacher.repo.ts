import { NoticeModel, INotice } from "../notice.model";

export class TeacherNoticeRepository {
  async createNotice(data: Partial<INotice>): Promise<INotice> {
    const notice = new NoticeModel(data);
    return await notice.save();
  }

  // 👈 Sirf wahi notices layega jo is classId ke hain
  async getNoticesByClassId(classId: string): Promise<INotice[]> {
    return await NoticeModel.find({ classId }).sort({ createdAt: -1 });
  }

  async deleteNoticeById(id: string): Promise<INotice | null> {
    return await NoticeModel.findByIdAndDelete(id);
  }
}
