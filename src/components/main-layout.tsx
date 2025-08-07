'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CircuitBoard,
  Beaker,
  FileText,
  Settings,
  FlaskConical,
  Bell,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

// Mock user role
const userRole = 'Admin'; // Can be 'Admin', 'Technician', or 'QA'

const allMenuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Technician', 'QA'] },
  { href: '/devices', label: 'Devices', icon: CircuitBoard, roles: ['Admin', 'Technician'] },
  { href: '/results', label: 'Results', icon: Beaker, roles: ['Admin', 'Technician', 'QA'] },
  { href: '/qa', label: 'QA / QC', icon: ClipboardCheck, roles: ['Admin', 'QA'] },
  { href: '/logs', label: 'Logs', icon: FileText, roles: ['Admin', 'Technician'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null);

  React.useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
        setUser({ name: 'Admin User', role: 'Admin' });
    }, 500);
  }, []);

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));
  const settingsItem = allMenuItems.find(item => item.href === '/settings');

  // Filter out settings from the main list if it exists
  const mainMenuItems = menuItems.filter(item => item.href !== '/settings');
  const userCanSeeSettings = settingsItem && user && settingsItem.roles.includes(user.role);

  const getPageTitle = () => {
    const currentItem = allMenuItems.find(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
    return currentItem ? currentItem.label : 'Dashboard';
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r">
        <SidebarHeader>
          <div className="flex h-10 items-center justify-center gap-2 p-2 group-data-[collapsible=icon]:hidden">
            <FlaskConical className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">LabBridge</span>
          </div>
           <div className="hidden h-10 items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {userCanSeeSettings && settingsItem && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href={settingsItem.href}
                  isActive={pathname.startsWith(settingsItem.href)}
                  tooltip={{ children: settingsItem.label }}
                >
                  <settingsItem.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user ? (
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/40x40.png" alt={user.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                ) : (
                    <Skeleton className="h-8 w-8 rounded-full" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                {user.role}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <div className="p-2">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
