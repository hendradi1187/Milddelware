
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

const dataMappingData = [
  { lisCode: 'GLU-LIS', middlewareCode: 'GLU', instrumentCode: 'GLUC' },
  { lisCode: 'HB-LIS', middlewareCode: 'HGB', instrumentCode: 'HGBM' },
  { lisCode: 'CHOL-LIS', middlewareCode: 'CHOL', instrumentCode: 'CHOL' },
];

const instrumentLogsData = [
    { timestamp: '2023-10-28 10:15:29', direction: 'RX', source: '192.168.1.100:5000', data: 'MSH|^~\\&|...'},
    { timestamp: '2023-10-28 10:15:45', direction: 'TX', source: 'Middleware', data: 'ACK|...'},
    { timestamp: '2023-10-28 10:16:10', direction: 'RX', source: '192.168.1.100:5000', data: 'OBX|1|NM|...'},
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
              <RadioGroup defaultValue="server" className="flex gap-4">
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
                  <Input id="ip-address" defaultValue="127.0.0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" defaultValue="5005" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input id="timeout" defaultValue="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry-interval">Retry Interval (ms)</Label>
                  <Input id="retry-interval" defaultValue="1000" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setIsConnected(true)} className="w-full sm:w-auto">
                    Connect
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                    Test Connection
                </Button>
              </div>
              
              {isConnected && (
                <Alert className="border-green-300 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700 font-semibold">Connected</AlertTitle>
                    <AlertDescription className="text-green-600">
                        Successfully connected to 127.0.0.1:5005
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Instrument Logs</CardTitle>
              <Button variant="outline">Clear Logs</Button>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search logs by data payload..." className="mb-4" />
              <div className="border rounded-md max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">Timestamp</TableHead>
                      <TableHead className="w-[50px]">Dir</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Raw Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instrumentLogsData.map((log, index) => (
                       <TableRow key={index}>
                          <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                          <TableCell className="font-mono text-xs">{log.direction}</TableCell>
                          <TableCell className="font-mono text-xs">{log.source}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-xs">{log.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                    <div className="border rounded-md">
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
                                        <TableCell className="font-semibold">{row.lisCode}</TableCell>
                                        <TableCell>{row.middlewareCode}</TableCell>
                                        <TableCell>{row.instrumentCode}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Mapping Editor</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline">Import</Button>
                        <Button variant="outline">Export</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lis-code">LIS Code</Label>
                             <Input id="lis-code" placeholder="e.g., GLU-LIS" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="middleware-code">Middleware Code</Label>
                             <Input id="middleware-code" placeholder="e.g., GLU" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="instrument-code">Instrument Code</Label>
                            <Input id="instrument-code" placeholder="e.g., GLUC" />
                        </div>
                    </div>
                    <Button className="w-full">Save Mapping</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
