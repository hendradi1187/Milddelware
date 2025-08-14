
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
import { CheckCircle, PlusCircle, Save, Trash2, Edit, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testConnection } from '@/ai/flows/instrument-flow';

// Initial Data
const initialMappingData = [
  { id: 1, lisCode: 'GLU-LIS', middlewareCode: 'GLU', instrumentCode: 'GLUC' },
  { id: 2, lisCode: 'HB-LIS', middlewareCode: 'HGB', instrumentCode: 'HGBM' },
  { id: 3, lisCode: 'CHOL-LIS', middlewareCode: 'CHOL', instrumentCode: 'CHOL' },
];

const initialInstrumentLogsData = [
    { id: 1, timestamp: '2023-10-28 10:15:29', direction: 'RX', source: '192.168.1.100:5000', data: 'MSH|^~\\&|...'},
    { id: 2, timestamp: '2023-10-28 10:15:45', direction: 'TX', source: 'Middleware', data: 'ACK|...'},
    { id: 3, timestamp: '2023-10-28 10:16:10', direction: 'RX', source: '192.168.1.100:5000', data: 'OBX|1|NM|...'},
];

interface MappingRow {
    id: number;
    lisCode: string;
    middlewareCode: string;
    instrumentCode: string;
}

interface LogRow {
    id: number;
    timestamp: string;
    direction: string;
    source: string;
    data: string;
}

