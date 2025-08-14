
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronRight, Database, Wifi, WifiOff, FileClock, TestTube, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DatabaseManagementPage() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [pendingSyncCount, setPendingSyncCount] = React.useState(0);

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Database Management</span>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration Column */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Central Database Configuration (Online)</CardTitle>
                    <CardDescription>Configure the connection to your main PostgreSQL or MySQL server.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="db-type">Database Type</Label>
                            <Select defaultValue="postgresql">
                                <SelectTrigger id="db-type">
                                    <SelectValue placeholder="Select database type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="db-host">Host</Label>
                            <Input id="db-host" defaultValue="127.0.0.1" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="db-port">Port</Label>
                            <Input id="db-port" type="number" defaultValue="5432" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="db-user">Username</Label>
                            <Input id="db-user" defaultValue="admin" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="db-password">Password</Label>
                            <Input id="db-password" type="password" defaultValue="password123" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="db-name">Database Name</Label>
                            <Input id="db-name" defaultValue="medfusion_lis" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Local Cache (Offline)</CardTitle>
                    <CardDescription>Data is stored locally in an SQLite database when the central server is unavailable.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-start p-4 bg-muted/50 rounded-lg">
                        <Database className="h-6 w-6 mr-4 mt-1 text-primary"/>
                        <div>
                            <p className="font-semibold">SQLite Database</p>
                            <p className="text-sm text-muted-foreground">Used for offline data storage and caching.</p>
                            <p className="text-xs font-mono bg-muted mt-2 p-2 rounded-md">/var/lib/lab-medfusion/cache.db</p>
                        </div>
                   </div>
                </CardContent>
            </Card>
        </div>

        {/* Status & Actions Column */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-md border" >
                        <div className="flex items-center gap-2">
                             <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", isOnline ? 'bg-green-500' : 'bg-red-500')}></span>
                            <Label htmlFor="connection-switch" className="font-semibold">
                               {isOnline ? 'Online' : 'Offline'}
                            </Label>
                        </div>
                        <Switch id="connection-switch" checked={isOnline} onCheckedChange={setIsOnline} />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Toggle to simulate online/offline connection status.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Synchronization</CardTitle>
                </CardHeader>
                <CardContent>
                     <Alert variant={pendingSyncCount > 0 ? "destructive" : "default"} className={cn(!isOnline && "bg-yellow-50 text-yellow-800 border-yellow-200")}>
                        {isOnline ? (pendingSyncCount > 0 ? <TestTube className="h-4 w-4" /> : <Wifi className="h-4 w-4" />) : <WifiOff className="h-4 w-4" />}
                        
                        <AlertTitle>{isOnline ? 'Ready to Sync' : 'Connection Offline'}</AlertTitle>
                        <AlertDescription>
                          {isOnline ? 
                            `${pendingSyncCount} results pending synchronization.` :
                            "Data is being saved locally. Sync will resume when connection is restored."
                          }
                        </AlertDescription>
                    </Alert>
                    <div className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
                        <FileClock className="h-3.5 w-3.5"/>
                        <span>Last sync: Today at {new Date().toLocaleTimeString()}</span>
                    </div>
                </CardContent>
            </Card>
            <div className="flex gap-2">
                <Button variant="outline" className="w-full">Test Connection</Button>
                <Button className="w-full"><Save className="mr-2 h-4 w-4"/> Save Configuration</Button>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
