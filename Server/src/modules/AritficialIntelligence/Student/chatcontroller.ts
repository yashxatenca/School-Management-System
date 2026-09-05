import { Request, Response } from "express";
import { handleStudentChat } from "./ai.service";

export const processStudentChat = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message } = req.body;

    const studentId = req?.user?.id;

    if (!studentId || !message) {
      res
        .status(400)
        .json({ success: false, error: "studentId and message are required." });
      return;
    }

    const aiReply = await handleStudentChat(studentId, message);
    res.status(200).json({ success: true, reply: aiReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Unable to process message right now.",
    });
  }
};
