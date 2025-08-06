import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DevicesPage() {
  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>Manage and monitor your lab devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Device listing will be implemented here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
