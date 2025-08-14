'use client';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LabResultsTable } from '@/components/dashboard/lab-results-table';

const leveyJenningsData = [
  { name: 'Day 1', value: 102, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 2', value: 99, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 3', value: 107, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 4', value: 95, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 5', value: 110, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 6', value: 89, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
  { name: 'Day 7', value: 104, mean: 100, sd_plus_1: 105, sd_minus_1: 95, sd_plus_2: 110, sd_minus_2: 90 },
];

export default function QAPage() {
  return (
    <MainLayout>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Quality Control / Quality Assurance</CardTitle>
                <CardDescription>Monitor and manage QC/QA results and charts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Levey-Jennings Chart (Simulated)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leveyJenningsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[80, 120]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" name="QC Value" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <p className="text-xs text-muted-foreground mt-2 text-center">
                           This is a simulated Levey-Jennings chart for demonstration purposes.
                        </p>
                    </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>QC Results</CardTitle>
                            <CardDescription>Review and manage Quality Control results.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LabResultsTable statusFilter='QC' />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    </MainLayout>
  );
}
