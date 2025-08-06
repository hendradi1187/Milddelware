import { MainLayout } from '@/components/main-layout';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';

export default function ResultsPage() {
  return (
    <MainLayout>
      <LabResultsTable />
    </MainLayout>
  );
}
