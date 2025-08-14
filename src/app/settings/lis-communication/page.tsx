
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronRight, ArrowRightLeft, TestTube, Save, VenetianMask } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LISCommunicationPage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">LIS & SATUSEHAT Communication</span>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration Column */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <ArrowRightLeft className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>LIS & SATUSEHAT Integration</CardTitle>
                            <CardDescription>Configure the connection to the Laboratory Information System (LIS) and the SATUSEHAT platform.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="lis-endpoint">LIS Endpoint URL</Label>
                        <Input id="lis-endpoint" placeholder="https://lis.rumahsakit.com/api/v1/results" />
                        <p className="text-xs text-muted-foreground mt-1 px-1">The API endpoint provided by your LIS vendor for receiving results.</p>
                    </div>
                     <div>
                        <Label htmlFor="satusehat-token">SATUSEHAT API Token</Label>
                        <Input id="satusehat-token" type="password" placeholder="••••••••••••••••••••••••••••••••••" />
                         <p className="text-xs text-muted-foreground mt-1 px-1">Your organization's API token for the SATUSEHAT platform.</p>
                    </div>
                    <div>
                        <Label htmlFor="integration-method">Integration Method</Label>
                        <Select>
                            <SelectTrigger id="integration-method">
                                <SelectValue placeholder="Select integration method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">Push Automatically</SelectItem>
                                <SelectItem value="manual">Push Manually</SelectItem>
                            </SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground mt-1 px-1">Choose whether results are sent automatically upon validation or manually from the Results page.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Actions Column */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Button variant="outline" disabled><TestTube className="mr-2 h-4 w-4"/> Test Connection</Button>
                    <Button disabled><Save className="mr-2 h-4 w-4"/> Save Configuration</Button>
                </CardContent>
            </Card>
            <Alert>
                <VenetianMask className="h-4 w-4" />
                <AlertTitle>Supported Protocols</AlertTitle>
                <AlertDescription>
                    This module currently supports REST API integration. Support for standard protocols like HL7 and ASTM will be added in future updates.
                </AlertDescription>
            </Alert>
        </div>
      </div>
    </MainLayout>
  );
}
