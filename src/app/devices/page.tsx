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
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

type DeviceStatus = 'connected' | 'disconnected' | 'error';

interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  lastCommunication: string;
}

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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const fetchDevices = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'devices'));
      const devicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const lastComm = data.lastCommunication instanceof Timestamp 
          ? data.lastCommunication.toDate() 
          : new Date();
        
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          status: data.status,
          lastCommunication: lastComm.toLocaleString(),
        };
      }) as Device[];
      setDevices(devicesData);
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch devices from Firestore.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  

  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDevices();
    toast({ title: "Success", description: "Device list refreshed." });
    setIsRefreshing(false);
  };

  const handleAddDevice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDevice = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      status: 'disconnected', // Default status
      lastCommunication: serverTimestamp(),
    };
    
    try {
      // In a real app, you would probably want to use the ID field from the form as the document ID
      // For simplicity, we'll let firestore auto-generate an ID
      await addDoc(collection(db, "devices"), newDevice);
      toast({ title: "Success", description: "Device added successfully." });
      setIsDialogOpen(false); // Close dialog
      await fetchDevices(); // Refresh list
    } catch(error) {
       console.error("Error adding device:", error);
       toast({ variant: 'destructive', title: 'Error', description: 'Could not add device.' });
    }
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
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing || isLoading}>
                <RefreshCw className={cn("mr-2 h-4 w-4", (isRefreshing || isLoading) && "animate-spin")} />
                Refresh
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                       <Badge variant="outline" className={cn('text-xs font-semibold border-2', config.badgeClass)}>
                          <Icon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{device.lastCommunication}</TableCell>
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
    </MainLayout>
  );
}
