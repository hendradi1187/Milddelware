
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, CloudCog, Database, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function OnlineOfflinePage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Online/Offline Capability</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <CloudCog className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Online/Offline Capability</CardTitle>
                        <CardDescription>Ensuring the system remains operational even without an internet connection.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <Alert>
                    <AlertTitle className="font-semibold">Automatic Feature - No Configuration Needed</AlertTitle>
                    <AlertDescription>
                        <p className="mb-4">
                            This is a core feature of the LabBridge Medfusion system and is always active. You do not need to configure anything manually. The system intelligently detects the network status and adjusts its behavior accordingly.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Wifi className="h-5 w-5 text-green-600" />
                                    <h4 className="font-semibold">Online Mode</h4>
                                </div>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li>Data is sent directly to the central server (PostgreSQL/MySQL).</li>
                                    <li>Any data stored locally during an offline period is automatically synchronized.</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <WifiOff className="h-5 w-5 text-red-600" />
                                    <h4 className="font-semibold">Offline Mode</h4>
                                </div>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                     <li>If the central server is unreachable, data is securely stored in a local SQLite database.</li>
                                     <li>The system will periodically try to reconnect.</li>
                                     <li>Once the connection is restored, all pending data is sent to the server.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg">
                            <Database className="h-5 w-5 text-primary"/>
                            <p className="text-sm text-muted-foreground">Ensure the local machine has sufficient disk space for temporary data storage during extended offline periods.</p>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </MainLayout>
  );
}
