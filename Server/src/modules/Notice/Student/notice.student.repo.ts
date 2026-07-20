import { NoticeModel, INotice } from "../notice.model";

export class StudentNoticeRepository {
  async getNoticesByClassId(classId: string): Promise<INotice[]> {
    return await NoticeModel.find({ classId }).sort({ createdAt: -1 });
  }
}
