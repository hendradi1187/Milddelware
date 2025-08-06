import { MainLayout } from '@/components/main-layout';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResultsPage() {
  return (
    <MainLayout>
       <Card>
        <CardHeader>
          <CardTitle>Lab Results</CardTitle>
          <CardDescription>Browse and filter all lab results.</CardDescription>
        </CardHeader>
        <CardContent>
          <LabResultsTable />
        </CardContent>
      </Card>
    </MainLayout>
  );
}