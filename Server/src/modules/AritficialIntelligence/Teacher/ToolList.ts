import { Type, Tool } from "@google/genai";

export const TeacherTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "getMyInfo",
        description:
          "Fetch the authenticated teacher's general account information, including name, email, and principal or school administration details.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyProfile",
        description:
          "Fetch the authenticated teacher's personal profile information, including contact details and school information.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyClass",
        description:
          "Fetch the class or section currently assigned to the authenticated teacher.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyStudents",
        description:
          "Fetch the students belonging to the authenticated teacher's assigned class.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyAttendance",
        description:
          "Fetch attendance records marked by the authenticated teacher for today.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getClassMarks",
        description:
          "Fetch marks or academic performance records entered by the authenticated teacher for their class.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getClassHomework",
        description:
          "Fetch homework assignments created by the authenticated teacher for their class.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getClassTimetable",
        description:
          "Fetch the timetable for the class assigned to the authenticated teacher.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyTimetable",
        description:
          "Fetch the authenticated teacher's personal teaching timetable and schedule.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getLeaveStatus",
        description:
          "Fetch leave applications and their status associated with the authenticated teacher.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyNotice",
        description:
          "Fetch notices and announcements relevant to the authenticated teacher's assigned class.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMySubjects",
        description: "Fetch subjects assigned to the authenticated teacher.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getExamSchedule",
        description:
          "Fetch exam schedules relevant to the authenticated teacher's assigned class.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
    ],
  },
];
