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
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';

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
  const { user, userRole, loading, logout } = useAuth();
  
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-sidebar-background">
            <div className="flex flex-col items-center gap-4">
                <FlaskConical className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-muted-foreground">Loading LabBridge Medfusion...</p>
            </div>
        </div>
    );
  }

  if (!user) {
    return null; // Or a redirect component, but useAuth hook handles redirection
  }

  const menuItems = allMenuItems.filter(item => userRole && item.roles.includes(userRole));
  const settingsItem = allMenuItems.find(item => item.href === '/settings');

  const mainMenuItems = menuItems.filter(item => item.href !== '/settings');
  const userCanSeeSettings = settingsItem && userRole && settingsItem.roles.includes(userRole);
  
  const isMenuActive = (href: string) => {
    if (href === '/') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    const currentItem = allMenuItems.find(item => isMenuActive(item.href));
    // For dashboard, we return an empty string to not show a title in the header
    return currentItem ? (currentItem.href === '/' ? '' : currentItem.label) : '';
  }

  const pageTitle = getPageTitle();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r-0 bg-gradient-to-b from-[hsl(var(--sidebar-background))] to-[hsl(var(--sidebar-background-end))] text-sidebar-foreground">
        <SidebarHeader>
           <div className="flex h-14 items-center justify-start gap-3 p-4 group-data-[collapsible=icon]:hidden">
            <Image src="/logo.png" alt="App Logo" width={28} height={28} className="h-7 w-7" />
            <span className="text-lg font-bold text-white">Middleware LIS</span>
          </div>
           <div className="hidden h-14 items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <Image src="/logo.png" alt="App Logo" width={28} height={28} className="h-7 w-7" />
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
        <SidebarFooter>
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
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
       {/* Only render header if there is a page title */}
        {pageTitle && (
            <header className="flex h-14 items-center justify-between gap-4 border-b bg-card p-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL ?? "https://placehold.co/40x40.png"} alt={user.displayName ?? 'User'} data-ai-hint="person portrait"/>
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName ?? user.email}</p>

                                <p className="text-xs leading-none text-muted-foreground flex items-center gap-1.5 pt-1">
                                    {userRole === 'Admin' && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                                    {userRole}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
