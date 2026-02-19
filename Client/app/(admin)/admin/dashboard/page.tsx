
import ProtectedRoute from "@/components/Admin/ProtectedRoute";
export default function PrincipalDashboard() {
  return (
    <ProtectedRoute role="admin">
   
       
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">Welcome, Principal 👋</h2>
        <p className="text-gray-600">
          Manage teachers, students, classes, and attendance from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Teachers" value="24" />
        <DashboardCard title="Total Students" value="620" />
        <DashboardCard title="Classes" value="18" />
        <DashboardCard title="Sections" value="45" />
      </div>

      {/* Recent Activity / Placeholder */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <p className="text-gray-500 text-sm">
          No recent activity yet.
        </p>
      </div>
    </div></ProtectedRoute>
  );
}

/* Small reusable card */
function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
