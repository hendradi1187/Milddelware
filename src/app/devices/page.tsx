
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const dataMappingData = [
  { lisCode: 'GLU', middlewareCode: 'GLU', instrumentCode: 'GLUC' },
  { lisCode: 'CHOL', middlewareCode: 'CHOL', instrumentCode: 'CHLM' },
  { lisCode: 'HGB', middlewareCode: 'HGB', instrumentCode: 'HGBM' },
  { lisCode: 'WBC', middlewareCode: 'WBC', instrumentCode: 'WBCC' },
];

const instrumentLogsData = [
    { timestamp: '2025-06-14 10:15:29', direction: 'TX', source: '192.168.1.50:4000', destination: 'N0015'},
    { timestamp: '2025-08-14 10:15:45', direction: 'TX', source: '192.168.1.100:5000', destination: 'SJ 606'},
    { timestamp: '2025-08-14 10:16:10', direction: 'RX', source: '192.168.1.100:5000', destination: 'SJ 456'},
];

export default function DevicesPage() {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instrument Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup defaultValue="server">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client">TCP/IP Mode Client</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="server" id="server" />
                  <Label htmlFor="server">TCP/IP Mode Server</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input id="ip-address" defaultValue="192.168.1.100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" defaultValue="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout</Label>
                  <Input id="timeout" defaultValue="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry-interval">Retry Interval</Label>
                  <Input id="retry-interval" defaultValue="1000" />
                </div>
              </div>
              
              <Button onClick={() => setIsConnected(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                Connect
              </Button>
              
              {isConnected && (
                <Alert className="bg-muted/50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600 font-semibold">Connected</AlertTitle>
                    <AlertDescription>
                        Connected to 192.168.1.100:5000
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instrument Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search logs" className="mb-4" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrumentLogsData.map((log, index) => (
                     <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                        <TableCell className="font-mono text-xs">{log.direction}</TableCell>
                        <TableCell className="font-mono text-xs">{log.source}</TableCell>
                        <TableCell className="font-mono text-xs">{log.destination}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>LIS Code</TableHead>
                            <TableHead>Middleware Code</TableHead>
                            <TableHead>Instrument Code</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataMappingData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.lisCode}</TableCell>
                                    <TableCell>{row.middlewareCode}</TableCell>
                                    <TableCell>{row.instrumentCode}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Mapping Editor</CardTitle>
                    <Button variant="outline">Add Mapping</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lis-code">LIS Code</Label>
                            <Select defaultValue="glu">
                                <SelectTrigger id="lis-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="glu">GLU</SelectItem>
                                    <SelectItem value="chol">CHOL</SelectItem>
                                    <SelectItem value="hgb">HGB</SelectItem>
                                    <SelectItem value="wbc">WBC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="middleware-code">Middleware Code</Label>
                             <Select defaultValue="gluc">
                                <SelectTrigger id="middleware-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gluc">GLUC</SelectItem>
                                    <SelectItem value="chlm">CHLM</SelectItem>
                                    <SelectItem value="hgbm">HGBM</SelectItem>
                                    <SelectItem value="wbcc">WBCC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instrument-code">Instrument Code</Label>
                        <Select defaultValue="it3">
                                <SelectTrigger id="instrument-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="it3">IT3</SelectItem>
                                    <SelectItem value="it4">IT4</SelectItem>
                                </SelectContent>
                            </Select>
                    </div>
                    <Button className="w-full">Save Mapping</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Instrument Logs</CardTitle>
                    <Button variant="outline">Clear Logs</Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Dest.</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
