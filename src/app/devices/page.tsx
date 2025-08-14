'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, TriangleAlert, type LucideIcon, PlusCircle, Search, Clock, Server, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AddDeviceWizard } from '@/components/devices/add-device-wizard';

type DeviceStatus = 'Online' | 'Offline' | 'Standby' | 'Error';

interface Device {
  id: string;
  name: string;
  model: string;
  connectionType: string;
  serialNumber: string;
  firmwareVersion: string;
  status: DeviceStatus;
  lastSync: string;
  logs: string[];
  mapping: { itemCode: string; glul: string }[];
}

const statusConfig: Record<
  DeviceStatus,
  {
    label: string;
    color: string;
  }
> = {
  Online: {
    label: 'Online',
    color: 'bg-green-500',
  },
  Offline: {
    label: 'Offline',
    color: 'bg-red-500',
  },
  Standby: {
    label: 'Standby',
    color: 'bg-yellow-500',
  },
  Error: {
    label: 'Error',
    color: 'bg-red-500',
  },
};

const initialMockDevices: Device[] = [
    { id: 'DEV-001', name: 'Chemistry Analyzer', model: 'Cobas c311', connectionType: 'TCP/IP Bi-directional', status: 'Online', lastSync: new Date().toISOString(), serialNumber: '1234367890', firmwareVersion: '1:4 2', logs: ["Connected successfully"], mapping: [{itemCode: 'GLU', glul: 'GLU'}, {itemCode: 'CHOL', glul: 'CHOL'}]},
    { id: 'DEV-002', name: 'Hematology Analyzer', model: 'Sysmex XN', connectionType: 'Serial Uni-directional', status: 'Offline', lastSync: new Date(Date.now() - 3600 * 1000).toISOString(), serialNumber: 'SN-SYS-002', firmwareVersion: '2.1.0', logs: ["Connection lost"], mapping: [{itemCode: 'WBC', glul: 'WBC'}, {itemCode: 'RBC', glul: 'RBC'}] },
    { id: 'DEV-003', name: 'Coagulation Analyzer', model: 'ACL Elite', connectionType: 'TCP/IP Uni-directional', status: 'Online', lastSync: new Date(Date.now() - 120 * 1000).toISOString(), serialNumber: 'SN-ACL-003', firmwareVersion: '3.5.1', logs: ["Ready"], mapping: [{itemCode: 'PT', glul: 'PT'}, {itemCode: 'APTT', glul: 'APTT'}] },
    { id: 'DEV-004', name: 'Immunoassay Analyzer', model: 'Abbott Architect', connectionType: 'Serial Uni-directional', status: 'Standby', lastSync: new Date(Date.now() - 1800 * 1000).toISOString(), serialNumber: 'SN-ABB-004', firmwareVersion: '1.9.8', logs: ["Idle"], mapping: [{itemCode: 'TSH', glul: 'TSH'}, {itemCode: 'FT4', glul: 'FT4'}] },
    { id: 'DEV-005', name: 'Urine Analyzer', model: 'DIRUI UF-50', connectionType: 'TCP/IP Bi-directional', status: 'Offline', lastSync: new Date(Date.now() - 86400 * 1000).toISOString(), serialNumber: 'SN-DIR-005', firmwareVersion: '1.2.3', logs: ["Device powered off"], mapping: [{itemCode: 'LEU', glul: 'LEU'}, {itemCode: 'URO', glul: 'URO'}] },
];

function StatCard({ icon: Icon, title, value, isLoading }: { icon: LucideIcon; title: string; value: string | number; isLoading: boolean}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
  )
}

export default function DevicesPage() {
  const { toast } = useToast();
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
        setDevices(initialMockDevices);
        setSelectedDevice(initialMockDevices[0]);
        setIsLoading(false);
    }, 800)
  }, []);

  const handleAddDevice = (newDeviceData: Omit<Device, 'status' | 'lastSync' | 'logs' | 'mapping'>) => {
    const newDevice: Device = {
        ...newDeviceData,
        status: 'Offline', // Default status for new devices
        lastSync: new Date().toISOString(),
        logs: ['Device added'],
        mapping: [],
    };
    
    setDevices(currentDevices => [newDevice, ...currentDevices]);
    toast({ title: "Success", description: "Device added to local list." });
  };
  
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const offlineCount = devices.filter(d => d.status === 'Offline' || d.status === 'Standby').length;


  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title="Total Devices" value={devices.length} icon={Server} isLoading={isLoading}/>
              <StatCard title="Online" value={onlineCount} icon={Power} isLoading={isLoading}/>
              <StatCard title="Offline" value={offlineCount} icon={PowerOff} isLoading={isLoading}/>
              <StatCard title="Last Sync" value={isLoading ? '...' : new Date().toLocaleTimeString()} icon={Clock} isLoading={isLoading}/>
            </div>
          
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <AddDeviceWizard onSave={handleAddDevice} />
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search devices..." className="pl-10 w-full sm:w-64" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Connection Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          </TableRow>
                        ))
                      ) : devices.map((device) => {
                        const config = statusConfig[device.status];
                        return (
                          <TableRow key={device.id} onClick={() => setSelectedDevice(device)} className={cn("cursor-pointer", selectedDevice?.id === device.id && "bg-muted")}>
                            <TableCell className="font-mono text-xs">{device.id}</TableCell>
                            <TableCell className="font-medium">{device.name}</TableCell>
                            <TableCell>{device.model}</TableCell>
                            <TableCell>{device.connectionType}</TableCell>
                            <TableCell>
                               <div className="flex items-center gap-2">
                                  <span className={cn("h-2.5 w-2.5 rounded-full", config.color)}></span>
                                  <span className="text-sm">{config.label}</span>
                               </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {!isLoading && devices.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No devices found. Add a device to get started.
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                 <CardHeader>
                    <CardTitle>Device Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading || !selectedDevice ? (
                        <div className="space-y-6">
                            <div>
                                <Skeleton className="h-5 w-24 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-4/5" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                             <div>
                                <Skeleton className="h-5 w-20 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                             <div>
                                <Skeleton className="h-5 w-16 mb-4" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    ) : (
                       <div className="space-y-6 text-sm">
                            <div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="font-semibold text-muted-foreground">Device Name</div>
                                    <div className="text-right">{selectedDevice.name}</div>
                                    <div className="font-semibold text-muted-foreground">Model</div>
                                    <div className="text-right">{selectedDevice.model}</div>
                                    <div className="font-semibold text-muted-foreground">Serial Number</div>
                                    <div className="text-right">{selectedDevice.serialNumber}</div>
                                    <div className="font-semibold text-muted-foreground">Firmware Version</div>
                                    <div className="text-right">{selectedDevice.firmwareVersion}</div>
                                    <div className="font-semibold text-muted-foreground">Connection</div>
                                    <div className="text-right">{selectedDevice.connectionType}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Mapping</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {selectedDevice.mapping.map(m => (
                                        <React.Fragment key={m.itemCode}>
                                            <div className="text-muted-foreground">{m.itemCode}</div>
                                            <div className="text-right font-mono text-xs">{m.glul}</div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <h4 className="font-semibold mb-2">Logs</h4>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                   <span className={cn("h-2.5 w-2.5 rounded-full", statusConfig[selectedDevice.status].color)}></span>
                                   <span>{selectedDevice.logs[0]}</span>
                                </div>
                            </div>
                       </div>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </MainLayout>
  );
}
