import GlobalIdModel from "../../models/global.student.id.models";

export const generateStudentNumber = async (): Promise<string> => {
  const counter = await GlobalIdModel.findOneAndUpdate(
    { key: "student" },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,   // create if not exists
    }
  );

  if (counter.seq > 999999) {
    throw new Error("Student ID limit exceeded");
  }

  return String(counter.seq).padStart(6, "0");
};
