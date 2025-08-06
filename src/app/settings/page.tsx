import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage application settings and user roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings form will be implemented here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
