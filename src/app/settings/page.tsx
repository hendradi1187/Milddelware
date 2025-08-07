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
import { UploadCloud, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const mockUsers = [
  { id: 'user-1', email: 'admin@medfusion.com', role: 'Admin' },
  { id: 'user-2', email: 'technician1@medfusion.com', role: 'Technician' },
  { id: 'user-3', email: 'qa.specialist@medfusion.com', role: 'QA' },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [users, setUsers] = React.useState(mockUsers);
    const [offlineMode, setOfflineMode] = React.useState(false);
    const [mappingFile, setMappingFile] = React.useState<File | null>(null);
    const [mappingData, setMappingData] = React.useState<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setMappingFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    setMappingData(json);
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Invalid JSON',
                        description: 'The uploaded file is not a valid JSON file.',
                    });
                    setMappingData(null);
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleSaveMapping = () => {
        if (mappingData) {
            // In a real app, this would save to Firestore
            toast({
                title: 'Mapping Saved',
                description: 'The mapping configuration has been saved.',
            });
        }
    };

    const handleClearLogs = () => {
      // In a real app, this would clear the 'logs' collection in Firestore
      toast({
          title: 'Logs Cleared',
          description: 'All log data has been permanently deleted.',
          variant: 'destructive'
      });
    };
    
    const removeUser = (id: string) => {
      setUsers(users.filter(user => user.id !== id));
      toast({
          title: 'User Removed',
          description: 'The user has been removed from the system.',
      });
    }

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
                 <Input id="json-upload" type="file" accept=".json" className="max-w-xs" onChange={handleFileChange} />
                 <Button onClick={handleSaveMapping} disabled={!mappingData}><UploadCloud className="mr-2 h-4 w-4"/> Upload & Save</Button>
               </div>
               <p className="text-xs text-muted-foreground">
                Upload a JSON file containing the mapping configuration.
              </p>
              {mappingData && (
                <div className="w-full mt-4">
                  <h4 className="font-semibold mb-2">Mapping Preview</h4>
                  <pre className="bg-muted p-4 rounded-md text-xs max-h-60 overflow-auto">
                    {JSON.stringify(mappingData, null, 2)}
                  </pre>
                </div>
              )}
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
                  <TableHead className="w-[50px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
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
                          <SelectItem value="QA">QA</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => removeUser(user.id)}>
                          <Trash2 className="h-4 w-4 text-destructive"/>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage application-wide settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-semibold">Offline Mode</h4>
                        <p className="text-sm text-muted-foreground">
                            Enable to store results locally if the LIS connection is down.
                        </p>
                    </div>
                    <Switch
                        checked={offlineMode}
                        onCheckedChange={setOfflineMode}
                        aria-label="Toggle offline mode"
                    />
                </div>
                <div>
                    <h4 className="font-semibold">Data Management</h4>
                    <p className="text-sm text-muted-foreground mb-2">Manage application log data.</p>
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
                        <AlertDialogAction onClick={handleClearLogs}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-muted-foreground mt-2">
                    This will clear all entries from the 'logs' collection in Firestore.
                    </p>
                </div>
            </CardContent>
         </Card>
      </div>
    </MainLayout>
  );
}
