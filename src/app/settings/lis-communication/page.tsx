
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronRight, ArrowRightLeft, TestTube, Save, VenetianMask, Building, Cloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
                    {/* LIS Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-muted-foreground"/>
                            <h3 className="text-lg font-semibold">LIS Configuration</h3>
                        </div>
                        <div>
                            <Label htmlFor="lis-endpoint">LIS Endpoint URL</Label>
                            <Input id="lis-endpoint" placeholder="https://lis.rumahsakit.com/api/v1/results" />
                            <p className="text-xs text-muted-foreground mt-1 px-1">The API endpoint provided by your LIS vendor for receiving results.</p>
                        </div>
                         <div>
                            <Label htmlFor="integration-method">Integration Method to LIS</Label>
                            <Select>
                                <SelectTrigger id="integration-method">
                                    <SelectValue placeholder="Select integration method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auto">Push Automatically</SelectItem>
                                    <SelectItem value="manual">Push Manually</SelectItem>
                                </SelectContent>
                            </Select>
                             <p className="text-xs text-muted-foreground mt-1 px-1">Choose whether results are sent automatically upon validation or manually.</p>
                        </div>
                    </div>

                    <Separator />

                    {/* SATUSEHAT Configuration */}
                    <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <Cloud className="h-5 w-5 text-muted-foreground"/>
                            <h3 className="text-lg font-semibold">SATUSEHAT Configuration</h3>
                        </div>
                         <div>
                            <Label htmlFor="satusehat-url">SATUSEHAT Base URL</Label>
                            <Input id="satusehat-url" placeholder="https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1" />
                            <p className="text-xs text-muted-foreground mt-1 px-1">The base FHIR API URL provided by SATUSEHAT.</p>
                        </div>
                         <div>
                            <Label htmlFor="satusehat-token">SATUSEHAT Auth Token</Label>
                            <Input id="satusehat-token" type="password" placeholder="••••••••••••••••••••••••••••••••••" />
                             <p className="text-xs text-muted-foreground mt-1 px-1">Your organization's access token for the SATUSEHAT platform.</p>
                        </div>
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
                    <Button variant="outline" disabled><TestTube className="mr-2 h-4 w-4"/> Test Connections</Button>
                    <Button disabled><Save className="mr-2 h-4 w-4"/> Save Configurations</Button>
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
