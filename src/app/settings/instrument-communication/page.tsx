
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Network, CircuitBoard, ListChecks } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function InstrumentCommunicationPage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Instrument Communication</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <Network className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Instrument Communication Module</CardTitle>
                        <CardDescription>Manages the connection between the middleware and laboratory instruments.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold">Fungsi Utama</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Menghubungkan middleware dengan instrumen lab (analizer) menggunakan koneksi TCP/IP atau Serial.</li>
                        <li>Mendukung mode komunikasi <span className="font-semibold text-foreground">uni-directional</span> (hanya menerima data dari instrumen).</li>
                        <li>Mendukung mode komunikasi <span className="font-semibold text-foreground">bi-directional</span> (mengirim dan menerima data, contoh: mengirim permintaan ke instrumen).</li>
                    </ul>
                </div>
                
                 <Alert>
                    <ListChecks className="h-4 w-4" />
                    <AlertTitle>Cara Penggunaan</AlertTitle>
                    <AlertDescription>
                       <div className="space-y-4">
                            <p>
                                Semua konfigurasi koneksi instrumen dilakukan saat Anda menambahkan perangkat baru ke dalam sistem.
                            </p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Buka halaman <span className="font-semibold text-foreground">Devices</span>.</li>
                                <li>Klik tombol <span className="font-semibold text-foreground">Add Device</span> untuk memulai wizard.</li>
                                <li>Pada langkah 'Connection', pilih tipe koneksi (TCP/IP atau Serial) dan isi detail yang diperlukan seperti IP Address, Port, Baud Rate, Parity, dll.</li>
                                <li>Gunakan tombol 'Test Connection' (fitur mendatang) untuk memvalidasi koneksi sebelum menyimpan.</li>
                            </ol>
                            <Button asChild className="mt-2">
                                <Link href="/devices">
                                    <CircuitBoard className="mr-2 h-4 w-4"/>
                                    Go to Devices Page
                                </Link>
                            </Button>
                       </div>
                    </AlertDescription>
                </Alert>

            </CardContent>
        </Card>
    </MainLayout>
  );
}
