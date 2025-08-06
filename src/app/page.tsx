import { MainLayout } from '@/components/main-layout';
import { DeviceStatusCard } from '@/components/dashboard/device-status-card';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileCheck, FileClock, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const connectedDevices = 4;
  const pendingResults = 8;
  const failedDispatches = 6;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {failedDispatches > 5 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              More than 5 results failed to dispatch. Please check the logs.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedDevices}</div>
              <p className="text-xs text-muted-foreground">Online and reporting</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
              <FileClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingResults}</div>
              <p className="text-xs text-muted-foreground">Waiting to be sent to LIS</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Dispatches</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedDispatches}</div>
              <p className="text-xs text-muted-foreground">Check logs for details</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <LabResultsTable />
        </div>
      </div>
    </MainLayout>
  );
}