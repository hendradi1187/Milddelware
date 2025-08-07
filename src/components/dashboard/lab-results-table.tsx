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
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type LabResultStatus = 'Pending' | 'Sent' | 'Failed' | 'QC';

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
    { patientId: 'QC-01', name: 'QC Level 1', testCode: 'HGB', result: '14.5', unit: 'g/dL', timestamp: '2023-10-27 10:35', status: 'QC' },
    { patientId: 'P004', name: 'Emily White', testCode: 'WBC', result: '7.2', unit: 'x10³/µL', timestamp: '2023-10-27 10:38', status: 'Failed' },
    { patientId: 'P005', name: 'Michael Green', testCode: 'PLT', result: '250', unit: 'x10³/µL', timestamp: '2023-10-27 10:40', status: 'Pending' },
    // Add more data for pagination testing
    ...Array.from({ length: 30 }, (_, i) => ({
      patientId: `P${String(i + 6).padStart(3, '0')}`,
      name: `Person ${i + 6}`,
      testCode: ['GLU', 'CHOL', 'HGB', 'WBC', 'PLT'][i % 5],
      result: String(Math.floor(Math.random() * 200) + 50),
      unit: 'mg/dL',
      timestamp: `2023-10-28 ${String(10 + Math.floor(i/6)).padStart(2, '0')}:${String((i*10)%60).padStart(2,'0')}`,
      status: (['Sent', 'Pending', 'Failed', 'QC'] as LabResultStatus[])[i % 4],
    })),
];

const statusBadgeConfig: Record<LabResultStatus, string> = {
    Sent: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    Failed: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    QC: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100',
};

const RESULTS_PER_PAGE = 25;

export function LabResultsTable({ statusFilter, searchQuery }: { statusFilter: string, searchQuery: string }) {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as LabResultStatus | null;
  
  const [results, setResults] = React.useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  React.useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredResults = React.useMemo(() => {
    let filtered = results;
    const currentStatusFilter = initialStatus || statusFilter;

    if (currentStatusFilter && currentStatusFilter !== 'All') {
      filtered = filtered.filter(result => result.status === currentStatusFilter);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        result =>
          result.patientId.toLowerCase().includes(lowercasedQuery) ||
          result.testCode.toLowerCase().includes(lowercasedQuery)
      );
    }
    return filtered;
  }, [results, statusFilter, searchQuery, initialStatus]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div className="space-y-4">
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
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
            ) : paginatedResults.map((result, index) => (
              <TableRow key={`${result.patientId}-${index}`}>
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
             {paginatedResults.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
}
