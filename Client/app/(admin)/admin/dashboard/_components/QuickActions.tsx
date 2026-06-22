import Link from "next/link";
import { UserPlus, CheckSquare, Users, FileText } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Student",
      description: "Enroll a new student to a class",
      icon: <UserPlus className="w-6 h-6 text-blue-600" />,
      link: "/admin/students/add",
      bgClass: "bg-blue-50",
    },
    {
      title: "Mark Attendance",
      description: "Update daily attendance logs",
      icon: <CheckSquare className="w-6 h-6 text-green-600" />,
      link: "/admin/attendance",
      bgClass: "bg-green-50",
    },
    {
      title: "Teacher Profiles",
      description: "Manage teaching staff details",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      link: "/admin/teachers",
      bgClass: "bg-purple-50",
    },
    {
      title: "Examination Marks",
      description: "Update or view student grades",
      icon: <FileText className="w-6 h-6 text-yellow-600" />,
      link: "/admin/examinations",
      bgClass: "bg-yellow-50",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link href={action.link} key={index}>
            <div className="flex items-start p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
              <div className={`p-3 rounded-lg ${action.bgClass} mr-4`}>
                {action.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
