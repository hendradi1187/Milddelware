
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronRight, PlusCircle, Save, Trash2, GitFork } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MappingRow {
  id: number;
  instrumentCode: string;
  lisCode: string;
  satusehatCode: string;
}

const initialMappings: Record<string, MappingRow[]> = {
    'DEV-001': [
        { id: 1, instrumentCode: 'GLU', lisCode: 'GLU', satusehatCode: '2345-7' },
        { id: 2, instrumentCode: 'CHOL', lisCode: 'CHOL', satusehatCode: '2093-3' },
    ],
    'DEV-002': [
        { id: 1, instrumentCode: 'WBC', lisCode: 'WBC', satusehatCode: '6690-2' },
        { id: 2, instrumentCode: 'RBC', lisCode: 'RBC', satusehatCode: '789-8' },
    ]
};

const mockDevices = [
    { id: 'DEV-001', name: 'Chemistry Analyzer (Cobas c311)' },
    { id: 'DEV-002', name: 'Hematology Analyzer (Sysmex XN)' },
    { id: 'DEV-003', name: 'Coagulation Analyzer (ACL Elite)' },
];


export default function DataMappingPage() {
    const { toast } = useToast();
    const [selectedDevice, setSelectedDevice] = React.useState<string | undefined>(mockDevices[0].id);
    const [mappings, setMappings] = React.useState<MappingRow[]>([]);

    React.useEffect(() => {
        if(selectedDevice) {
            setMappings(initialMappings[selectedDevice] || []);
        }
    }, [selectedDevice]);


    const handleDeviceChange = (deviceId: string) => {
        setSelectedDevice(deviceId);
    };
    
    const handleMappingChange = (id: number, field: keyof MappingRow, value: string) => {
        setMappings(currentMappings =>
            currentMappings.map(m => m.id === id ? { ...m, [field]: value } : m)
        );
    };

    const addRow = () => {
        setMappings(current => [...current, { id: Date.now(), instrumentCode: '', lisCode: '', satusehatCode: '' }]);
    };
    
    const deleteRow = (id: number) => {
        setMappings(current => current.filter(m => m.id !== id));
    }

    const handleSave = () => {
        toast({
            title: "Mapping Saved",
            description: `Data mapping for device ${selectedDevice} has been successfully saved.`,
        });
    }

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Data Mapping Engine</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <GitFork className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Data Mapping Engine</CardTitle>
                            <CardDescription>Map instrument test codes to LIS and SATUSEHAT (LOINC) standards.</CardDescription>
                        </div>
                    </div>
                     <div className="w-full sm:w-72 flex-shrink-0">
                        <Select value={selectedDevice} onValueChange={handleDeviceChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an instrument" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockDevices.map(device => (
                                    <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30%]">Instrument Code</TableHead>
                            <TableHead className="w-[30%]">LIS Code</TableHead>
                            <TableHead>SATUSEHAT Code (LOINC)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mappings.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Input value={row.instrumentCode} onChange={(e) => handleMappingChange(row.id, 'instrumentCode', e.target.value)} placeholder="e.g., GLU_c" />
                                    </TableCell>
                                    <TableCell>
                                         <Input value={row.lisCode} onChange={(e) => handleMappingChange(row.id, 'lisCode', e.target.value)} placeholder="e.g., GLU" />
                                    </TableCell>
                                    <TableCell>
                                         <Input value={row.satusehatCode} onChange={(e) => handleMappingChange(row.id, 'satusehatCode', e.target.value)} placeholder="e.g., 2345-7" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => deleteRow(row.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {mappings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No mappings for this device. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={addRow}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Row
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save Mapping
                    </Button>
                </div>
            </CardContent>
        </Card>
    </MainLayout>
  );
}
