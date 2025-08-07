'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileClock, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    connectedDevices: 0,
    pendingResults: 0,
    failedDispatches: 0,
  });

  React.useEffect(() => {
    // Simulate fetching data from Firestore
    setTimeout(() => {
      setStats({
        connectedDevices: 1, // from mockDevices where status is 'connected'
        pendingResults: 1, // from mockResults where status is 'Pending'
        failedDispatches: 1, // from mockResults where status is 'Failed'
      });
      setLoading(false);
    }, 1000);
  }, []);


  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {stats.failedDispatches > 5 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Alert</AlertTitle>
            <AlertDescription>
              More than 5 results failed to dispatch. Please check the logs and system status.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <Link href="/devices">
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.connectedDevices}</div>}
                  <p className="text-xs text-muted-foreground">Online and reporting</p>
                </CardContent>
            </Card>
          </Link>
           <Link href="/results?status=Pending">
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
                <FileClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.pendingResults}</div>}
                  <p className="text-xs text-muted-foreground">Waiting to be sent to LIS</p>
                </CardContent>
            </Card>
          </Link>
          <Link href="/results?status=Failed">
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Dispatches</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.failedDispatches}</div>}
                  <p className="text-xs text-muted-foreground">Check logs for details</p>
                </CardContent>
            </Card>
          </Link>
        </div>
        <div>
          <Card>
            <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
                <LabResultsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
