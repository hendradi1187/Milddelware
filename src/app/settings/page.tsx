'use client';
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
import * as React from 'react';

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
}

const systemModules: Module[] = [
    {
        title: 'Authentication & Authorization',
        description: 'User management and access control',
        icon: ShieldCheck
    },
    {
        title: 'Data Mapping Engine',
        description: 'Mapping kode pemeriksaan → kode SATUSEHAT',
        icon: GitFork
    },
    {
        title: 'Database Management',
        description: 'PostgreSQL/MySQL for server, SQLite for offline',
        icon: Database
    },
    {
        title: 'Online/Offline Capability',
        description: 'Firebase RTDB + local cache SQLite',
        icon: CloudCog
    },
    {
        title: 'Komunikasi Instrumen',
        description: 'Mudah integrasi TCP/IP ticom',
        icon: Network
    },
    {
        title: 'Business Logic Layer',
        description: 'Rules and decision-making processes',
        icon: SlidersHorizontal
    },
    {
        title: 'Komunikasi LIS & SATUSEHAT',
        description: 'Mudah integrasi SPI',
        icon: ArrowRightLeft
    },
    {
        title: 'Logging & Monitoring',
        description: 'Status koneksi, error, riwayat',
        icon: AlertCircle
    },
    {
        title: 'Alert & Notification System',
        description: 'Error, pending, sukses',
        icon: Bell
    },
    {
        title: 'Dokumentasi & User Manual',
        description: 'Dokumentasi & User Manual',
        icon: FileText
    }
];


export default function SettingsPage() {

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">System Modules</CardTitle>
            <CardDescription>Overview of all integrated middleware system modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
                {systemModules.map((module, index) => {
                    const Icon = module.icon;
                    return (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                                <Icon className="h-6 w-6" />
                           </div>
                           <div className="flex flex-col">
                                <h3 className="font-semibold text-base text-card-foreground">{module.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-2">{module.description}</p>
                                <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">Enabled</Badge>
                           </div>
                        </div>
                    );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
