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
  const stats = [
    {
      id: 1,
      title: "Total Teachers",
      value: 24,
      colorClass: "border-blue-500",
    },
    {
      id: 2,
      title: "Total Students",
      value: 620,
      colorClass: "border-green-500",
    },
    { id: 3, title: "Classes", value: 18, colorClass: "border-purple-500" },
    { id: 4, title: "Sections", value: 45, colorClass: "border-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}
