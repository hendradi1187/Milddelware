'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, TriangleAlert, type LucideIcon, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type DeviceStatus = 'connected' | 'disconnected' | 'error';

interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  lastCommunication: string;
}

const mockDevices: Device[] = [
  { id: 'dev-001', name: 'Hematology Analyzer XL-200', type: 'Hematology', status: 'connected', lastCommunication: '2023-10-27 11:05:12' },
  { id: 'dev-002', name: 'Chemistry Analyzer C-501', type: 'Chemistry', status: 'disconnected', lastCommunication: '2023-10-26 18:45:03' },
  { id: 'dev-003', name: 'Immunoassay System I-800', type: 'Immunoassay', status: 'error', lastCommunication: '2023-10-27 09:15:30' },
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
  const { toast } = useToast();
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setDevices(mockDevices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // In a real app, you would refetch from Firestore here
      toast({ title: "Success", description: "Device list refreshed." });
      setIsRefreshing(false);
    }, 1500);
  };

  const handleAddDevice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDevice: Device = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      status: 'disconnected', // Default status
      lastCommunication: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setDevices(prev => [...prev, newDevice]);
    toast({ title: "Success", description: "Device added successfully." });
    // Close dialog after submission - requires managing dialog open state
  };


  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Devices</CardTitle>
              <CardDescription>Manage and monitor your lab devices.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Device</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new device to add it to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDevice}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id" className="text-right">Device ID</Label>
                        <Input id="id" name="id" className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Input id="type" name="type" className="col-span-3" required/>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Device</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Communication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-36 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : devices.map((device) => {
                const config = statusConfig[device.status];
                const Icon = config.icon;
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-mono text-xs">{device.id}</TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
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
