import { Suspense } from "react";
import { ApplicationsDashboard } from "@/components/applications/ApplicationsDashboard";
import { Spinner } from "@/components/ui/Spinner";

function DashboardFallback() {
  return (
    <div className="flex justify-center py-24">
      <Spinner />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <ApplicationsDashboard />
    </Suspense>
  );
}
