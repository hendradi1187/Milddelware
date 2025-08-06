import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceStatus = 'connected' | 'disconnected' | 'error';

const statusConfig: Record<
  DeviceStatus,
  {
    label: string;
    icon: LucideIcon;
    badgeClass: string;
    iconClass: string;
  }
> = {
  connected: {
    label: 'Connected',
    icon: Wifi,
    badgeClass: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    iconClass: 'text-green-500',
  },
  disconnected: {
    label: 'Disconnected',
    icon: WifiOff,
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-100',
    iconClass: 'text-stone-500',
  },
  error: {
    label: 'Error',
    icon: TriangleAlert,
    badgeClass: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    iconClass: 'text-red-500',
  },
};

interface DeviceStatusCardProps {
  name: string;
  status: DeviceStatus;
}

export function DeviceStatusCard({ name, status }: DeviceStatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Icon className={cn('h-4 w-4 text-muted-foreground', config.iconClass)} />
      </CardHeader>
      <CardContent>
        <Badge variant="outline" className={cn('text-xs font-semibold', config.badgeClass)}>
          {config.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
