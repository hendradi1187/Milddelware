'use client';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UploadCloud, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 'user-1', email: 'admin@medfusion.com', role: 'Admin' },
  { id: 'user-2', email: 'technician1@medfusion.com', role: 'Technician' },
];

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mapping Configuration</CardTitle>
            <CardDescription>Upload and manage device-to-LIS test code mappings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 items-start">
               <div className="flex items-center gap-2">
                 <Label htmlFor="json-upload" className="sr-only">Upload JSON</Label>
                 <Input id="json-upload" type="file" accept=".json" className="max-w-xs" />
                 <Button><UploadCloud className="mr-2 h-4 w-4"/> Upload</Button>
               </div>
               <p className="text-xs text-muted-foreground">
                Upload a JSON file containing the mapping configuration.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Assign roles to users to control access to the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead className="w-[200px]">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Select defaultValue={user.role}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Technician">Technician</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage application log data.</CardDescription>
          </CardHeader>
          <CardContent>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Clear Log Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all log data from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2">
              This will clear all entries from the 'logs' collection in Firestore.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
