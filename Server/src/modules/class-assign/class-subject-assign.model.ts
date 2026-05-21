import mongoose from "mongoose";

export const classSubjectAssignSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    subjectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],
    classTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherAuth"
    },
    principalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }

}, { timestamps: true })
classSubjectAssignSchema.index({ classId: 1, subjectId: 1, classTeacherId: 1 }, { unique: true })
export const ClassSubjectAssign = mongoose.model("ClassSubjectAssign", classSubjectAssignSchema)