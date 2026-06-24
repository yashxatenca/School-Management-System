"use client";

import { useGetTotalDashboard } from "@/hooks/Admin/useAdminDashboard";

function StatCard({
  title,
  value,
  colorClass,
}: {
  title: string;
  value: string | number;
  colorClass: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${colorClass}`}
    >
      <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
        {title}
      </h4>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

export default function StatsGrid() {
  const { data, isLoading } = useGetTotalDashboard();

  const dashboard = data?.data?.TotalDashboard;

  const stats = [
    {
      title: "Teachers",
      value: dashboard?.totalTeachers ?? 0,
      colorClass: "border-blue-500",
    },
    {
      title: "Students",
      value: dashboard?.totalStudents ?? 0,
      colorClass: "border-green-500",
    },
    {
      title: "Classes",
      value: dashboard?.totalClasses ?? 0,
      colorClass: "border-yellow-500",
    },
    {
      title: "Sections",
      value: dashboard?.totalSections ?? 0,
      colorClass: "border-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}
