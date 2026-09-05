import { ai } from "../GeminiSDK";

import { AdminAITools } from "./task.repo";
import { AdminTools } from "./ToolList";

export async function handleAdminChat(
  adminId: string,
  userMessage: string,
): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.5-flash-lite",

      config: {
        systemInstruction:
          "You are a polite school administration database assistant. If the admin asks for personal, school, teacher, student, attendance, class, exam, homework, leave, timetable, or notice records, use the provided tools. If the tools return no database entries, or if the admin asks general questions outside the database context, use your own knowledge to directly help and answer them accurately.",

        tools: AdminTools,
      },
    });

    let response = await chat.sendMessage({
      message: userMessage,
    });

    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];

      const functionName = call.name;

      let functionResult: unknown;

      // The switch cases MUST perfectly match
      // the "name" field in your AdminTools array

      switch (functionName) {
        case "getMyInfo":
          functionResult = await AdminAITools.getMyInfo(adminId);
          break;

        case "getMySchoolInfo":
          functionResult = await AdminAITools.getMySchoolInfo(adminId);
          break;

        case "getMyProfileInfo":
          functionResult = await AdminAITools.getMyProfileInfo(adminId);
          break;

        case "getTeacherInfo":
          functionResult = await AdminAITools.getTeacherInfo(adminId);
          break;

        case "getStudentInfo":
          functionResult = await AdminAITools.getStudentInfo(adminId);
          break;

        case "getAttendanceInfo":
          functionResult = await AdminAITools.getAttendanceInfo(adminId);
          break;

        case "getClassInfo":
          functionResult = await AdminAITools.getClassInfo(adminId);
          break;

        case "getExamSchedule":
          functionResult = await AdminAITools.getExamSchedule(adminId);
          break;

        case "getHomeworkReport":
          functionResult = await AdminAITools.getHomeworkReport(adminId);
          break;

        case "getLeaveReport":
          functionResult = await AdminAITools.getLeaveReport(adminId);
          break;

        case "getTimetableReport":
          functionResult = await AdminAITools.getTimetableReport(adminId);
          break;

        case "getNoticeInfo":
          functionResult = await AdminAITools.getNoticeInfo(adminId);
          break;

        default:
          functionResult = null;
      }

      // Check if data is truly empty
      const isEmpty =
        !functionResult ||
        (Array.isArray(functionResult) && functionResult.length === 0) ||
        (typeof functionResult === "object" &&
          functionResult !== null &&
          Object.keys(functionResult).length === 0);

      let finalPayload: Record<string, unknown>;

      if (isEmpty) {
        finalPayload = {
          status: "not_found",
          message:
            "No explicit records found matching this inquiry inside the database. Provide a general contextual answer or ask for refinement if needed.",
        };
      } else if (Array.isArray(functionResult)) {
        finalPayload = {
          data: functionResult,
        };
      } else if (
        typeof functionResult === "object" &&
        functionResult !== null
      ) {
        finalPayload = functionResult as Record<string, unknown>;
      } else {
        finalPayload = {
          result: functionResult,
        };
      }

      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: functionName,
              response: finalPayload,
            },
          },
        ],
      });
    }

    return response.text || "I am unable to generate a response at this time.";
  } catch (error) {
    console.error("Gemini Admin Chat Execution Error:", error);

    throw new Error("AI service error.");
  }
}