export default function DevicesPage() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState('');
  
  // State for Connection
  const [ipAddress, setIpAddress] = React.useState('192.168.1.35');
  const [port, setPort] = React.useState('5005');

  // State for Mappings
  const [mappings, setMappings] = React.useState<MappingRow[]>(initialMappingData);
  const [editingMappingId, setEditingMappingId] = React.useState<number | null>(null);
  const [lisCode, setLisCode] = React.useState('');
  const [middlewareCode, setMiddlewareCode] = React.useState('');
  const [instrumentCode, setInstrumentCode] = React.useState('');
  
  // State for Logs
  const [logs, setLogs] = React.useState<LogRow[]>(initialInstrumentLogsData);
  const [logSearch, setLogSearch] = React.useState("");

  const addLogEntry = (message: string, source: string = 'Middleware', direction: 'SYS' | 'RX' | 'TX' = 'SYS') => {
      const newLog: LogRow = {
          id: Date.now(),
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          direction,
          source: source,
          data: message
      };
      setLogs(prev => [newLog, ...prev]);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setIsConnected(null);
    setConnectionStatus('');
    addLogEntry(`Attempting to connect to ${ipAddress}:${port}...`, 'Middleware', 'TX');
    try {
        const response = await testConnection({ ip: ipAddress, port: port });
        setConnectionStatus(response.message);
        setIsConnected(response.success);
        addLogEntry(response.message, `${ipAddress}:${port}`, 'RX');
         toast({
            title: response.success ? "Connection Established" : "Connection Failed",
            description: response.message,
            variant: response.success ? "default" : "destructive",
        });
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setConnectionStatus(`An unexpected error occurred: ${errorMessage}`);
        setIsConnected(false);
        addLogEntry(`Error: ${errorMessage}`, `${ipAddress}:${port}`, 'RX');
        toast({
            title: "Connection Error",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setIsConnected(null);
    setConnectionStatus('');
    addLogEntry(`Testing connection to ${ipAddress}:${port}...`, 'Middleware', 'TX');
    try {
        const response = await testConnection({ ip: ipAddress, port: port });
        setConnectionStatus(response.message);
        setIsConnected(response.success);
        addLogEntry(response.message, `${ipAddress}:${port}`, 'RX');
        toast({
            title: "Connection Test Result",
            description: response.message,
            variant: response.success ? "default" : "destructive",
        });
    } catch (error) {
         console.error(error);
         const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
         setConnectionStatus(`An unexpected error occurred: ${errorMessage}`);
         setIsConnected(false);
         addLogEntry(`Test Error: ${errorMessage}`, `${ipAddress}:${port}`, 'RX');
         toast({
            title: "Connection Test Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsTesting(false);
    }
  }

  const clearEditor = () => {
    setLisCode('');
    setMiddlewareCode('');
    setInstrumentCode('');
    setEditingMappingId(null);
  }
  
  const handleSaveOrUpdateMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if(!lisCode || !middlewareCode || !instrumentCode) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill in all mapping fields.",
        });
        return;
    }

    if(editingMappingId !== null) {
      // Update existing mapping
      const updatedMapping = { id: editingMappingId, lisCode, middlewareCode, instrumentCode };
      setMappings(prev => prev.map(m => m.id === editingMappingId ? updatedMapping : m));
      addLogEntry(`Updated mapping for LIS code: ${lisCode}`);
      toast({
          title: "Mapping Updated",
          description: "Data mapping has been successfully updated.",
      });
    } else {
      // Add new mapping
      const newMapping: MappingRow = {
          id: Date.now(),
          lisCode,
          middlewareCode,
          instrumentCode
      };
      setMappings(prev => [...prev, newMapping]);
      addLogEntry(`Saved new mapping for LIS code: ${lisCode}`);
      toast({
          title: "Mapping Saved",
          description: "New data mapping has been added.",
      });
    }

    clearEditor();
  }

  const handleDeleteMapping = (id: number) => {
      const mappingToDelete = mappings.find(m => m.id === id);
      setMappings(prev => prev.filter(m => m.id !== id));
      addLogEntry(`Deleted mapping for LIS code: ${mappingToDelete?.lisCode}`);
      toast({
          title: "Mapping Deleted",
          description: "The data mapping has been removed.",
      });
  }

  const handleEditMapping = (mapping: MappingRow) => {
    setEditingMappingId(mapping.id);
    setLisCode(mapping.lisCode);
    setMiddlewareCode(mapping.middlewareCode);
    setInstrumentCode(mapping.instrumentCode);
  }
  
  const handleClearLogs = () => {
      setLogs([]);
      toast({
          title: "Logs Cleared",
          description: "All instrument logs have been deleted.",
      });
  }
  
  const filteredLogs = logs.filter(log => log.data.toLowerCase().includes(logSearch.toLowerCase()) || log.source.toLowerCase().includes(logSearch.toLowerCase()));


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
                  <Input id="ip-address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} />
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
                <Button onClick={handleConnect} className="w-full sm:w-auto" disabled={isConnecting || isTesting}>
                    {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleTestConnection} disabled={isConnecting || isTesting}>
                    {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Test Connection
                </Button>
              </div>
              
              {connectionStatus && (
                 <Alert className={isConnected ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
                    {isConnected ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <AlertTitle className={`${isConnected ? 'text-green-800' : 'text-red-800'} font-semibold`}>
                        {isConnected ? 'Connection Successful' : 'Connection Failed'}
                    </AlertTitle>
                    <AlertDescription className={`${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                        {connectionStatus}
                        {!isConnected && (connectionStatus.includes('timed out') || connectionStatus.includes('ECONNREFUSED')) &&
                            <p className="text-xs mt-2">
                                <strong>Troubleshooting Tips:</strong> Ensure the instrument's IP/Port are correct, check for firewall rules or network issues. When testing locally with `npm run dev`, use IP `127.0.0.1`.
                            </p>
                        }
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Instrument Logs</CardTitle>
              <Button variant="outline" onClick={handleClearLogs}>Clear Logs</Button>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="Search logs by data or source..." 
                className="mb-4"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
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
                    {filteredLogs.map((log) => (
                       <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                          <TableCell className="font-mono text-xs font-semibold">{log.direction}</TableCell>
                          <TableCell className="font-mono text-xs">{log.source}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-xs">{log.data}</TableCell>
                      </TableRow>
                    ))}
                    {filteredLogs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">No logs found.</TableCell>
                        </TableRow>
                    )}
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
                    <div className="border rounded-md max-h-[300px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>LIS Code</TableHead>
                                <TableHead>Middleware Code</TableHead>
                                <TableHead>Instrument Code</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mappings.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="font-semibold">{row.lisCode}</TableCell>
                                        <TableCell>{row.middlewareCode}</TableCell>
                                        <TableCell>{row.instrumentCode}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditMapping(row)}>
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteMapping(row.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {mappings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">No mappings defined.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{editingMappingId ? 'Edit Mapping' : 'Add New Mapping'}</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled>Import</Button>
                        <Button variant="outline" disabled>Export</Button>
                    </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveOrUpdateMapping} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="lis-code">LIS Code</Label>
                         <Input id="lis-code" placeholder="e.g., GLU-LIS" value={lisCode} onChange={e => setLisCode(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="middleware-code">Middleware Code</Label>
                         <Input id="middleware-code" placeholder="e.g., GLU" value={middlewareCode} onChange={e => setMiddlewareCode(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instrument-code">Instrument Code</Label>
                        <Input id="instrument-code" placeholder="e.g., GLUC" value={instrumentCode} onChange={e => setInstrumentCode(e.target.value)} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="w-full">
                            {editingMappingId ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            {editingMappingId ? 'Update Mapping' : 'Save New Mapping'}
                        </Button>
                        {editingMappingId && (
                            <Button type="button" variant="outline" className="w-full" onClick={clearEditor}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                  </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
