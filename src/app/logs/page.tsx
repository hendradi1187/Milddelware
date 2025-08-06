import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogsPage() {
  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>View system and application logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Log entries will be displayed here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
