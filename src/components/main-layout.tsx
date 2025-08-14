
'use client';

import React from 'react';
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
  ShieldCheck,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const allMenuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Technician', 'QA'] },
  { href: '/devices', label: 'Devices', icon: CircuitBoard, roles: ['Admin', 'Technician'] },
  { href: '/results', label: 'Results', icon: Beaker, roles: ['Admin', 'Technician', 'QA'] },
  { href: '/qa', label: 'QA / QC', icon: ClipboardCheck, roles: ['Admin', 'QA'] },
  { href: '/logs', label: 'Logs', icon: FileText, roles: ['Admin', 'Technician'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
];

const mockNotifications = [
    {
        id: 1,
        type: 'error',
        title: 'Device Disconnected',
        description: 'Chemistry Analyzer XL-200 went offline.',
        time: '5m ago'
    },
    {
        id: 2,
        type: 'success',
        title: 'Batch Sent',
        description: 'Batch #124 successfully sent to LIS.',
        time: '1h ago'
    },
     {
        id: 3,
        type: 'warning',
        title: 'Pending Results High',
        description: 'Over 50 results are pending dispatch.',
        time: '3h ago'
    }
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userRole, loading, logout } = useAuth();
  
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <FlaskConical className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-muted-foreground">Loading LabBridge Medfusion...</p>
            </div>
        </div>
    );
  }

  if (!user || !userRole) {
    // This handles the case where the user is somehow authenticated but role hasn't been fetched yet.
    // It also ensures that we don't proceed to render the main layout without a user session.
    // The useAuth hook will handle redirection to /login.
    return null;
  }

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  const settingsItem = allMenuItems.find(item => item.href === '/settings');

  const mainMenuItems = menuItems.filter(item => item.href !== '/settings');
  const userCanSeeSettings = settingsItem && settingsItem.roles.includes(userRole);
  
  const isMenuActive = (href: string) => {
    if (href === '/') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    // For dashboard, we return an empty string to not show a title in the header
    if (pathname === '/') return '';
    
    // Find the current item, but handle nested routes
    const currentItem = allMenuItems.find(item => item.href !== '/' && pathname.startsWith(item.href));

    return currentItem ? currentItem.label : '';
  }

  const pageTitle = getPageTitle();

  const NotificationIcon = ({type}: {type: string}) => {
    switch(type) {
        case 'error': return <AlertCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />;
        case 'success': return <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />;
        default: return <Bell className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />;
    }
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r-0 bg-gradient-to-b from-[hsl(var(--sidebar-background))] to-[hsl(var(--sidebar-background-end))] text-sidebar-foreground">
        <SidebarHeader>
           <div className="flex h-14 items-center justify-start gap-3 p-4 group-data-[collapsible=icon]:hidden">
            <Image src="/images/logo.png" alt="App Logo" width={28} height={28} className="h-7 w-7" />
            <span className="text-lg font-bold text-white">Middleware LIS</span>
          </div>
           <div className="hidden h-14 items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <Image src="/images/logo.png" alt="App Logo" width={28} height={28} className="h-7 w-7" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isMenuActive(item.href)}
                  tooltip={{ children: item.label }}
                  className="data-[active=true]:bg-black/20 hover:bg-black/10"
                >
                  <Link href={item.href}>
                    <item.icon className="text-white/80" />
                    <span className="text-white">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          {userCanSeeSettings && settingsItem && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isMenuActive(settingsItem.href)}
                    tooltip={{ children: settingsItem.label }}
                    className="data-[active=true]:bg-black/20 hover:bg-black/10"
                >
                  <Link href={settingsItem.href}>
                    <settingsItem.icon className="text-white/80" />
                    <span className="text-white">{settingsItem.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="mt-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 px-2 flex items-center gap-3 cursor-pointer hover:bg-black/10 rounded-md p-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? "/images/default-avatar.png"} alt={user.displayName ?? 'User'} data-ai-hint="person portrait"/>
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium leading-none text-white">{user.displayName ?? user.email}</p>
                        <p className="text-xs leading-none text-white/70 flex items-center gap-1.5 pt-1">
                            {userRole === 'Admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                            {userRole}
                        </p>
                    </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                  <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName ?? user.email}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                          {userRole}
                          </p>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/settings/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
       <header className="flex h-14 items-center justify-between gap-4 border-b bg-card p-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold">{pageTitle}</h1>
            </div>
             <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                            <Bell className="h-5 w-5" />
                            {mockNotifications.length > 0 && (
                                <span className="absolute top-0 right-0 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 md:w-96">
                        <DropdownMenuLabel className="flex justify-between items-center">
                            <span>Notifications</span>
                            <Badge variant="secondary">{mockNotifications.length} New</Badge>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-80 overflow-y-auto">
                            {mockNotifications.map(notif => (
                                 <DropdownMenuItem key={notif.id} className="p-3 items-start cursor-pointer">
                                    <NotificationIcon type={notif.type} />
                                    <div className="ml-3">
                                        <p className="font-semibold text-sm">{notif.title}</p>
                                        <p className="text-xs text-muted-foreground">{notif.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="justify-center py-2">
                           <Link href="/logs">
                                View all logs
                            </Link>
                        </DropdownMenuItem>
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

    