import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { TeacherSchema } from "../interface/teacher.auth.interface";

const TeacherAuthSchema = new Schema<TeacherSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    teacher_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 1,
      select: false, // 👈 important for security
    },
    principalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "teacher",
    },
  },
  {
    timestamps: true,
  },
);

TeacherAuthSchema.pre<TeacherSchema>("save", async function () {
  // If password isn't modified, just exit the function
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  
});

TeacherAuthSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const TeacherAuthModel = mongoose.model<TeacherSchema>(
  "TeacherAuth",
  TeacherAuthSchema,
);

export default TeacherAuthModel;
