import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { StudentAuthDocument } from "../interface/student.auth.interface";

const StudentAuthSchema = new Schema<StudentAuthDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentId: {
      type: String,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 3,
      select: false,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    principalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



// 🔹 Generate 6 Digit Student ID (Safe Version)
StudentAuthSchema.pre("validate", async function () {
  if (!this.studentId) {

    const model = this.constructor as Model<StudentAuthDocument>;

    let newId;
    let exists = true;

    // Try max 5 times to avoid infinite loop
    for (let i = 0; i < 5 && exists; i++) {
      newId = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await model.findOne({ studentId: newId });
      if (!existing) exists = false;
    }

    if (exists) {
      throw new Error("Unable to generate unique studentId");
    }

    this.studentId = newId!;
  }
});



// 🔹 Hash Password Before Save
StudentAuthSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (error: any) {
    throw error;
  }
});



// 🔹 Compare Password
StudentAuthSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};



export const StudentAuth: Model<StudentAuthDocument> =
  mongoose.models.StudentAuth ||
  mongoose.model<StudentAuthDocument>("StudentAuth", StudentAuthSchema);