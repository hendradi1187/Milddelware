import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Lab Results</CardTitle>
        <CardDescription>Displaying the latest results from connected devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="hidden lg:table-cell">Unit</TableHead>
              <TableHead className="hidden md:table-cell">Timestamp</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockResults.map((result) => (
              <TableRow key={result.patientId}>
                <TableCell className="font-medium">{result.patientId}</TableCell>
                <TableCell className="hidden md:table-cell">{result.name}</TableCell>
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
