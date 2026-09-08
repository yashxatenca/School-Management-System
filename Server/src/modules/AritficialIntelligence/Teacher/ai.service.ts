import { ai } from "../GeminiSDK";
import { Type, Tool } from "@google/genai";
import { TeacherAITools } from "./task.repo";
import { TeacherTools } from "./ToolList";

export async function handleTeacherChat(
  teacherId: string,
  userMessage: string,
): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.5-flash-lite",
      config: {
        systemInstruction:
          "You are a polite school database assistant. If the user asks for personal or school records, use the provided tools. If the tools return no database entries, or if the user asks general questions outside the database context, use your own knowledge to directly help and answer them accurately.",
        tools: TeacherTools,
      },
    });

    let response = await chat.sendMessage({ message: userMessage });

    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;

      let functionResult: unknown;

 
      switch (functionName) {
        case "getMyInfo":
          functionResult = await TeacherAITools.getMyInfo(teacherId);
          break;
        case "getMyProfile":
          functionResult = await TeacherAITools.getMyProfile(teacherId);
          break;
        case "getMyClass":
          functionResult = await TeacherAITools.getMyClass(teacherId);
          break;
        case "getMyStudents":
          functionResult = await TeacherAITools.getMyStudents(teacherId);
          break;
        case "getMyAttendance":
          functionResult = await TeacherAITools.getMyAttendance(teacherId);
          break;
        case "getClassMarks":
          functionResult = await TeacherAITools.getClassMarks(teacherId);
          break;
        case "getClassHomework":
          functionResult = await TeacherAITools.getClassHomework(teacherId);
          break;
        case "getClassTimetable":
          functionResult = await TeacherAITools.getClassTimetable(teacherId);
          break;
        case "getMyTimetable":
          functionResult = await TeacherAITools.getMyTimetable(teacherId);
          break;
        case "getLeaveStatus":
          functionResult = await TeacherAITools.getLeaveStatus(teacherId);
          break;
        case "getMyNotice":
          functionResult = await TeacherAITools.getMyNotice(teacherId);
          break;
        case "getMySubjects":
          functionResult = await TeacherAITools.getMySubjects(teacherId);
          break;
        case "getExamSchedule":
          functionResult = await TeacherAITools.getExamSchedule(teacherId);
          break;
        default:
          functionResult = null;
      }

      
      const isEmpty =
        !functionResult ||
        (Array.isArray(functionResult) && functionResult.length === 0) ||
        (typeof functionResult === "object" &&
          Object.keys(functionResult).length === 0);

      let finalPayload: Record<string, unknown>;

      if (isEmpty) {
        finalPayload = {
          status: "not_found",
          message:
            "No explicit records found matching this inquiry inside the database. Provide a general contextual answer or ask for refinement if needed.",
        };
      } else if (Array.isArray(functionResult)) {
        finalPayload = { data: functionResult };
      } else if (
        typeof functionResult === "object" &&
        functionResult !== null
      ) {
        finalPayload = functionResult as Record<string, unknown>;
      } else {
        finalPayload = { result: functionResult };
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
    console.error("Gemini Chat Execution Error:", error);
    throw new Error("AI service error.");
  }
}
