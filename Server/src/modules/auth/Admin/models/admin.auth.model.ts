import mongoose, { Schema } from "mongoose";
import type { IUser } from "../interface/admin.interface";
const AdminSchmea: Schema<IUser> = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    photoURL: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: "admin",
    },

    authProvider: {
      type: String,
      default: "google",
    },
    verified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    versionKey: false,
  },
);

export const AdminModel = mongoose.model<IUser>("Admin", AdminSchmea);
