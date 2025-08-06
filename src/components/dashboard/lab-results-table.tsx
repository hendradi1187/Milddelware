'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LabResultStatus = 'Pending' | 'Sent' | 'Failed';

interface LabResult {
  patientId: string;
  name: string;
  testCode: string;
  result: string;
  unit: string;
  timestamp: string;
  status: LabResultStatus;
}

const mockResults: LabResult[] = [
  { patientId: 'P001', name: 'John Doe', testCode: 'GLU', result: '105', unit: 'mg/dL', timestamp: '2023-10-27 10:30', status: 'Sent' },
  { patientId: 'P002', name: 'Jane Smith', testCode: 'CHOL', result: '190', unit: 'mg/dL', timestamp: '2023-10-27 10:32', status: 'Sent' },
  { patientId: 'P003', name: 'Robert Brown', testCode: 'HGB', result: '14.5', unit: 'g/dL', timestamp: '2023-10-27 10:35', status: 'Pending' },
  { patientId: 'P004', name: 'Emily White', testCode: 'WBC', result: '7.2', unit: 'x10³/µL', timestamp: '2023-10-27 10:38', status: 'Failed' },
  { patientId: 'P005', name: 'Michael Green', testCode: 'PLT', result: '250', unit: 'x10³/µL', timestamp: '2023-10-27 10:40', status: 'Sent' },
  { patientId: 'P006', name: 'Sarah Black', testCode: 'CREA', result: '0.9', unit: 'mg/dL', timestamp: '2023-10-27 10:42', status: 'Pending' },
  { patientId: 'P007', name: 'David King', testCode: 'K', result: '4.1', unit: 'mEq/L', timestamp: '2023-10-27 10:45', status: 'Sent' },
];

const statusBadgeConfig: Record<LabResultStatus, string> = {
    Sent: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    Failed: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
};

export function LabResultsTable() {
  const [statusFilter, setStatusFilter] = React.useState<LabResultStatus | 'All'>('All');

  const filteredResults = mockResults.filter(
    (result) => statusFilter === 'All' || result.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={(value: LabResultStatus | 'All') => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
       <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="hidden lg:table-cell">Unit</TableHead>
              <TableHead className="hidden md:table-cell">Timestamp</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result.patientId}>
                <TableCell className="font-medium">{result.patientId}</TableCell>
                <TableCell>{result.testCode}</TableCell>
                <TableCell className="font-semibold">{result.result}</TableCell>
                <TableCell className="hidden lg:table-cell">{result.unit}</TableCell>
                <TableCell className="hidden md:table-cell">{result.timestamp}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={cn("text-xs capitalize font-normal", statusBadgeConfig[result.status])}>
                    {result.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
             {filteredResults.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}