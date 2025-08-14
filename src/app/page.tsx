
'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, FileClock, AlertCircle, CheckCircle, HelpCircle, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { LabResult } from '@/components/dashboard/lab-results-table'; // Assuming types are exported
import { mockResults } from '@/components/dashboard/lab-results-table'; // Assuming mock data is exported

// Function to process raw results into hourly stats
const processDataForChart = (results: LabResult[]) => {
    const hourlyStats: { [hour: string]: { successful: number; pending: number; failed: number } } = {};

    results.forEach(result => {
        try {
            const hour = result.timestamp.substring(11, 13) + ':00';
            if (!hourlyStats[hour]) {
                hourlyStats[hour] = { successful: 0, pending: 0, failed: 0 };
            }

            switch (result.status) {
                case 'Sent':
                    hourlyStats[hour].successful++;
                    break;
                case 'Pending':
                    hourlyStats[hour].pending++;
                    break;
                case 'Failed':
                    hourlyStats[hour].failed++;
                    break;
                // QC results are ignored for this chart
            }
        } catch (e) {
            console.error("Error processing timestamp for result:", result, e);
        }
    });
    
    // Convert to chart-compatible format and sort by hour
    return Object.entries(hourlyStats)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => a.name.localeCompare(b.name));
};


export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    connectedDevices: 1, // This remains static for now
    pendingResults: 0,
    failedDispatches: 0,
  });
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    // In a real app, you'd fetch this data. Here we use the mock.
    const results: LabResult[] = mockResults;

    const pendingCount = results.filter(r => r.status === 'Pending').length;
    const failedCount = results.filter(r => r.status === 'Failed').length;
    
    setStats(prev => ({
        ...prev,
        pendingResults: pendingCount,
        failedDispatches: failedCount,
    }));

    const processedChartData = processDataForChart(results);
    setChartData(processedChartData);

    setLoading(false);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center items-center gap-4 mt-4">
        {
          payload.map((entry: any, index: any) => {
             const Icon = entry.value === 'Successful' ? CheckCircle : entry.value === 'Pending' ? HelpCircle : AlertTriangle;
             const color = entry.value === 'Successful' ? 'text-green-500' : entry.value === 'Pending' ? 'text-yellow-500' : 'text-red-500';

            return (
              <div key={`item-${index}`} className="flex items-center gap-1.5 text-sm">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-muted-foreground">{entry.value}</span>
              </div>
            )
          })
        }
      </div>
    );
  }

  return (
    <MainLayout>
        <div className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 p-6 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Middleware LIS</h1>
                <p className="text-white/90 mt-1">for integrating laboratory instruments with SATUSEHAT</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/devices">
                <Card className="hover:shadow-lg transition-shadow duration-300">
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
                <Card className="hover:shadow-lg transition-shadow duration-300">
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
                <Card className="hover:shadow-lg transition-shadow duration-300">
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

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Middleware Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>Authentication & Authorization</li>
                            <li>Database Management</li>
                            <li>
                                Instrument Communication
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                                    <li>TCP/IP uni-directional</li>
                                    <li>TCP/IP bi-directional</li>
                                    <li>Serial uni-directional</li>
                                    <li>Serial bi-directional</li>
                                </ul>
                            </li>
                            <li>Communication with LIS & SATUSEHAT</li>
                            <li>Data Mapping Engine</li>
                            <li>Online/Offline Capability</li>
                            <li>Business Logic Layer</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Data Processing (Last 24 Hours)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                           {loading ? <Skeleton className="w-full h-full" /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{paddingTop: 20}} content={renderLegend}/>
                                        <Line type="monotone" dataKey="successful" name="Successful" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="pending" name="Pending" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="failed" name="Failed" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                           )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
             <Card className="hover:shadow-lg transition-shadow duration-300">
                <Link href="/settings/business-logic">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <SlidersHorizontal className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Business Logic Layer</CardTitle>
                            <CardDescription>Automate result validation, flagging, and handling with custom rules.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                           <div>
                                <p className="font-semibold text-card-foreground">3 Active Rules</p>
                                <p>Checking for critical values and test ranges.</p>
                           </div>
                           <div>
                                <p className="font-semibold text-card-foreground">12 Results Flagged Today</p>
                                <p>Results automatically flagged for review.</p>
                           </div>
                           <div>
                                <p className="font-semibold text-card-foreground">0 Rejections</p>
                                <p>No results have been auto-rejected.</p>
                           </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        </div>
    </MainLayout>
  );
}
