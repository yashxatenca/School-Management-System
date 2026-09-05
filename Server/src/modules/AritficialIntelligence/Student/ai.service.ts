import { ai } from "../GeminiSDK";
import { Type, Tool } from "@google/genai";
import { StudentAITools } from "./task.repo";

const studentTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "getMyInfo",
        description:
          "Fetch general student details like name, teacher name, email, class name, and principal name.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyProfile",
        description:
          "Fetch student personal profile info like contact details and personal metadata.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyAttendance",
        description: "Fetch student attendance records for the last 30 days.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyMarks",
        description:
          "Fetch academic performance, exam marks, and report card results.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyExams",
        description: "Fetch the upcoming exam routine or exam schedules.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyHomework",
        description: "Fetch pending or today's school homework assignments.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getLeaveStatus",
        description: "Fetch the status of submitted leave applications.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getmytimetable",
        description: "Fetch the daily class timetable or schedule routine.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMyNotice",
        description:
          "Fetch critical announcements from the school notice board.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getMySubject",
        description:
          "Fetch information about subjects assigned to the student's class.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getClassInfo",
        description:
          "Fetch details regarding the current class, room, or section.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "getSchoolInfo",
        description:
          "Fetch corporate/general details of the registered school.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
    ],
  },
];

export async function handleStudentChat(
  studentId: string,
  userMessage: string,
): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.5-flash-lite",
      config: {
        systemInstruction:
          "You are a polite school database assistant. If the user asks for personal or school records, use the provided tools. If the tools return no database entries, or if the user asks general questions outside the database context, use your own knowledge to directly help and answer them accurately.",
        tools: studentTools,
      },
    });

    let response = await chat.sendMessage({ message: userMessage });

    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;

      let functionResult: unknown;

      switch (functionName) {
        case "getMyInfo":
          functionResult = await StudentAITools.getMyInfo(studentId);
          break;
        case "getMyProfile":
          functionResult = await StudentAITools.getMyProfile(studentId);
          break;
        case "getMyAttendance":
          functionResult = await StudentAITools.getMyAttendance(studentId);
          break;
        case "getMyMarks":
          functionResult = await StudentAITools.getMyMarks(studentId);
          break;
        case "getMyExams":
          functionResult = await StudentAITools.getMyExams(studentId);
          break;
        case "getMyHomework":
          functionResult = await StudentAITools.getMyHomework(studentId);
          break;
        case "getLeaveStatus":
          functionResult = await StudentAITools.getLeaveStatus(studentId);
          break;
        case "getmytimetable":
          functionResult = await StudentAITools.getmytimetable(studentId);
          break;
        case "getMyNotice":
          functionResult = await StudentAITools.getMyNotice(studentId);
          break;
        case "getMySubject":
          functionResult = await StudentAITools.getMySubject(studentId);
          break;
        case "getClassInfo":
          functionResult = await StudentAITools.getClassInfo(studentId);
          break;
        case "getSchoolInfo":
          functionResult = await StudentAITools.getSchoolInfo(studentId);
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
