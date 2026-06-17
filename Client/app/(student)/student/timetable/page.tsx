import React from "react";

const dummyTimetable = [
  {
    day: "Monday",
    sessions: [
      {
        id: 101,
        time: "09:00 AM - 10:30 AM",
        subject: "Data Structures",
        teacher: "Prof. Sharma",
        room: "Room 302",
      },
      {
        id: 102,
        time: "10:45 AM - 12:15 PM",
        subject: "Web Development (MERN)",
        teacher: "Dr. Verma",
        room: "Lab 1",
      },
      {
        id: 103,
        time: "01:00 PM - 02:30 PM",
        subject: "Artificial Intelligence",
        teacher: "Dr. Singh",
        room: "Room 305",
      },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      {
        id: 104,
        time: "09:00 AM - 11:00 AM",
        subject: "Database Management",
        teacher: "Prof. Gupta",
        room: "Lab 2",
      },
      {
        id: 105,
        time: "11:15 AM - 01:15 PM",
        subject: "Operating Systems",
        teacher: "Dr. Rao",
        room: "Room 201",
      },
      {
        id: 106,
        time: "02:00 PM - 03:30 PM",
        subject: "Computer Networks",
        teacher: "Prof. Sharma",
        room: "Room 302",
      },
    ],
  },
  {
    day: "Wednesday",
    sessions: [
      {
        id: 107,
        time: "09:00 AM - 10:30 AM",
        subject: "Data Science Fundamentals",
        teacher: "Dr. Singh",
        room: "Lab 3",
      },
      {
        id: 108,
        time: "10:45 AM - 12:15 PM",
        subject: "Web Development (MERN)",
        teacher: "Dr. Verma",
        room: "Lab 1",
      },
      {
        id: 109,
        time: "01:00 PM - 03:00 PM",
        subject: "Software Engineering",
        teacher: "Prof. Iyer",
        room: "Room 401",
      },
    ],
  },
  {
    day: "Thursday",
    sessions: [
      {
        id: 110,
        time: "09:00 AM - 11:00 AM",
        subject: "Artificial Intelligence",
        teacher: "Dr. Singh",
        room: "Room 305",
      },
      {
        id: 111,
        time: "11:15 AM - 12:45 PM",
        subject: "Data Structures",
        teacher: "Prof. Sharma",
        room: "Room 302",
      },
      {
        id: 112,
        time: "01:30 PM - 03:30 PM",
        subject: "Cloud Computing / DevOps",
        teacher: "Dr. Patel",
        room: "Lab 4",
      },
    ],
  },
  {
    day: "Friday",
    sessions: [
      {
        id: 113,
        time: "09:00 AM - 12:00 PM",
        subject: "Full Stack Project Lab",
        teacher: "Dr. Verma",
        room: "Lab 1",
      },
      {
        id: 114,
        time: "01:00 PM - 03:00 PM",
        subject: "Database Management",
        teacher: "Prof. Gupta",
        room: "Lab 2",
      },
    ],
  },
];

const StudentTimetable = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable</h1>
          <p className="text-gray-600 mt-2">BCA - Semester 4</p>
        </div>

        {/* Timetable Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {dummyTimetable.map((daySchedule, index) => (
            <div
              key={daySchedule.day}
              className={
                index !== dummyTimetable.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }
            >
              {/* Day Title */}
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  {daySchedule.day}
                </h2>
              </div>

              {/* Responsive Table Wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium min-w-[180px]">
                        Time
                      </th>
                      <th className="px-6 py-4 font-medium min-w-[220px]">
                        Subject
                      </th>
                      <th className="px-6 py-4 font-medium min-w-[180px]">
                        Teacher
                      </th>
                      <th className="px-6 py-4 font-medium min-w-[120px]">
                        Room
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {daySchedule.sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                          {session.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                          {session.subject}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {session.teacher}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-medium">
                            {session.room}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
