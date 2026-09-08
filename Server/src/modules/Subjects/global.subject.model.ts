import { Schema, model, Types, Document } from "mongoose";
import { ISubject } from "./global.interface";


const subjectSchema = new Schema<ISubject>(
    {
        name: {
            type: String,
            required: [true, "Subject name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        code: {
            type: String,
            required: [true, "Subject code is required"],
            uppercase: true,
            trim: true,
            minlength: 2,
            maxlength: 10,
        },

        schoolId: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "TeacherAuth",
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);



subjectSchema.index(
    { name: 1, schoolId: 1 },
    { unique: true }
);


subjectSchema.index(
    { code: 1, schoolId: 1 },
    { unique: true }
);


export const SubjectModel = model<ISubject>(
    "Subject",
    subjectSchema
);
