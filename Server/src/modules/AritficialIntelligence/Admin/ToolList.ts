import { Type, Tool } from "@google/genai";

export const AdminTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "getMyInfo",
        description:
          "Fetch the authenticated admin's general account information, including name, email, and account details.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMySchoolInfo",
        description:
          "Fetch information about the school managed by the authenticated admin, including school details and administration information.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getMyProfileInfo",
        description:
          "Fetch the authenticated admin's personal profile information, including contact and profile details.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getTeacherInfo",
        description:
          "Fetch information about teachers associated with the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getStudentInfo",
        description:
          "Fetch information about students associated with the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getAttendanceInfo",
        description:
          "Fetch attendance information for students in the authenticated admin's school, including attendance records.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getClassInfo",
        description:
          "Fetch information about classes and sections available in the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getExamSchedule",
        description:
          "Fetch examination schedules configured for the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getHomeworkReport",
        description:
          "Fetch homework assignments and class information available in the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getLeaveReport",
        description:
          "Fetch leave applications and their status associated with the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getTimetableReport",
        description:
          "Fetch timetable information available to the authenticated admin, including school or teacher timetable details.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },

      {
        name: "getNoticeInfo",
        description:
          "Fetch notices and announcements available in the authenticated admin's school.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
    ],
  },
];
