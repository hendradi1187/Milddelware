'use client';
import React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Database,
  Network,
  ArrowRightLeft,
  CloudCog,
  SlidersHorizontal,
  GitFork,
  AlertCircle,
  Bell,
  FileText,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
}

const systemModules: Module[] = [
    {
        id: 'auth',
        title: 'Authentication & Authorization',
        description: 'User management and role-based access control.',
        icon: ShieldCheck,
        href: '/settings/user-management'
    },
    {
        id: 'database',
        title: 'Database Management',
        description: 'PostgreSQL/MySQL for server, SQLite for offline',
        icon: Database,
        href: '/settings/database-management'
    },
    {
        id: 'instrument-comm',
        title: 'Komunikasi Instrumen',
        description: 'Mudah integrasi TCP/IP ticom',
        icon: Network,
        href: '/settings/instrument-communication'
    },
     {
        id: 'lis-comm',
        title: 'Komunikasi LIS & SATUSEHAT',
        description: 'Mudah integrasi SPI',
        icon: ArrowRightLeft,
        href: '/settings/lis-communication'
    },
    {
        id: 'mapping',
        title: 'Data Mapping Engine',
        description: 'Mapping kode pemeriksaan → kode SATUSEHAT',
        icon: GitFork,
        href: '/settings/data-mapping'
    },
    {
        id: 'offline',
        title: 'Online/Offline Capability',
        description: 'System automatically saves data locally when offline and syncs when reconnected.',
        icon: CloudCog,
        href: '/settings/online-offline'
    },
    {
        id: 'business-logic',
        title: 'Business Logic Layer',
        description: 'Rules and decision-making processes',
        icon: SlidersHorizontal,
        href: '/settings/business-logic'
    },
    {
        id: 'alerts',
        title: 'Alert & Notification System',
        description: 'Error, pending, sukses',
        icon: Bell,
        href: '/settings/alerts'
    },
    {
        id: 'logging',
        title: 'Logging & Monitoring',
        description: 'Status koneksi, error, riwayat',
        icon: AlertCircle,
        href: '/logs'
    },
    {
        id: 'docs',
        title: 'Dokumentasi & User Manual',
        description: 'Dokumentasi & User Manual',
        icon: FileText,
        href: '/settings/documentation'
    }
];


export default function SettingsPage() {

  const renderModuleCard = (module: Module) => {
    const Icon = module.icon;
    const cardContent = (
      <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors h-full">
         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Icon className="h-6 w-6" />
         </div>
         <div className="flex flex-col">
              <h3 className="font-semibold text-base text-card-foreground">{module.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2 flex-grow">{module.description}</p>
              <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">Enabled</Badge>
         </div>
      </div>
    );

    if (module.href) {
      return <Link href={module.href} className="flex flex-col">{cardContent}</Link>;
    }
    return <div className="flex flex-col cursor-not-allowed opacity-60">{cardContent}</div>;
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">System Architecture</CardTitle>
                <CardDescription>Diagram of interaction between middleware modules.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-muted/20">
                    <Image
                        src="/images/system-architecture.png"
                        alt="System Architecture Diagram"
                        width={1200}
                        height={600}
                        className="rounded-md"
                    />
                </div>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">System Modules</CardTitle>
            <CardDescription>Click on a module to view its details and configuration.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {systemModules.map((module) => (
                  <React.Fragment key={module.id}>
                    {renderModuleCard(module)}
                  </React.Fragment>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
