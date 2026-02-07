import mongoose, { Schema, Document } from "mongoose";

export interface GlobalIdDocument extends Document {
  key: string;   // "student"
  seq: number;   // counter
}

const GlobalIdSchema = new Schema<GlobalIdDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const GlobalIdModel = mongoose.model<GlobalIdDocument>(
  "GlobalId",
  GlobalIdSchema
);

export default GlobalIdModel;
