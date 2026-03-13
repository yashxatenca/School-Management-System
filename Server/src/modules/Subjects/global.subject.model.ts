import { Schema, model, Types, Document } from "mongoose";
import { ISubject } from "./global.interface";

/* ================================
SUBJECT SCHEMA
================================ */

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

/* ================================
INDEXES (Performance + Safety)
================================ */

// Prevent duplicate subject names inside the same school
subjectSchema.index(
    { name: 1, schoolId: 1 },
    { unique: true }
);

// Prevent duplicate subject codes inside same school
subjectSchema.index(
    { code: 1, schoolId: 1 },
    { unique: true }
);

/* ================================
EXPORT MODEL
================================ */

export const SubjectModel = model<ISubject>(
    "Subject",
    subjectSchema
);
