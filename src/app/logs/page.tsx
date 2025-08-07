'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type LogSeverity = 'Info' | 'Warning' | 'Error';

interface LogEntry {
  id: string;
  timestamp: string;
  module: string;
  message: string;
  severity: LogSeverity;
}

const mockLogs: LogEntry[] = [
  { id: 'log-1', timestamp: '2023-10-27 11:05:12', module: 'HL7-Receiver', message: 'Received new result batch from XL-200', severity: 'Info' },
  { id: 'log-2', timestamp: '2023-10-27 11:05:10', module: 'LIS-Dispatcher', message: 'Successfully sent batch #123 to LIS', severity: 'Info' },
  { id: 'log-3', timestamp: '2023-10-27 10:38:05', module: 'LIS-Dispatcher', message: 'Failed to dispatch result P004: Connection timed out', severity: 'Error' },
  { id: 'log-4', timestamp: '2023-10-27 09:15:30', module: 'Device-Poller', message: 'No response from Immunoassay System I-800', severity: 'Warning' },
];

const severityConfig: Record<LogSeverity, string> = {
  Info: 'bg-blue-100 text-blue-800 border-blue-200',
  Warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Error: 'bg-red-100 text-red-800 border-red-200',
};


export default function LogsPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [severityFilter, setSeverityFilter] = React.useState<LogSeverity | 'All'>('All');

  React.useEffect(() => {
    // Simulate fetching and real-time updates
    setIsLoading(true);
    const timer = setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 1000);

    // In a real app, you'd set up a Firestore snapshot listener here.
    // The listener would update the `logs` state in real-time.

    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = logs.filter(
    (log) => severityFilter === 'All' || log.severity === severityFilter
  );

  return (
    <MainLayout>
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Logs</CardTitle>
                <CardDescription>View system and application logs.</CardDescription>
              </div>
              <div className="w-[180px]">
                <Select value={severityFilter} onValueChange={(value: LogSeverity | 'All') => setSeverityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Severities</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Timestamp</TableHead>
                <TableHead className="w-[150px]">Module</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right w-[120px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn("capitalize", severityConfig[log.severity])}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No logs found for the selected severity.
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
