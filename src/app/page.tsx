import { MainLayout } from '@/components/main-layout';
import { DeviceStatusCard } from '@/components/dashboard/device-status-card';
import { OfflineQueueIndicator } from '@/components/dashboard/offline-queue-indicator';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DeviceStatusCard name="Analyzer A-1" status="connected" />
          <DeviceStatusCard name="Analyzer B-2" status="disconnected" />
          <DeviceStatusCard name="Centrifuge C-3" status="error" />
          <OfflineQueueIndicator count={12} />
        </div>
        <div>
          <LabResultsTable />
        </div>
      </div>
    </MainLayout>
  );
}
