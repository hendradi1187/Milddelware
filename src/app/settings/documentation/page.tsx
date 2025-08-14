
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, FileText, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentationPage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Dokumentasi & User Manual</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Dokumentasi & User Manual</CardTitle>
                        <CardDescription>Panduan lengkap untuk instalasi, konfigurasi, dan troubleshooting sistem.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertTitle>Konten Dalam Pengembangan</AlertTitle>
                    <AlertDescription>
                        Halaman ini akan berisi seluruh dokumentasi teknis dan panduan pengguna untuk aplikasi LabBridge Medfusion. Anda akan dapat mencari topik tertentu atau mengunduh manual lengkap dalam format PDF.
                        <div className="mt-4">
                            <Button disabled>
                                <Download className="mr-2 h-4 w-4" />
                                Unduh Manual (Segera Hadir)
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </MainLayout>
  );
}
