'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit, ShieldCheck, UserCog, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'Admin' | 'Technician' | 'QA';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: 'usr-001', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@medfusion.com', role: 'Admin', lastLogin: '2023-10-27 10:30' },
  { id: 'usr-002', name: 'Markus Crane', email: 'markus.crane@medfusion.com', role: 'Technician', lastLogin: '2023-10-27 11:15' },
  { id: 'usr-003', name: 'Lena Petrova', email: 'lena.petrova@medfusion.com', role: 'Technician', lastLogin: '2023-10-26 18:45' },
  { id: 'usr-004', name: 'Kenji Tanaka', email: 'kenji.tanaka@medfusion.com', role: 'QA', lastLogin: '2023-10-27 09:05' },
];

const roleConfig: Record<UserRole, { icon: React.ElementType, className: string }> = {
  Admin: { icon: ShieldCheck, className: 'bg-primary/10 text-primary border-primary/20' },
  Technician: { icon: UserCog, className: 'bg-blue-100 text-blue-800 border-blue-200' },
  QA: { icon: Eye, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
};

export default function UserManagementPage() {
  const [users, setUsers] = React.useState(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser: User = {
      id: `usr-00${users.length + 1}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setUsers([...users, newUser]);
    setIsDialogOpen(false);
  };


  return (
    <MainLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add, edit, or remove users and manage their roles.</CardDescription>
          </div>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the user's details and assign a role. An invitation will be sent to their email.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Full Name</Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" name="email" type="email" className="col-span-3" required />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                     <Select name="role" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="QA">QA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const config = roleConfig[user.role];
                const Icon = config.icon;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize gap-1.5", config.className)}>
                        <Icon className="h-3.5 w-3.5" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">User Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
