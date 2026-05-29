import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  classId: mongoose.Types.ObjectId; // 👈 Notice ab ek specific class se linked hai
  createdBy: mongoose.Types.ObjectId;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const NoticeModel = mongoose.model<INotice>("Notice", NoticeSchema);
