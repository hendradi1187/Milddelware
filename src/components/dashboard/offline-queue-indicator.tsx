import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseZap } from 'lucide-react';

export function OfflineQueueIndicator({ count }: { count: number }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Offline Queue</CardTitle>
        <DatabaseZap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">Pending results to be sent</p>
      </CardContent>
    </Card>
  );
}
