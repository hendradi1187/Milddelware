'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LabResultStatus = 'Pending' | 'Sent' | 'Failed' | 'QC' | 'All';

export default function ResultsPage() {
    const [statusFilter, setStatusFilter] = React.useState<LabResultStatus>('All');
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleExport = () => {
        // This is a placeholder. In a real app, you would generate a CSV from the filtered data.
        alert("Exporting to CSV is not implemented yet.");
    };

    return (
        <MainLayout>
        <Card>
            <CardHeader>
            <CardTitle>Lab Results</CardTitle>
            <CardDescription>Browse and filter all lab results.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Filter by Patient ID or Test Code..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={(value: LabResultStatus) => setStatusFilter(value)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                                <SelectItem value="QC">QC</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
                <LabResultsTable statusFilter={statusFilter} searchQuery={searchQuery} />
            </CardContent>
        </Card>
        </MainLayout>
    );
}
