import { Schema, model, Types, Document } from "mongoose";

import { IClass } from "./global.class.interface";


const classSchema = new Schema<IClass>(
    {
        name: {
            type: String,
            required: [true, "Class name is required"],
            trim: true,
            minlength: 1,
            maxlength: 10
        },
        section: {
            type: String,
            required: [true, "Section is required"],
            uppercase: true,
            trim: true,
            maxlength: 5
        },

        schoolId: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true
        },

        academicYear: {
            type: String,
            required: true,
            trim: true
        },

        strength: {
            type: Number,
            default: 0,
            min: 0
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "TeacherAuth"
        },


        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin"
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin"
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);


classSchema.index(
    { name: 1, section: 1, schoolId: 1, academicYear: 1 },
    { unique: true }
);

classSchema.index({ schoolId: 1 });


export const ClassModel = model<IClass>(
    "Class",
    classSchema
);
