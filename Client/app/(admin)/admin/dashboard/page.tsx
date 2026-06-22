import ProtectedRoute from "@/components/Admin/ProtectedRoute";
// Seedhe same folder se import kro
import GreetingHeader from "./_components/GreetingHeader";
import StatsGrid from "./_components/StatsGrid";
import QuickActions from "./_components/QuickActions";

export default function PrincipalDashboard() {
  return (
    <ProtectedRoute role="admin">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        <GreetingHeader />
        <StatsGrid />
        <QuickActions />
      </div>
    </ProtectedRoute>
  );
}
