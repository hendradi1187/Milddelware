
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function BusinessLogicPage() {

  return (
    <MainLayout>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Business Logic Layer</span>
      </div>
      
       <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <SlidersHorizontal className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Business Logic Layer</CardTitle>
                            <CardDescription>Define custom rules to validate, flag, or automatically handle lab results.</CardDescription>
                        </div>
                    </div>
                     <Button disabled>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add New Rule
                     </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Feature Under Development</AlertTitle>
                    <AlertDescription>
                        The rule editor is currently under development. In the future, this is where you will be able to define specific validation logic for your data processing pipeline.
                        <br/><br/>
                        <p className="font-semibold">Example Rules:</p>
                        <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                            <li>IF `Test Code` is `GLU` AND `Result` is `> 180` THEN `Flag` as `High-Critical`.</li>
                            <li>IF `Patient Type` is `Pediatric` AND `Test Code` is `HGB` AND `Result` is `< 10` THEN `Require Verification`.</li>
                            <li>IF `Instrument ID` is `DEV-005` AND `Result` is `null` THEN `Reject` and `Log Error`.</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </MainLayout>
  );
}
