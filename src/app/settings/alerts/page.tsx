
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Bell, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AlertsPage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Alert & Notification System</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Alert & Notification System</CardTitle>
                            <CardDescription>Configure real-time alerts for important system events.</CardDescription>
                        </div>
                    </div>
                     <Button disabled>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add New Alert Rule
                     </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Feature Under Development</AlertTitle>
                    <AlertDescription>
                        The alert configuration interface is currently under development. This section will allow you to define rules for sending notifications via pop-up, email, or other channels when specific events occur.
                        <br/><br/>
                        <p className="font-semibold">Example Scenarios:</p>
                        <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                            <li>IF a `Device` status changes to `Offline` THEN send an `Email` to the `Admin` group.</li>
                            <li>IF `Pending Results` is `> 20` for more than `15 minutes` THEN show a `Pop-up` to all `Technician` users.</li>
                            <li>IF a `Result` is flagged as `High-Critical` THEN send a `WhatsApp` notification to the on-call doctor.</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </MainLayout>
  );
}
