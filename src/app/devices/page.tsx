'use client';

import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, TriangleAlert, type LucideIcon } from 'lucide-react';

type DeviceStatus = 'connected' | 'disconnected' | 'error';

interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  lastCommunication: string;
}

const mockDevices: Device[] = [
  { id: 'dev-001', name: 'Hematology Analyzer XL-200', status: 'connected', lastCommunication: '2023-10-27 11:05:12' },
  { id: 'dev-002', name: 'Chemistry Analyzer C-501', status: 'disconnected', lastCommunication: '2023-10-26 18:45:03' },
  { id: 'dev-003', name: 'Immunoassay System I-800', status: 'error', lastCommunication: '2023-10-27 09:15:30' },
];

const statusConfig: Record<
  DeviceStatus,
  {
    label: string;
    icon: LucideIcon;
    badgeClass: string;
  }
> = {
  connected: {
    label: 'Connected',
    icon: Wifi,
    badgeClass: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  },
  disconnected: {
    label: 'Disconnected',
    icon: WifiOff,
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-100',
  },
  error: {
    label: 'Error',
    icon: TriangleAlert,
    badgeClass: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  },
};


export default function DevicesPage() {
  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>Manage and monitor your lab devices.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Communication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDevices.map((device) => {
                const config = statusConfig[device.status];
                const Icon = config.icon;
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>
                       <Badge variant="outline" className={cn('text-xs font-semibold', config.badgeClass)}>
                          <Icon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{device.lastCommunication}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
