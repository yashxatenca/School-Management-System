import { Request, Response } from "express";
import { handleAdminChat } from "./ai.service";

export const processAdminChat = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message } = req.body;

    const adminId = req?.user?.id;

    if (!adminId || !message) {
      res
        .status(400)
        .json({ success: false, error: "TeacherId and message are required." });
      return;
    }

    const aiReply = await handleAdminChat(adminId, message);
    res.status(200).json({ success: true, reply: aiReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Unable to process message right now.",
    });
  }
};
