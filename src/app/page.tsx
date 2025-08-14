
'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, FileClock, AlertCircle, CheckCircle, HelpCircle, AlertTriangle, ShieldCheck, UserCog, Eye, LayoutDashboard, CircuitBoard, Beaker, ClipboardCheck, FileText as FileTextIcon, Settings, LucideIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const dataProcessingData = [
  { name: '00:00', successful: 12, pending: 5, failed: 2 },
  { name: '01:00', successful: 19, pending: 7, failed: 1 },
  { name: '02:00', successful: 25, pending: 3, failed: 3 },
  { name: '03:00', successful: 32, pending: 8, failed: 0 },
  { name: '04:00', successful: 28, pending: 5, failed: 2 },
  { name: '05:00', successful: 35, pending: 6, failed: 1 },
  { name: '06:00', successful: 42, pending: 4, failed: 0 },
];

const allAppModules: { title: string; icon: LucideIcon; roles: string[] }[] = [
    { title: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Technician', 'QA'] },
    { title: 'Devices', icon: CircuitBoard, roles: ['Admin', 'Technician'] },
    { title: 'Results', icon: Beaker, roles: ['Admin', 'Technician', 'QA'] },
    { title: 'QA / QC', icon: ClipboardCheck, roles: ['Admin', 'QA'] },
    { title: 'Logs', icon: FileTextIcon, roles: ['Admin', 'Technician'] },
    { title: 'Settings', icon: Settings, roles: ['Admin'] },
];


export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const { userRole } = useAuth();
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

  const roleConfig: Record<string, { icon: LucideIcon, className: string }> = {
    Admin: { icon: ShieldCheck, className: 'bg-primary/10 text-primary border-primary/20' },
    Technician: { icon: UserCog, className: 'bg-blue-100 text-blue-800 border-blue-200' },
    QA: { icon: Eye, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  };

  const accessibleModules = allAppModules.filter(module => userRole && module.roles.includes(userRole));
  const RoleIcon = userRole ? roleConfig[userRole]?.icon : UserCog;

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
                        <CardDescription>Modules available for your role.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userRole ? (
                            <>
                                <div className="flex items-center mb-4">
                                     <Badge variant="outline" className={roleConfig[userRole]?.className + " gap-2 text-base font-semibold"}>
                                        <RoleIcon className="h-4 w-4" />
                                        {userRole}
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                {accessibleModules.map(module => {
                                    const Icon = module.icon;
                                    return (
                                        <div key={module.title} className="flex items-center gap-3 text-sm">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-foreground">{module.title}</span>
                                        </div>
                                    )
                                })}
                                </div>
                            </>
                        ) : <Skeleton className="h-32 w-full" />}
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
        </div>
    </MainLayout>
  );
}
