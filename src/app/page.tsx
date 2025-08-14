'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, FileClock, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const dataProcessingData = [
  { name: '00:00', successful: 12, pending: 5, failed: 2 },
  { name: '01:00', successful: 19, pending: 7, failed: 1 },
  { name: '02:00', successful: 25, pending: 3, failed: 3 },
  { name: '03:00', successful: 32, pending: 8, failed: 0 },
  { name: '04:00', successful: 28, pending: 5, failed: 2 },
  { name: '05:00', successful: 35, pending: 6, failed: 1 },
  { name: '06:00', successful: 42, pending: 4, failed: 0 },
];


const middlewareModules = [
    { title: 'Authentication & Authorization' },
    { title: 'Database Management' },
    { title: 'Instrument Communication', subItems: ['TCP/IP uni-directional', 'TCP/IP bi-directional', 'Serial uni-directional', 'Serial bi-directional'] },
    { title: 'Communication with LIS & SATUSEHAT' },
    { title: 'Data Mapping Engine' },
    { title: 'Online/Offline Capability' },
    { title: 'Business Logic Layer' },
];

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    connectedDevices: 0,
    pendingResults: 0,
    failedDispatches: 0,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setStats({
        connectedDevices: 1,
        pendingResults: 1,
        failedDispatches: 1,
      });
      setLoading(false);
    }, 1000);
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
            {/* Custom Header */}
            <div className="bg-gradient-to-r from-teal-500 to-green-500 p-8 rounded-xl shadow-lg -mt-4">
                <h1 className="text-3xl font-bold text-white">Middleware LIS</h1>
                <p className="text-white/80 mt-1">for integrating laboratory instruments with SATUSEHAT</p>
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

            {/* New Cards */}
            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Middleware Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                            {middlewareModules.map(module => (
                                <li key={module.title}><span className="text-foreground font-medium">{module.title}</span>
                                    {module.subItems && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            {module.subItems.map(sub => <li key={sub}>{sub}</li>)}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Data Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataProcessingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={renderLegend}/>
                                    <Line type="monotone" dataKey="successful" name="Successful" stroke="#28A745" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="pending" name="Pending" stroke="#FFC107" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="failed" name="Failed" stroke="#DC3545" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Business Logic Layer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This section can be used to display information about the business logic layer, such as active rules, processing pipelines, or other relevant metrics.</p>
                </CardContent>
            </Card>

        </div>
    </MainLayout>
  );
}
